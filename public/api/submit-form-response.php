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
if (!$data || !isset($data['applicantId']) || !isset($data['eventId']) || !isset($data['responses'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters']);
    exit();
}

$applicantId = $data['applicantId'];
$eventId = $data['eventId'];
$responses = $data['responses'];
$applicantName = $data['applicantName'] ?? '不明';
$eventName = $data['eventName'] ?? '不明';
$eventStage = $data['eventStage'] ?? '不明';

// 送信先メールアドレス（実際の担当者メールアドレスに変更）
$to = 'hr@yourcompany.com'; // 実際のメールアドレスに変更
$subject = "【日程調整回答】{$applicantName}様 - {$eventName}";

// メール本文を作成
$body = createEmailBody($applicantName, $eventName, $eventStage, $responses);

// 送信者情報
$from = 'noreply@yourdomain.com'; // 実際のドメインに変更
$fromName = '採用管理システム';

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
    // 送信ログを記録
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'applicantId' => $applicantId,
        'eventId' => $eventId,
        'applicantName' => $applicantName,
        'eventName' => $eventName,
        'status' => 'sent'
    ];
    
    // ログファイルに記録
    $logDir = __DIR__ . '/../logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logFile = $logDir . '/form_response_log.txt';
    file_put_contents($logFile, json_encode($logData) . "\n", FILE_APPEND | LOCK_EX);
    
    echo json_encode([
        'success' => true,
        'message' => 'フォーム回答が正常に送信されました',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'メール送信に失敗しました',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

function createEmailBody($applicantName, $eventName, $eventStage, $responses) {
    $body = "採用担当者 各位\n\n";
    $body .= "日程調整フォームへの回答がありました。\n\n";
    $body .= "【応募者情報】\n";
    $body .= "氏名: {$applicantName}\n";
    $body .= "イベント: {$eventName}\n";
    $body .= "選考段階: {$eventStage}\n\n";
    $body .= "【回答内容】\n";
    
    foreach ($responses as $sessionId => $response) {
        $sessionName = $response['sessionName'] ?? '不明なセッション';
        $sessionDate = $response['sessionDate'] ?? '';
        $sessionTime = $response['sessionTime'] ?? '';
        $sessionVenue = $response['sessionVenue'] ?? '';
        
        $status = '';
        switch ($response['status']) {
            case 'participate':
                $status = '参加';
                break;
            case 'not_participate':
                $status = '不参加';
                break;
            case 'pending':
                $status = '保留';
                break;
            default:
                $status = '未回答';
        }
        
        $body .= "・{$sessionName}\n";
        $body .= "  日時: {$sessionDate} {$sessionTime}\n";
        $body .= "  会場: {$sessionVenue}\n";
        $body .= "  回答: {$status}\n\n";
    }
    
    $body .= "回答日時: " . date('Y年m月d日 H:i:s') . "\n";
    $body .= "---\n";
    $body .= "このメールは採用管理システムから自動送信されています。\n";
    
    return $body;
}
?> 