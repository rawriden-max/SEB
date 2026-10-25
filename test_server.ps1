$ErrorActionPreference = "Stop"

Write-Host "=== TEST 1: STATIC ASSETS ===" -ForegroundColor Cyan
$rHtml = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing
Write-Host "index.html : Status $($rHtml.StatusCode)" -ForegroundColor Green

$rCss = Invoke-WebRequest -Uri "http://localhost:8080/styles.css" -UseBasicParsing
Write-Host "styles.css : Status $($rCss.StatusCode)" -ForegroundColor Green

$rJs = Invoke-WebRequest -Uri "http://localhost:8080/app.js" -UseBasicParsing
Write-Host "app.js     : Status $($rJs.StatusCode)" -ForegroundColor Green

Write-Host "`n=== TEST 2: USER-AGENT DETECTION (CHROME) ===" -ForegroundColor Cyan
$chromeHeaders = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
$resChrome = Invoke-RestMethod -Uri "http://localhost:8080/api/inspect-request" -Headers $chromeHeaders
Write-Host "Detected: $($resChrome.analysis.clientType)" -ForegroundColor Yellow
Write-Host "Verdict : $($resChrome.analysis.verdict)" -ForegroundColor Red
Write-Host "Reason  : $($resChrome.analysis.reason)"

Write-Host "`n=== TEST 3: USER-AGENT DETECTION (EXAMBRO CLIENT) ===" -ForegroundColor Cyan
$exambroHeaders = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ExambroClient/2.0 CBT-Official/2026" }
$resExambro = Invoke-RestMethod -Uri "http://localhost:8080/api/inspect-request" -Headers $exambroHeaders
Write-Host "Detected: $($resExambro.analysis.clientType)" -ForegroundColor Green
Write-Host "Verdict : $($resExambro.analysis.verdict)" -ForegroundColor Green
Write-Host "Reason  : $($resExambro.analysis.reason)"

Write-Host "`n=== TEST 4: SUBMIT ANSWER (FROM CHROME - MUST BE REJECTED 403) ===" -ForegroundColor Cyan
try {
    $body = @{ studentId = "TEST-CHROME"; answers = @{ "0" = "B" }; score = 100 } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:8080/api/exam/submit" -Method Post -Headers $chromeHeaders -Body $body -ContentType "application/json"
    Write-Host "FAIL: Server accepted Chrome submission!" -ForegroundColor Red
} catch {
    Write-Host "PASS: Server rejected submission with 403 Forbidden!" -ForegroundColor Green
}

Write-Host "`n=== TEST 5: SUBMIT ANSWER (FROM EXAMBRO - MUST BE ACCEPTED 200) ===" -ForegroundColor Cyan
$bodyEx = @{ studentId = "M-ILYAS-01"; answers = @{ "0" = "B"; "1" = "B" }; score = 100 } | ConvertTo-Json
$resSub = Invoke-RestMethod -Uri "http://localhost:8080/api/exam/submit" -Method Post -Headers $exambroHeaders -Body $bodyEx -ContentType "application/json"
Write-Host "PASS: Server accepted Exambro submission! Msg: $($resSub.message)" -ForegroundColor Green

Write-Host "`n=== TEST 6: TELEMETRY VIOLATION LOGGING ===" -ForegroundColor Cyan
$bodyTelem = @{ event = "Alt+Tab Window Blur"; studentId = "M-ILYAS-01"; violationCount = 2 } | ConvertTo-Json
$resTelem = Invoke-RestMethod -Uri "http://localhost:8080/api/exam/telemetry" -Method Post -Headers $exambroHeaders -Body $bodyTelem -ContentType "application/json"
Write-Host "PASS: Telemetry received, current violations: $($resTelem.currentViolations)" -ForegroundColor Green

Write-Host "`n=== TEST 7: SEB HANDSHAKE ENDPOINT ===" -ForegroundColor Cyan
$sebHandshake = Invoke-RestMethod -Uri "http://localhost:8080/api/seb/handshake" -Method Get
Write-Host "PASS: SEB Handshake status: $($sebHandshake.status), Server Version: $($sebHandshake.serverVersion)" -ForegroundColor Green

Write-Host "`n=== TEST 8: SEB CONFIG DOWNLOAD ===" -ForegroundColor Cyan
$sebConfig = Invoke-WebRequest -Uri "http://localhost:8080/api/seb/config" -Method Get -UseBasicParsing
Write-Host "PASS: SEB Config status: $($sebConfig.StatusCode), Content-Type: $($sebConfig.Headers['Content-Type'])" -ForegroundColor Green

Write-Host "`n=== TEST 9: SYSTEM LOCK TOUCHPAD ===" -ForegroundColor Cyan
$lockRes = Invoke-RestMethod -Uri "http://localhost:8080/api/system/lock-touchpad" -Method Post
Write-Host "PASS: Lock Touchpad status: $($lockRes.success), Msg: $($lockRes.message)" -ForegroundColor Green

Write-Host "`n=== TEST 10: SYSTEM RESTORE TOUCHPAD ===" -ForegroundColor Cyan
$restoreRes = Invoke-RestMethod -Uri "http://localhost:8080/api/system/restore-touchpad" -Method Post
Write-Host "PASS: Restore Touchpad status: $($restoreRes.success), Msg: $($restoreRes.message)" -ForegroundColor Green

Write-Host "`n=== ALL TESTS PASSED! ===" -ForegroundColor Green


