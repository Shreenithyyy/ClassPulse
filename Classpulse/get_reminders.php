<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

include "db.php";

$sql = "SELECT id, title, message FROM reminders ORDER BY id DESC";
$result = mysqli_query($conn, $sql);

$reminders = [];

while ($row = mysqli_fetch_assoc($result)) {
    $reminders[] = $row;
}

echo json_encode($reminders);

?>