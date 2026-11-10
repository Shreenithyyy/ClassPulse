
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    exit;
}

include "db.php";

$sql = "SELECT * FROM feedback ORDER BY id DESC";

$result = mysqli_query($conn, $sql);

$feedback = [];

while ($row = mysqli_fetch_assoc($result)) {
    $feedback[] = $row;
}

echo json_encode($feedback);

?>
