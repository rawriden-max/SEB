# Exambro CBT Research Lab - Safe Exam Browser (SEB) & Google Forms ASAT 2025-2026

Aplikasi simulasi lingkungan ujian terpadu yang mereplikasi tampilan **Safe Exam Browser (SEB)** / **Exambro** saat menjalankan ujian berbasis **Google Forms** (sesuai contoh riil ASAT 2025-2026 di Madrasah Aliyah Negeri Jakarta Selatan).

Sistem ini menggabungkan antarmuka Kiosk klien dengan backend server verifikasi mandiri untuk riset keamanan peramban dan deteksi User-Agent CBT.

---

## 📸 Tampilan Antarmuka (Sesuai Foto Referensi)

1. **Bilah Atas SEB (Minimalist Top Bar)**:
   - Kontrol navigasi peramban minimalis: Kembali (`<`), Maju (`>`), dan Muat Ulang (`⟳`).
   - Tampilan URL Google Forms terkunci: `https://docs.google.com/forms/d/e/...`
   - Pemilih Mode Browser untuk riset:
     - *Exambro / SEB Klien Resmi (Tervalidasi)*
     - *Peramban Biasa (Chrome / Firefox / Edge)*
     - *Spoofed User-Agent (Tanpa Signature)*
   - Tombol pembuka **Panel Pengawas & Riset (F2)**.

2. **Antarmuka Google Forms Asli (ASAT 2025-2026)**:
   - **Bagian 1: Identitas & Token**:
     - Garis aksen merah khas Google Forms (`#d93025`).
     - Judul: **ASAT 2025-2026**
     - Subjudul: **Madrasah Aliyah Negeri 4 Jakarta Selatan**
     - Kolom isian `Email *` dan `TOKEN *` (Default token: `ASAT2026`).
     - Tombol `Berikutnya` dan `Kosongkan formulir`.
   - **Bagian 2: Soal Ujian**:
     - Kartu pertanyaan bergaya Google Forms dengan opsi radio button (A, B, C, D, E).
     - Tombol `Kembali` dan `Kirim Jawaban ke Server`.
     - *Evaluasi Keamanan Server*: Jika dikirim dari browser biasa (Chrome/Firefox), server akan menolak dengan popup **403 Forbidden**. Jika dari SEB resmi, jawaban tersimpan dan skor ditampilkan.

3. **Bilah Bawah SEB (Bottom Taskbar)**:
   - **Pojok Kiri**: Logo resmi **Safe Exam Browser / Exambro** (`seb-logo.png`).
   - **Tengah**: Indikator status Kiosk Mode aktif.
   - **Pojok Kanan**: Jam dinamis (`07:37`), indikator bahasa `ENG`, icon refresh, icon WiFi, icon audio/suara, dan tombol **Power Merah** (Keluar Ujian).
   - *Keamanan Keluar*: Mengklik tombol power akan meminta kata sandi pengawas (default riset: `proktor123`).

4. **Panel Pengawas & Riset (Proctor Drawer)**:
   - Dapat dibuka dengan menekan tombol **F2** atau mengklik tombol di bilah atas.
   - Menampilkan evaluasi forensik header peramban secara live.
   - Mengatur kebijakan server CBT (Enforce User-Agent, Enforce HMAC Signature, Max Alt-Tab).
   - Mengubah judul form, nama sekolah, dan token ujian secara real-time.

---

## 🚀 Cara Menjalankan

Aplikasi saat ini telah aktif di latar belakang:
- **Buka Browser Anda di**: [http://localhost:8080/](http://localhost:8080/)
- **Folder Workspace**: `C:\Users\Mr. Ilyas\.gemini\antigravity-ide\scratch\exambro-research`

Untuk menjalankan ulang server secara manual:
```powershell
cd "C:\Users\Mr. Ilyas\.gemini\antigravity-ide\scratch\exambro-research"
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
```
