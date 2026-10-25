# Exambro CBT Research & Inspection Server
# Built for Windows PowerShell using System.Net.HttpListener
# Port: 8080

param(
    [int]$Port = 8080
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$publicDir = Join-Path $scriptDir "public"

if (!(Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir -Force | Out-Null
}

# In-memory storage for research server state
$global:ServerConfig = @{
    enforceUserAgent = $true
    enforceSignature = $false
    maxViolations    = 3
    allowedPattern   = "ExambroClient\/[0-9\.]+|CBT-Wrapper\/[0-9\.]+|Pusmendik-ANBK\/Client"
}

$global:AuditLogs = [System.Collections.ArrayList]::new()
$global:Submissions = [System.Collections.ArrayList]::new()
$global:ActiveSessions = @{}

function Log-Audit {
    param(
        [string]$ClientIp,
        [string]$Method,
        [string]$Path,
        [string]$UserAgent,
        [string]$ClientType,
        [string]$Verdict,
        [string]$Reason,
        [string]$Details
    )
    $entry = @{
        id         = [System.Guid]::NewGuid().ToString()
        timestamp  = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        clientIp   = $ClientIp
        method     = $Method
        path       = $Path
        userAgent  = $UserAgent
        clientType = $ClientType
        verdict    = $Verdict
        reason     = $Reason
        details    = $Details
    }
    [void]$global:AuditLogs.Insert(0, $entry)
    if ($global:AuditLogs.Count -gt 150) {
        $global:AuditLogs.RemoveAt($global:AuditLogs.Count - 1)
    }
    return $entry
}

function Analyze-Client {
    param(
        [System.Net.HttpListenerRequest]$Request
    )
    $ua = $Request.Headers["User-Agent"]
    if ([string]::IsNullOrWhiteSpace($ua)) {
        $ua = "(Empty User-Agent)"
    }

    $sig = $Request.Headers["X-Exambro-Signature"]
    $wrapperHeader = $Request.Headers["X-Exambro-Client"]

    $clientType = "Unknown"
    $isExambro = $false
    $verdict = "ALLOWED"
    $reason = "Koneksi diizinkan oleh server."

    # Detect browser type
    if ($ua -match $global:ServerConfig.allowedPattern -or $wrapperHeader -eq "OfficialWrapper") {
        $clientType = "Exambro Official Client"
        $isExambro = $true
    }
    elseif ($ua -match "Edg\/") {
        $clientType = "Microsoft Edge (Standard Browser)"
    }
    elseif ($ua -match "Chrome\/" -and $ua -notmatch "Chromium") {
        $clientType = "Google Chrome (Standard Browser)"
    }
    elseif ($ua -match "Firefox\/") {
        $clientType = "Mozilla Firefox (Standard Browser)"
    }
    elseif ($ua -match "Safari\/" -and $ua -notmatch "Chrome") {
        $clientType = "Apple Safari (Standard Browser)"
    }
    else {
        $clientType = "Custom / Non-Standard Client"
    }

    # Policy Enforcement: User-Agent check
    if ($global:ServerConfig.enforceUserAgent) {
        if (-not $isExambro) {
            $verdict = "REJECTED_COMMERCIAL_BROWSER"
            $reason = "Akses DITOLAK: Server mendeteksi Anda menggunakan peramban biasa ($clientType). Sistem CBT mewajibkan aplikasi Exambro resmi untuk mencegah kecurangan."
        }
    }

    # Policy Enforcement: Cryptographic HMAC Signature check
    if ($verdict -eq "ALLOWED" -and $global:ServerConfig.enforceSignature) {
        if ([string]::IsNullOrWhiteSpace($sig) -or $sig -ne "EXAMBRO-HMAC-SECURE-KEY-2026") {
            $verdict = "REJECTED_SIGNATURE_MISMATCH"
            $reason = "Akses DITOLAK: User-Agent lolos, tetapi tanda tangan kriptografis klien (X-Exambro-Signature) tidak valid atau hilang. Percobaan spoofing terdeteksi!"
        }
    }

    return @{
        userAgent  = $ua
        clientType = $clientType
        isExambro  = $isExambro
        verdict    = $verdict
        reason     = $reason
        signature  = $sig
    }
}

function Send-JsonResponse {
    param(
        [System.Net.HttpListenerResponse]$Response,
        [int]$StatusCode = 200,
        [object]$Data
    )
    $json = ConvertTo-Json -InputObject $Data -Depth 10 -Compress
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
    $Response.StatusCode = $StatusCode
    $Response.ContentType = "application/json; charset=utf-8"
    $Response.Headers.Add("Access-Control-Allow-Origin", "*")
    $Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, User-Agent, X-Exambro-Client, X-Exambro-Signature, X-Simulated-UA")
    $Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    $Response.ContentLength64 = $buffer.Length
    $Response.OutputStream.Write($buffer, 0, $buffer.Length)
    $Response.OutputStream.Close()
}

function Send-FileResponse {
    param(
        [System.Net.HttpListenerResponse]$Response,
        [string]$FilePath,
        [string]$Method = "GET"
    )
    if (!(Test-Path $FilePath)) {
        $Response.StatusCode = 404
        $Response.StatusDescription = "Not Found"
        $Response.OutputStream.Close()
        return
    }

    $ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
    $contentType = switch ($ext) {
        ".html" { "text/html; charset=utf-8" }
        ".css"  { "text/css; charset=utf-8" }
        ".js"   { "application/javascript; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".png"  { "image/png" }
        ".svg"  { "image/svg+xml" }
        default { "text/plain; charset=utf-8" }
    }

    $bytes = [System.IO.File]::ReadAllBytes($FilePath)
    $Response.StatusCode = 200
    $Response.ContentType = $contentType
    $Response.ContentLength64 = $bytes.Length
    if ($Method -ne "HEAD") {
        try {
            $Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            # Ignore client disconnect
        }
    }
    try {
        $Response.OutputStream.Close()
    } catch {}
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " [EXAMBRO CBT RESEARCH SERVER] Aktif di $prefix" -ForegroundColor Green
    Write-Host " Server siap memeriksa User-Agent & Header peramban." -ForegroundColor Yellow
    Write-Host " Tekan Ctrl+C untuk menghentikan server." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan
}
catch {
    Write-Error "Gagal menjalankan HttpListener di $prefix : $_"
    exit 1
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $urlPath = $request.Url.AbsolutePath
        $method = $request.HttpMethod
        $clientIp = $request.RemoteEndPoint.Address.ToString()

        if ($method -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, User-Agent, X-Exambro-Client, X-Exambro-Signature, X-Simulated-UA")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.OutputStream.Close()
            continue
        }

        # Check for simulated User-Agent header (sent during sandbox bypass experiments)
        $simulatedUa = $request.Headers["X-Simulated-UA"]
        $analysis = Analyze-Client -Request $request
        if (![string]::IsNullOrWhiteSpace($simulatedUa)) {
            $analysis.userAgent = $simulatedUa
            if ($simulatedUa -match $global:ServerConfig.allowedPattern) {
                $analysis.isExambro = $true
                $analysis.clientType = "Exambro Client (Spoofed / Simulated UA)"
                if ($global:ServerConfig.enforceSignature) {
                    $sig = $request.Headers["X-Exambro-Signature"]
                    if ($sig -ne "EXAMBRO-HMAC-SECURE-KEY-2026") {
                        $analysis.verdict = "REJECTED_SIGNATURE_MISMATCH"
                        $analysis.reason = "Akses Ditolak: User-Agent berhasil dipalsukan menjadi Exambro, namun server menggagalkannya karena tanda tangan kriptografis HMAC tidak valid!"
                    } else {
                        $analysis.verdict = "ALLOWED"
                        $analysis.reason = "Koneksi diterima: User-Agent Exambro dan Signature HMAC valid."
                    }
                } else {
                    $analysis.verdict = "ALLOWED"
                    $analysis.reason = "Koneksi diterima: Server hanya memeriksa User-Agent string, sehingga spoofing berhasil melewati proteksi dasar!"
                }
            } else {
                $analysis.isExambro = $false
                if ($global:ServerConfig.enforceUserAgent) {
                    $analysis.verdict = "REJECTED_COMMERCIAL_BROWSER"
                    $analysis.reason = "Akses Ditolak: String User-Agent terdeteksi sebagai browser standar ($simulatedUa)."
                }
            }
        }

        # Log inspection for API and interactive actions
        if ($urlPath.StartsWith("/api/")) {
            Log-Audit -ClientIp $clientIp `
                -Method $method `
                -Path $urlPath `
                -UserAgent $analysis.userAgent `
                -ClientType $analysis.clientType `
                -Verdict $analysis.verdict `
                -Reason $analysis.reason `
                -Details "Request ke API $urlPath" | Out-Null
        }

        # Read JSON body if POST
        $bodyData = $null
        if ($method -eq "POST" -and $request.HasEntityBody) {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $rawBody = $reader.ReadToEnd()
            if (![string]::IsNullOrWhiteSpace($rawBody)) {
                try {
                    $bodyData = ConvertFrom-Json -InputObject $rawBody
                }
                catch {
                    $bodyData = @{}
                }
            }
        }

        # ROUTING
        switch ($urlPath) {
            "/api/inspect-request" {
                $allHeaders = @{}
                foreach ($key in $request.Headers.AllKeys) {
                    $allHeaders[$key] = $request.Headers[$key]
                }
                Send-JsonResponse -Response $response -StatusCode 200 -Data @{
                    analysis       = $analysis
                    receivedHeaders= $allHeaders
                    serverConfig   = $global:ServerConfig
                    serverTime     = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                }
            }
            "/api/status" {
                Send-JsonResponse -Response $response -StatusCode 200 -Data @{
                    status         = "ONLINE"
                    serverName     = "Exambro CBT Core Engine (Pusmendik ANBK Research)"
                    serverConfig   = $global:ServerConfig
                    totalLogs      = $global:AuditLogs.Count
                    totalSubmissions = $global:Submissions.Count
                    activeSessions = $global:ActiveSessions.Count
                }
            }
            "/api/proctor/logs" {
                Send-JsonResponse -Response $response -StatusCode 200 -Data @{
                    logs         = $global:AuditLogs
                    serverConfig = $global:ServerConfig
                    submissions  = $global:Submissions
                }
            }
            "/api/proctor/config" {
                if ($method -eq "POST" -and $bodyData -ne $null) {
                    if ($null -ne $bodyData.enforceUserAgent) { $global:ServerConfig.enforceUserAgent = [bool]$bodyData.enforceUserAgent }
                    if ($null -ne $bodyData.enforceSignature) { $global:ServerConfig.enforceSignature = [bool]$bodyData.enforceSignature }
                    if ($null -ne $bodyData.maxViolations) { $global:ServerConfig.maxViolations = [int]$bodyData.maxViolations }
                }
                Send-JsonResponse -Response $response -StatusCode 200 -Data @{
                    success      = $true
                    serverConfig = $global:ServerConfig
                }
            }
            "/api/exam/submit" {
                if ($method -eq "POST") {
                    if ($analysis.verdict -ne "ALLOWED") {
                        Send-JsonResponse -Response $response -StatusCode 403 -Data @{
                            success = $false
                            error   = "SUBMISSION_REJECTED"
                            verdict = $analysis.verdict
                            reason  = $analysis.reason
                            clientType = $analysis.clientType
                        }
                    } else {
                        $sub = @{
                            id        = [System.Guid]::NewGuid().ToString()
                            timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                            studentId = if ($bodyData.studentId) { $bodyData.studentId } else { "PESERTA-01" }
                            answers   = $bodyData.answers
                            score     = $bodyData.score
                            clientUa  = $analysis.userAgent
                        }
                        [void]$global:Submissions.Insert(0, $sub)
                        Send-JsonResponse -Response $response -StatusCode 200 -Data @{
                            success   = $true
                            message   = "Jawaban berhasil diterima dan diverifikasi oleh Server CBT Exambro."
                            submission= $sub
                        }
                    }
                } else {
                    Send-JsonResponse -Response $response -StatusCode 405 -Data @{ error = "Method Not Allowed" }
                }
            }
            "/api/exam/telemetry" {
                if ($method -eq "POST" -and $bodyData -ne $null) {
                    $event = $bodyData.event
                    $studentId = $bodyData.studentId
                    $violationCount = $bodyData.violationCount

                    $vVerdict = if ($violationCount -ge $global:ServerConfig.maxViolations) { "LOCKED" } else { "WARNING" }
                    Log-Audit -ClientIp $clientIp `
                        -Method "TELEMETRY" `
                        -Path "/api/exam/telemetry" `
                        -UserAgent $analysis.userAgent `
                        -ClientType $analysis.clientType `
                        -Verdict $vVerdict `
                        -Reason "Pelanggaran Integritas Klien: $event (Pelanggaran ke-$violationCount)" `
                        -Details "Peserta $studentId beralih jendela/keluar fullscreen" | Out-Null

                    Send-JsonResponse -Response $response -StatusCode 200 -Data @{
                        received        = $true
                        isExceeded      = ($violationCount -ge $global:ServerConfig.maxViolations)
                        maxViolations   = $global:ServerConfig.maxViolations
                        currentViolations = $violationCount
                    }
                } else {
                    Send-JsonResponse -Response $response -StatusCode 400 -Data @{ error = "Bad Request" }
                }
            }
            "/api/seb/handshake" {
                $response.Headers["Server"] = "SafeExamBrowser-Server/3.3.2"
                $response.Headers["X-SafeExamBrowser-Server"] = "3.3.2.334"
                Send-JsonResponse -Response $response -StatusCode 200 -Data @{
                    status         = "ACTIVE"
                    serverVersion  = "3.3.2.334"
                    protocolVersion= "1.0"
                    institution    = "MAN 19 JAKARTA SELATAN"
                    session        = @{
                        examId             = "ASAS-GANJIL-2025-2026"
                        examName           = "ASAS Ganjil TA. 2025-2026"
                        sebClientSettings  = "SebClientSettings ASAS Ganjil TA. 2025-2026.seb"
                        allowQuit          = $true
                        quitPasswordHashed = "5f4dcc3b5aa765d61d8327deb882cf99"
                        kioskMode          = $true
                        proctorKey         = "1234567890"
                    }
                    verification   = @{
                        clientDetected      = "OFFICIAL_SEB"
                        browserExamKeyMatch = $true
                        configKeyMatch      = $true
                        integrityVerdict    = "VERIFIED_SAFE_EXAM_ENVIRONMENT"
                    }
                }
            }
            "/api/seb/config" {
                $response.Headers["Server"] = "SafeExamBrowser-Server/3.3.2"
                $response.Headers["X-SafeExamBrowser-Server"] = "3.3.2.334"
                $response.ContentType = "application/seb"
                $response.Headers["Content-Disposition"] = 'attachment; filename="SebClientSettings.seb"'
                $xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>originatorVersion</key>
  <string>SEB_Win_3.3.2.334</string>
  <key>startURL</key>
  <string>https://docs.google.com/forms/d/e/1FAIpQLSdAkWb-P96f-9A_DMGaCdjMZacovsh5EFVl9uXtNatSN6xfxw/viewform</string>
  <key>allowQuit</key>
  <true/>
  <key>kioskMode</key>
  <true/>
</dict>
</plist>
"@
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($xml)
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.OutputStream.Close()
                $response.Close()
            }
            "/api/system/lock-touchpad" {
                try {
                    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad' -Name 'ThreeFingerSwipesEnabled' -Value 0 -Type DWord -ErrorAction SilentlyContinue
                    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad' -Name 'FourFingerSwipesEnabled' -Value 0 -Type DWord -ErrorAction SilentlyContinue
                    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad' -Name 'EnableEdgy' -Value 0 -Type DWord -ErrorAction SilentlyContinue
                    Send-JsonResponse -Response $response -StatusCode 200 -Data @{ success = $true; message = "Touchpad multi-finger gestures disabled" }
                } catch {
                    Send-JsonResponse -Response $response -StatusCode 200 -Data @{ success = $false; error = $_.Exception.Message }
                }
            }
            "/api/system/restore-touchpad" {
                try {
                    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad' -Name 'ThreeFingerSwipesEnabled' -Value 1 -Type DWord -ErrorAction SilentlyContinue
                    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad' -Name 'FourFingerSwipesEnabled' -Value 1 -Type DWord -ErrorAction SilentlyContinue
                    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad' -Name 'EnableEdgy' -Value 1 -Type DWord -ErrorAction SilentlyContinue
                    Send-JsonResponse -Response $response -StatusCode 200 -Data @{ success = $true; message = "Touchpad multi-finger gestures restored" }
                } catch {
                    Send-JsonResponse -Response $response -StatusCode 200 -Data @{ success = $false; error = $_.Exception.Message }
                }
            }
            default {
                # Static file serving
                $targetFile = ""
                if ($urlPath -eq "/" -or $urlPath -eq "") {
                    $targetFile = Join-Path $publicDir "index.html"
                } else {
                    $cleanRelPath = $urlPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
                    $targetFile = Join-Path $publicDir $cleanRelPath
                }

                if (Test-Path $targetFile -PathType Leaf) {
                    Send-FileResponse -Response $response -FilePath $targetFile -Method $method
                } else {
                    # Fallback to index.html for SPA routes
                    $fallback = Join-Path $publicDir "index.html"
                    if (Test-Path $fallback) {
                        Send-FileResponse -Response $response -FilePath $fallback -Method $method
                    } else {
                        $response.StatusCode = 404
                        $response.Close()
                    }
                }
            }
        }
    }
}
finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
