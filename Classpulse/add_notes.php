
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$title = $_POST["title"];
$content = $_POST["content"];

$sql = "INSERT INTO notes (title, content)
        VALUES ('$title', '$content')";

if (mysqli_query($conn, $sql)) {
    echo "Notes saved successfully";
} else {
    echo "Error saving notes";
}

?>
