
<?php

session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

include "db.php";

$username = trim($_POST["username"] ?? "");
$password = $_POST["password"] ?? "";

if ($username === "" || $password === "") {
    exit("Invalid username or password");
}

$sql = "SELECT id, username, password, role, status
        FROM students
        WHERE username = ? OR email = ?
        LIMIT 1";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "ss",
    $username,
    $username
);

mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

mysqli_stmt_close($stmt);

if ($user && (
    password_verify($password, $user["password"]) ||
    hash_equals($user["password"], $password)
)) {

    // Convert an old plain-text password to a secure hash.
    if (hash_equals($user["password"], $password)) {

        $hashedPassword = password_hash(
            $password,
            PASSWORD_DEFAULT
        );

        $update = mysqli_prepare(
            $conn,
            "UPDATE students SET password = ? WHERE id = ?"
        );

        mysqli_stmt_bind_param(
            $update,
            "si",
            $hashedPassword,
            $user["id"]
        );

        mysqli_stmt_execute($update);
        mysqli_stmt_close($update);
    }

    if ($user["role"] === "student") {

        $attempt = mysqli_prepare(
            $conn,
            "UPDATE students
             SET login_attempted = 1
             WHERE id = ?"
        );

        mysqli_stmt_bind_param(
            $attempt,
            "i",
            $user["id"]
        );

        mysqli_stmt_execute($attempt);
        mysqli_stmt_close($attempt);
    }

    if ($user["status"] !== "approved") {

        if ($user["status"] === "rejected") {
            echo "Your account was rejected. Contact faculty.";
        } else {
            echo "Your account is waiting for faculty approval.";
        }

    } else {

        session_regenerate_id(true);

        $_SESSION["user_id"] = $user["id"];
        $_SESSION["role"] = $user["role"];

        echo $user["id"] . "|" . $user["role"];
    }

} else {

    echo "Invalid username or password";
}

mysqli_close($conn);

?>
