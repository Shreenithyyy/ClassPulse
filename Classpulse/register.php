
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: text/plain; charset=UTF-8");


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Use the registration form.");
}

include "db.php";

$name = trim($_POST["name"] ?? "");
$email = strtolower(trim($_POST["email"] ?? ""));
$password = $_POST["password"] ?? "";
$initialPassword = $_POST["initial_password"] ?? "";

if ($name === "" || $email === "" || $password === "") {
    http_response_code(400);
    exit("Please fill in all required fields.");
}

if (strlen($name) > 100) {
    http_response_code(400);
    exit("Name is too long.");
}

if (
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !str_ends_with($email, "@stellamariscollege.edu.in")
) {
    http_response_code(400);
    exit("Please use a valid college email address.");
}

if (strlen($password) < 8) {
    http_response_code(400);
    exit("Your new password must contain at least 8 characters.");
}

$username = strstr($email, "@", true);

/* Check whether this account already exists. */
$sql = "SELECT id, username, password, role, status, name
        FROM students
        WHERE username = ? OR email = ?
        LIMIT 1";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "ss", $username, $email);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);
$existing = mysqli_fetch_assoc($result);

mysqli_stmt_close($stmt);

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

if ($existing) {

    /*
       Existing student accounts can be activated only
       with their current initial password.
    */
    $isInitialPasswordValid = false;

    if ($initialPassword !== "") {
        $isInitialPasswordValid =
            password_verify($initialPassword, $existing["password"]) ||
            hash_equals($existing["password"], $initialPassword);
    }

    if (
        $existing["role"] !== "student" ||
        $existing["status"] !== "pending" ||
        trim($existing["name"] ?? "") !== "" ||
        $existing["username"] !== $username ||
        strtolower($email) !== strtolower($email) ||
        !$isInitialPasswordValid
    ) {
        http_response_code(409);
        exit("Account already exists or activation details are incorrect.");
    }

    $sql = "UPDATE students
            SET name = ?, password = ?, login_attempted = 0
            WHERE id = ?";

    $stmt = mysqli_prepare($conn, $sql);

    mysqli_stmt_bind_param(
        $stmt,
        "ssi",
        $name,
        $hashedPassword,
        $existing["id"]
    );

    if (mysqli_stmt_execute($stmt)) {
        echo "Account setup successful. Please wait for faculty approval.";
    } else {
        http_response_code(500);
        echo "Account setup failed. Please try again.";
    }

    mysqli_stmt_close($stmt);

} else {

    /* Create a new student account. */
    $sql = "INSERT INTO students
            (username, name, email, password, role, status, login_attempted)
            VALUES (?, ?, ?, ?, 'student', 'pending', 0)";

    $stmt = mysqli_prepare($conn, $sql);

    mysqli_stmt_bind_param(
        $stmt,
        "ssss",
        $username,
        $name,
        $email,
        $hashedPassword
    );

    if (mysqli_stmt_execute($stmt)) {
        echo "Registration successful. Please wait for faculty approval.";
    } else {
        http_response_code(500);
        echo "Registration could not be completed. Please try again.";
    }

    mysqli_stmt_close($stmt);
}

mysqli_close($conn);

?>
