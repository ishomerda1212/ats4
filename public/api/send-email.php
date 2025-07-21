<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONSリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// POSTリクエストのみ許可
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// JSONデータを取得
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// 必須パラメータのチェック
if (!$data || !isset($data['to']) || !isset($data['subject']) || !isset($data['body'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters']);
    exit();
}

$to = $data['to'];
$subject = $data['subject'];
$body = $data['body'];
$applicantId = $data['applicantId'] ?? '';
$stage = $data['stage'] ?? '';

// メールアドレスの形式チェック
if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit();
}

// 送信者情報（GMOサーバーの設定に合わせて変更）
$from = 'noreply@yourdomain.com'; // 実際のドメインに変更
$fromName = '採用担当者';

// メールヘッダーの設定
$headers = array();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: ' . $fromName . ' <' . $from . '>';
$headers[] = 'Reply-To: ' . $from;
$headers[] = 'X-Mailer: PHP/' . phpversion();

// 本文をUTF-8でエンコード
$encodedSubject = mb_encode_mimeheader($subject, 'UTF-8');
$encodedBody = mb_convert_encoding($body, 'UTF-8', 'AUTO');

// メール送信
$mailSent = mail($to, $encodedSubject, $encodedBody, implode("\r\n", $headers));

if ($mailSent) {
    // 送信ログを記録（オプション）
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'to' => $to,
        'subject' => $subject,
        'applicantId' => $applicantId,
        'stage' => $stage,
        'status' => 'sent'
    ];
    
    // ログファイルに記録（logsディレクトリを作成する必要があります）
    $logDir = __DIR__ . '/../logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logFile = $logDir . '/email_log.txt';
    file_put_contents($logFile, json_encode($logData) . "\n", FILE_APPEND | LOCK_EX);
    
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send email',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?> 