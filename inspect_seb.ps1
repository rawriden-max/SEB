param()
try {
    $filePath = 'c:\Users\Mr. Ilyas\Downloads\SebClientSettings ASAS Ganjil TA. 2025-2026.seb'
    $inStream = [System.IO.File]::OpenRead($filePath)
    $gzStream = New-Object System.IO.Compression.GzipStream($inStream, [System.IO.Compression.CompressionMode]::Decompress)
    $reader = New-Object System.IO.StreamReader($gzStream, [System.Text.Encoding]::UTF8)
    $content = $reader.ReadToEnd()
    Write-Output "Successfully decompressed! Length: $($content.Length)"
    Write-Output "First 600 chars:"
    Write-Output $content.Substring(0, [Math]::Min(600, $content.Length))
    
    # Check if there is startURL, quitPassword, hashedQuitPassword
    if ($content -match '<key>startURL</key>\s*<string>([^<]+)</string>') {
        Write-Output "Start URL: $($matches[1])"
    }
    if ($content -match '<key>hashedQuitPassword</key>\s*<string>([^<]+)</string>') {
        Write-Output "Hashed Quit Password: $($matches[1])"
    }
    if ($content -match '<key>quitURL</key>\s*<string>([^<]+)</string>') {
        Write-Output "Quit URL: $($matches[1])"
    }
} catch {
    Write-Output "Error or encrypted: $($_.Exception.Message)"
}
