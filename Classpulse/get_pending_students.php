
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

session_start();

if (($_SESSION["role"] ?? "") !== "faculty") {
    http_response_code(403);
    echo json_encode(["error" => "Faculty login required."]);
    exit;
}

include "db.php";


$sql = "SELECT id, username, email, status
        FROM students
        WHERE role = 'student'
        AND status = 'pending'
        AND login_attempted = 1
        ORDER BY id ASC";

$result = mysqli_query($conn, $sql);

$students = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $students[] = $row;
    }
}

echo json_encode($students);

?>
