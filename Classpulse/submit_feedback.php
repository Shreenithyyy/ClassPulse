<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$student_id = $_POST["student_id"];
$topic = $_POST["topic"];
$rating = $_POST["rating"];
$comment = $_POST["comment"];

$sql = "INSERT INTO feedback (student_id, topic, rating, comment)
        VALUES ('$student_id', '$topic', '$rating', '$comment')";

if (mysqli_query($conn, $sql)) {
    echo "Feedback saved successfully";
} else {
    echo "Error saving feedback";
}

?>