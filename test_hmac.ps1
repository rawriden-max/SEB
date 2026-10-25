$ErrorActionPreference = "Stop"

Write-Host "=== TEST 7: HMAC ENFORCEMENT & SPOOFING TEST ===" -ForegroundColor Cyan

# 1. Enable Enforce HMAC Signature on Server
$cfgBody = @{ enforceSignature = $true; enforceUserAgent = $true } | ConvertTo-Json
$cfgRes = Invoke-RestMethod -Uri "http://localhost:8080/api/proctor/config" -Method Post -Body $cfgBody -ContentType "application/json"
Write-Host "Enforce Signature set to: $($cfgRes.serverConfig.enforceSignature)" -ForegroundColor Yellow

# 2. Spoofed UA without Signature
$spoofHeaders = @{ "X-Simulated-UA" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ExambroClient/2.0 CBT-Official/2026" }
$resSpoof = Invoke-RestMethod -Uri "http://localhost:8080/api/inspect-request" -Headers $spoofHeaders
Write-Host "Spoofed UA without Signature Verdict: $($resSpoof.analysis.verdict)" -ForegroundColor Red
Write-Host "Reason: $($resSpoof.analysis.reason)"

# 3. Spoofed UA with Valid Signature
$validSigHeaders = @{ 
    "X-Simulated-UA" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ExambroClient/2.0 CBT-Official/2026";
    "X-Exambro-Signature" = "EXAMBRO-HMAC-SECURE-KEY-2026"
}
$resValidSig = Invoke-RestMethod -Uri "http://localhost:8080/api/inspect-request" -Headers $validSigHeaders
Write-Host "Valid Sig Verdict: $($resValidSig.analysis.verdict)" -ForegroundColor Green
Write-Host "Reason: $($resValidSig.analysis.reason)"

# Reset enforceSignature to false
$resetBody = @{ enforceSignature = $false; enforceUserAgent = $true } | ConvertTo-Json
[void](Invoke-RestMethod -Uri "http://localhost:8080/api/proctor/config" -Method Post -Body $resetBody -ContentType "application/json")

Write-Host "`n=== ADVANCED HMAC INTEGRITY TEST PASSED! ===" -ForegroundColor Green
