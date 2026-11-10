
<?php

include "db.php";

$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);
$action = $_GET["action"] ?? "download";

if (!$id || !in_array($action, ["view", "download"])) {
    http_response_code(400);
    exit("Invalid request");
}

$stmt = mysqli_prepare(
    $conn,
    "SELECT original_name, stored_name FROM note_files WHERE id = ?"
);

mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$file = mysqli_fetch_assoc($result);

if (!$file) {
    http_response_code(404);
    exit("File not found");
}

$path = __DIR__ . "/uploads/" . basename($file["stored_name"]);

if (!is_file($path)) {
    http_response_code(404);
    exit("Uploaded file is missing");
}

$extension = strtolower(pathinfo($file["original_name"], PATHINFO_EXTENSION));

$types = [
    "pdf" => "application/pdf",
    "jpg" => "image/jpeg",
    "jpeg" => "image/jpeg",
    "png" => "image/png",
    "gif" => "image/gif",
    "webp" => "image/webp"
];

$mime = $types[$extension] ?? "application/octet-stream";
$disposition = $action === "view" ? "inline" : "attachment";

header("Content-Type: " . $mime);
header(
    "Content-Disposition: " . $disposition .
    "; filename=\"" . basename($file["original_name"]) . "\""
);
header("X-Content-Type-Options: nosniff");

readfile($path);

mysqli_stmt_close($stmt);

?>
