
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();

if (($_SESSION["role"] ?? "") !== "faculty") {
    http_response_code(403);
    echo json_encode(["error" => "Faculty login required."]);
    exit;
}

include "db.php";

$sql = "SELECT id, username, email, role, status
        FROM students
        WHERE role = 'student'
        AND status = 'approved'
        ORDER BY username ASC";

$result = mysqli_query($conn, $sql);

$students = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $students[] = $row;
    }
}

echo json_encode($students);

?>
