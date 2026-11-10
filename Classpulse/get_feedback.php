
<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "db.php";

$student_id = $_POST["student_id"] ?? "";

if ($student_id === "") {
    echo json_encode([]);
    exit;
}

$sql = "SELECT * FROM feedback WHERE student_id = ?";
$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param($stmt, "s", $student_id);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

$responses = [];

while ($row = mysqli_fetch_assoc($result)) {
    $responses[] = $row;
}

echo json_encode($responses);

mysqli_stmt_close($stmt);
?>
