<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$title = trim($_POST["title"] ?? "");
$message = trim($_POST["message"] ?? "");

if ($title === "" || $message === "") {
    exit("Please enter both title and message");
}

$sql = "INSERT INTO reminders (title, message) VALUES (?, ?)";
$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param($stmt, "ss", $title, $message);

if (mysqli_stmt_execute($stmt)) {
    echo "Reminder added successfully";
} else {
    echo "Could not add reminder";
}

mysqli_stmt_close($stmt);

?>