
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit("Invalid request");
}

$title = trim($_POST["title"] ?? "");

if ($title === "" || !isset($_FILES["file"])) {
    exit("Please enter a title and choose a file");
}

$file = $_FILES["file"];

if ($file["error"] !== UPLOAD_ERR_OK) {
    exit("File upload failed");
}

$allowed = [
    "pdf" => "application/pdf",
    "doc" => "application/msword",
    "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "ppt" => "application/vnd.ms-powerpoint",
    "pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "jpg" => "image/jpeg",
    "jpeg" => "image/jpeg",
    "png" => "image/png",
    "gif" => "image/gif",
    "webp" => "image/webp"
];

$extension = strtolower(
    pathinfo($file["name"], PATHINFO_EXTENSION)
);

if (!isset($allowed[$extension])) {
    exit("File type not allowed");
}

if ($file["size"] > 10 * 1024 * 1024) {
    exit("Maximum file size is 10 MB");
}

if (!is_uploaded_file($file["tmp_name"])) {
    exit("Invalid uploaded file");
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file["tmp_name"]);

if ($mime !== $allowed[$extension]) {
    exit("The file content does not match its extension");
}

$storedName = bin2hex(random_bytes(16)) . "." . $extension;
$folder = __DIR__ . "/uploads/";

if (!is_dir($folder)) {
    exit("Uploads folder not found");
}

if (!move_uploaded_file(
    $file["tmp_name"],
    $folder . $storedName
)) {
    exit("Could not save the uploaded file");
}

$sql = "INSERT INTO note_files
        (title, original_name, stored_name)
        VALUES (?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "sss",
    $title,
    $file["name"],
    $storedName
);

if (mysqli_stmt_execute($stmt)) {
    echo "File uploaded successfully";
} else {
    unlink($folder . $storedName);
    echo "Could not save file details";
}

mysqli_stmt_close($stmt);

?>
