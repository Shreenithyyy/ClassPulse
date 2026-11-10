
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: text/plain");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

session_start();

if (($_SESSION["role"] ?? "") !== "faculty") {
    http_response_code(403);
    exit("Faculty login required.");
}

include "db.php";

$id = $_POST["id"] ?? "";
$status = $_POST["status"] ?? "";

if ($id === "" || !in_array($status, ["approved", "rejected"], true)) {
    http_response_code(400);
    exit("Invalid student ID or status.");
}

$sql = "UPDATE students
        SET status = ?
        WHERE id = ? AND role = 'student'";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "si", $status, $id);
mysqli_stmt_execute($stmt);

if (mysqli_stmt_affected_rows($stmt) > 0) {
    echo "Student status updated successfully.";
} else {
    echo "No student was updated. Check the student ID or current status.";
}

mysqli_stmt_close($stmt);

?>
