# Riset Sistem CBT & Browser Verification (Exambro)

Dokumen ini berisi catatan riset mengenai arsitektur pengujian berbasis komputer (CBT / Computer-Based Test) seperti sistem **Exambro** (Exam Browser) yang digunakan pada ANBK / Pusmendik, serta analisis keamanan deteksi peramban (browser fingerprinting & validation).

---

## 1. Apakah Server Bisa Mengetahui Kita Mengirim Jawaban Lewat Chrome atau Firefox?

**Ya, secara default server bisa tahu dengan sangat mudah**, kecuali dilakukan manipulasi atau modifikasi di level perantara maupun klien.

### A. Header `User-Agent`
Setiap kali peramban mengirim data atau HTTP request ke server, peramban secara otomatis menyertakan header `User-Agent`.

Contoh User-Agent standar:
- **Google Chrome**: 
  `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
- **Mozilla Firefox**: 
  `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0`

Server CBT membaca string ini pada setiap request (`req.headers['user-agent']`). Jika string tersebut mencirikan browser komersial umum (Chrome/Firefox/Edge murni), server CBT langsung memvalidasi apakah peserta menggunakan aplikasi Exambro resmi atau mencoba mengakses via peramban biasa.

### B. Kustomisasi Peramban Khusus (Custom Wrapper)
Aplikasi resmi seperti Exambro biasanya bukan browser biasa, melainkan peramban khusus (custom wrapper) yang dibangun di atas:
- **Electron / CEF (Chromium Embedded Framework)**
- **Python WebView / PyQt WebEngine**
- **C# .NET WebView2**

Dengan wrapper ini, pengembang aplikasi dapat:
1. Mengubah string `User-Agent` secara bebas menjadi string khas Exambro (misalnya: `ExambroClient/2.0 (Windows NT 10.0; Win64; x64) CBT-Client/Verified`).
2. Mengirimkan custom HTTP headers tambahan (misalnya `X-Client-Signature`, `X-Exambro-Token`, atau HMAC hash berbasis timestamp dan secret key).
3. Mengunci sistem operasi (Kiosk Mode): mematikan Alt+Tab, tombol Windows, kombinasi Ctrl+Shift+I (DevTools), klik kanan, dan melarang membuka aplikasi lain.

---

## 2. Vektor Verifikasi Tambahan Antara Server dan Klien Exambro

Selain `User-Agent`, sistem CBT modern dapat menerapkan beberapa lapisan verifikasi:

| Vektor Verifikasi | Mekanisme di Sisi Klien | Mekanisme di Sisi Server |
|---|---|---|
| **User-Agent Header** | Di-inject oleh wrapper atau extension | Dicocokkan dengan whitelist/regex pola Exambro resmi |
| **Custom Auth Token (HMAC)** | Wrapper menghasilkan signature `HMAC_SHA256(timestamp + secret)` | Server memverifikasi token sebelum menerima submission |
| **Focus & Blur Event Tracking** | `window.onblur` mendeteksi jika peserta berpindah tab/jendela | Server mencatat log pelanggaran (violation counter) |
| **Fullscreen & Screen Lock** | Memaksa `document.documentElement.requestFullscreen()` | Evaluasi resolusi dan status fullscreen pada setiap ping |
| **DevTools & Extension Probe** | Deteksi debugger timing (`console.clear`, debugger pauses) | Memblokir sesi jika terdeteksi inspeksi DOM |
| **Heartbeat / Ping WebSocket** | Mengirimkan telemetri kondisi klien setiap detik | Server proktor memantau status aktif seluruh peserta |

---

## 3. Rencana Implementasi Web App Riset (Exambro Simulation)

Untuk merealisasikan riset ini dalam aplikasi web interaktif, sistem akan dirancang dengan 2 komponen utama:

1. **Server Dashboard (Proktor / CBT Admin & Security Engine)**:
   - Panel kontrol pengawas (Proktor).
   - Log lalu lintas HTTP & verifikasi browser secara real-time.
   - Konfigurasi kebijakan keamanan (Strict User-Agent check, Token verification, Max violation limits).
   - Audit trail submission jawaban.

2. **Client Portal (Exambro Simulator)**:
   - Mode 1: **Normal Browser Mode** (Menunjukkan bagaimana Chrome/Firefox asli ditolak server).
   - Mode 2: **Exambro Wrapper Simulation** (Mensimulasikan wrapper dengan custom signature, kiosk mode, fullscreen enforcement, focus tracking).
   - Mode 3: **Security Bypass Research** (Eksperimen manipulasi User-Agent dan analisis apakah server bisa membongkarnya via token/behavioral metrics).
   - Sesi ujian interaktif dengan navigasi soal, ragu-ragu, timer mundur, dan visualisasi pelanggaran.
