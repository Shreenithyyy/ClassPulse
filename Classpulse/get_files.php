
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

include "db.php";

$sql = "SELECT id, title, original_name, stored_name
        FROM note_files
        ORDER BY id DESC";

$result = mysqli_query($conn, $sql);

$files = [];

while ($row = mysqli_fetch_assoc($result)) {
    $files[] = $row;
}

echo json_encode($files);

?>
