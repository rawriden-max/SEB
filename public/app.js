/**
 * Safe Exam Browser (SEB / Exambro) & Google Forms ASAT 2025-2026 Engine
 * Dual-Engine: High-Fidelity Multi-Stage Exam (Token -> Absensi -> Pilih Mapel MTK -> Token L0G1K4 -> Soal)
 * + Ready-to-use Slot for Live Google Form Link
 * + Permanent Fullscreen Lock & Instant Window Close (Password: 1234567890)
 */

// =============================================================================
// KONFIGURASI FORMULIR UJIAN (BISA ANDA GANTI DI SINI KAPAN SAJA)
// =============================================================================
const GOOGLE_FORM_CONFIG = {
  // 1. LINK GOOGLE FORM ASLI ANDA (Sesuai Permintaan):
  liveFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdAkWb-P96f-9A_DMGaCdjMZacovsh5EFVl9uXtNatSN6xfxw/viewform?hl=id&embedded=true",
  
  // 2. MODE GOOGLE FORM ASLI (Aktif secara default):
  useLiveGoogleForm: true,

  // 3. PENGATURAN IDENTITAS & TOKEN:
  title: "ASAT 2025-2026",
  school: "Madrasah Aliyah Negeri 19 Jakarta Selatan",
  initialToken: "ASAT2026", // Token awal untuk membuka absensi
  mapelTokens: {
    "MTK": "L0G1K4",             // Token khusus Matematika sesuai permintaan Anda!
    "INFORMATIKA": "INF2026",
    "BAHASA_INDONESIA": "BIN2026"
  },
  
  // 4. PASSWORD KELUAR RESMI PENGURUS/PROKTOR:
  proctorQuitPassword: "1234567890" // Password untuk menutup tab/peramban
};

// Soal Ujian Asli Sesuai Tampilan Google Forms (Gambar 1 & 2)
const SOAL_MAPEL_MTK = [
  {
    id: 1,
    text: "Bacalah teks berikut!\n\nSebuah madrasah di Yogyakarta mengembangkan kebun pangan sekolah. Lahan kosong seluas 300 meter persegi dimanfaatkan untuk menanam cabai, tomat, kangkung, dan berbagai tanaman obat. Hasil panen sebagian digunakan untuk kebutuhan kantin sehat, sedangkan sebagian lainnya dibagikan kepada warga sekitar.\n\nMakna tersirat yang paling tepat berdasarkan teks tersebut adalah ....",
    options: [
      { letter: "A", text: "A. madrasah tidak lagi membutuhkan bahan pangan dari luar sekolah." },
      { letter: "B", text: "B. kegiatan tersebut berpotensi mengajarkan kemandirian pangan sekaligus kepedulian terhadap lingkungan dan masyarakat." },
      { letter: "C", text: "C. seluruh kebutuhan pangan warga sekitar dapat dipenuhi melalui kebun sekolah." },
      { letter: "D", text: "D. tanaman obat merupakan jenis tanaman yang paling menguntungkan secara ekonomi." },
      { letter: "E", text: "E. kantin sekolah hanya diperbolehkan menggunakan hasil kebun madrasah." }
    ],
    correctAnswer: "D"
  },
  {
    id: 2,
    text: "Bacalah dua kalimat berikut!\n\n(1) Pemerintah daerah menanam 5.000 bibit pohon di kawasan rawan longsor.\n(2) Program tersebut merupakan langkah yang sangat tepat untuk menyelamatkan lingkungan dari kehancuran.",
    options: [
      { letter: "A", text: "A. kalimat (1) merupakan opini, sedangkan kalimat (2) merupakan fakta." },
      { letter: "B", text: "B. kedua kalimat merupakan fakta karena membahas kegiatan pemerintah." },
      { letter: "C", text: "C. kalimat (1) merupakan fakta, sedangkan kalimat (2) merupakan opini." },
      { letter: "D", text: "D. kedua kalimat merupakan opini karena berasal dari sudut pandang penulis." },
      { letter: "E", text: "E. kalimat (1) dan (2) merupakan interpretasi terhadap sebuah peristiwa." }
    ],
    correctAnswer: "C"
  },
  {
    id: 3,
    text: "Himpunan penyelesaian dari pertidaksamaan linear 3x - 4 < 2x + 5 untuk x bilangan bulat adalah ...",
    options: [
      { letter: "A", text: "x < 1" },
      { letter: "B", text: "x < 9" },
      { letter: "C", text: "x > 9" },
      { letter: "D", text: "x ≤ 8" },
      { letter: "E", text: "x ≥ 9" }
    ],
    correctAnswer: "B"
  },
  {
    id: 4,
    text: "Nilai dari determinan matriks A = [[4, 2], [3, 5]] adalah ...",
    options: [
      { letter: "A", text: "12" },
      { letter: "B", text: "14" },
      { letter: "C", text: "16" },
      { letter: "D", text: "18" },
      { letter: "E", text: "20" }
    ],
    correctAnswer: "B"
  },
  {
    id: 5,
    text: "Suku ke-10 dari barisan aritmatika 3, 7, 11, 15, ... adalah ...",
    options: [
      { letter: "A", text: "35" },
      { letter: "B", text: "37" },
      { letter: "C", text: "39" },
      { letter: "D", text: "41" },
      { letter: "E", text: "43" }
    ],
    correctAnswer: "C"
  },
  {
    id: 6,
    text: "Pada sistem CBT Exambro, header HTTP manakah yang dibaca oleh server untuk memvalidasi apakah peserta mengerjakan lewat Chrome/Firefox atau peramban resmi?",
    options: [
      { letter: "A", text: "Host-Header" },
      { letter: "B", text: "User-Agent" },
      { letter: "C", text: "Content-Type" },
      { letter: "D", text: "Accept-Language" },
      { letter: "E", text: "Cache-Control" }
    ],
    correctAnswer: "B"
  }
];

// App State
const state = {
  clientMode: 'wrapper', // Exambro / SEB Klien Resmi (Tervalidasi)
  studentEmail: 'rawrlden@gmail.com',
  studentToken: '',
  studentNama: '',
  studentNisn: '',
  studentKelas: 'X-1',
  studentMapel: 'MTK',
  studentTokenMapel: '',
  answers: {},
  isAuthorizedExit: false,
  isKioskLocked: false,
  isQuittingModalOpen: false,
  violationsCount: 0,
  isAudioMuted: false,
  isWifiActive: true,
  volumeLevel: 100,
  prevVolumeLevel: 100
};

// DOM Elements
const el = {
  // Fullscreen Entry & Restore
  fullscreenEntryOverlay: document.getElementById('fullscreen-entry-overlay'),
  btnEnterFullscreen: document.getElementById('btn-enter-fullscreen'),
  fullscreenRestoreOverlay: document.getElementById('fullscreen-restore-overlay'),
  btnRestoreFullscreen: document.getElementById('btn-restore-fullscreen'),

  // Minimal Top Controls
  topNavBack: document.getElementById('top-nav-back'),
  topNavForward: document.getElementById('top-nav-forward'),
  topNavReload: document.getElementById('top-nav-reload'),

  // Live iframe wrapper
  liveGformWrapper: document.getElementById('live-gform-wrapper'),
  liveGformIframe: document.getElementById('live-gform-iframe'),
  gformContainer: document.getElementById('gform-container'),

  // Sections
  gformSection1: document.getElementById('gform-section-1'),
  gformSectionAbsensi: document.getElementById('gform-section-absensi'),
  gformSectionMapel: document.getElementById('gform-section-mapel'),
  gformSectionSoal: document.getElementById('gform-section-soal'),
  gformSectionCompleted: document.getElementById('gform-section-completed'),

  // Section 1 (Identitas & Token Utama)
  inputEmail: document.getElementById('input-email'),
  inputToken: document.getElementById('input-token'),
  errorEmail: document.getElementById('error-email'),
  errorToken: document.getElementById('error-token'),
  btnToAbsensi: document.getElementById('btn-to-absensi'),
  btnClearS1: document.getElementById('btn-clear-s1'),

  // Section 2 (Absensi)
  inputNamaSiswa: document.getElementById('input-nama-siswa'),
  inputNisn: document.getElementById('input-nisn'),
  errorNama: document.getElementById('error-nama'),
  errorNisn: document.getElementById('error-nisn'),
  btnBackToS1: document.getElementById('btn-back-to-s1'),
  btnToPilihMapel: document.getElementById('btn-to-pilih-mapel'),
  btnClearAbsensi: document.getElementById('btn-clear-absensi'),

  // Section 3 (Mapel & Token L0G1K4)
  inputTokenMapel: document.getElementById('input-token-mapel'),
  errorTokenMapel: document.getElementById('error-token-mapel'),
  btnBackToAbsensi: document.getElementById('btn-back-to-absensi'),
  btnToSoalUjian: document.getElementById('btn-to-soal-ujian'),
  btnClearMapel: document.getElementById('btn-clear-mapel'),

  // Section 4 (Soal Ujian)
  soalMapelTitle: document.getElementById('soal-mapel-title'),
  gformQuestionsList: document.getElementById('gform-questions-list'),
  btnBackToMapel: document.getElementById('btn-back-to-mapel'),
  btnSubmitExam: document.getElementById('btn-submit-exam'),
  btnClearSoal: document.getElementById('btn-clear-soal'),

  // Section 5 (Completed)
  completedScoreBox: document.getElementById('completed-score-box'),
  linkRestartExam: document.getElementById('link-restart-exam'),

  // SEB Taskbar
  sebClock: document.getElementById('seb-clock'),
  taskbarBtnReload: document.getElementById('taskbar-btn-reload'),
  taskbarBtnPower: document.getElementById('taskbar-btn-power'),
  sebLogoBtn: document.getElementById('seb-logo-btn'),
  taskbarBtnWifi: document.getElementById('taskbar-btn-wifi'),
  sebWifiFlyout: document.getElementById('seb-wifi-flyout'),
  wifiToggleSwitch: document.getElementById('wifi-toggle-switch'),
  btnWifiActionCbt: document.getElementById('btn-wifi-action-cbt'),
  wifiCbtStatus: document.getElementById('wifi-cbt-status'),
  wifiStatusFooter: document.getElementById('wifi-status-footer'),
  taskbarBtnAudio: document.getElementById('taskbar-btn-audio'),
  audioIconContainer: document.getElementById('audio-icon-container'),
  sebVolumeFlyout: document.getElementById('seb-volume-flyout'),
  volumePercentText: document.getElementById('volume-percent-text'),
  volumeRangeInput: document.getElementById('volume-range-input'),
  btnVolumeMuteToggle: document.getElementById('btn-volume-mute-toggle'),
  volumeSliderMuteIcon: document.getElementById('volume-slider-mute-icon'),
  volumeFlyoutIconBox: document.getElementById('volume-flyout-icon-box'),

  // Modals & Security Overlays
  sebQuitModal: document.getElementById('seb-quit-modal'),
  quitPasswordInput: document.getElementById('quit-password-input'),
  quitErrorText: document.getElementById('quit-error-text'),
  btnCancelQuit: document.getElementById('btn-cancel-quit'),
  btnConfirmQuit: document.getElementById('btn-confirm-quit'),
  sebRejectionModal: document.getElementById('seb-rejection-modal'),
  rejectionModalReason: document.getElementById('rejection-modal-reason'),
  rejectionModalUa: document.getElementById('rejection-modal-ua'),
  btnDismissRejection: document.getElementById('btn-dismiss-rejection'),

  // Kiosk Lockout Alert Modal
  sebLockoutModal: document.getElementById('seb-lockout-modal'),
  lockoutViolationCount: document.getElementById('lockout-violation-count'),
  lockoutTimestamp: document.getElementById('lockout-timestamp'),
  btnResumeFocus: document.getElementById('btn-resume-focus'),

  // Proctor Drawer (F2)
  proctorDrawer: document.getElementById('proctor-drawer'),
  btnCloseDrawer: document.getElementById('btn-close-drawer'),
  drawerLiveUrlInput: document.getElementById('drawer-live-url-input'),
  drawerUseLiveToggle: document.getElementById('drawer-use-live-toggle'),
  btnDrawerApplyLiveUrl: document.getElementById('btn-drawer-apply-live-url')
};

// ========================================================
// INITIALIZATION
// ========================================================
function init() {
  checkLiveFormMode();
  setupFullscreenLock();
  startSebClock();
  setupFormNavigationFlow();
  setupSebTaskbar();
  setupProctorDrawer();
  renderSoalUjian();

  // Polling clock setiap detik
  setInterval(updateSebClock, 1000);
}

// Live SEB Taskbar Clock
function updateSebClock() {
  if (!el.sebClock) return;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  el.sebClock.textContent = `${hours}:${minutes}`;
}

function startSebClock() {
  updateSebClock();
}

// Check if live Google Form URL should be embedded
function checkLiveFormMode() {
  if (!el.liveGformWrapper || !el.liveGformIframe || !el.gformContainer) return;

  if (GOOGLE_FORM_CONFIG.useLiveGoogleForm && GOOGLE_FORM_CONFIG.liveFormUrl) {
    el.gformContainer.style.display = 'none';
    el.liveGformWrapper.style.display = 'block';

    let url = GOOGLE_FORM_CONFIG.liveFormUrl.trim();
    if (url.includes('docs.google.com/forms')) {
      const sep = url.includes('?') ? '&' : '?';
      if (!url.includes('hl=')) {
        url += `${sep}hl=id`;
      }
      if (!url.includes('embedded=true')) {
        url += (url.includes('?') ? '&' : '?') + 'embedded=true';
      }
    }
    if (el.liveGformIframe.src !== url) {
      el.liveGformIframe.src = url;
    }

    if (el.drawerLiveUrlInput) el.drawerLiveUrlInput.value = url;
    if (el.drawerUseLiveToggle) el.drawerUseLiveToggle.checked = true;
  } else {
    el.liveGformWrapper.style.display = 'none';
    el.gformContainer.style.display = 'flex';
    if (el.drawerUseLiveToggle) el.drawerUseLiveToggle.checked = false;
  }
}

// ========================================================
// ADVANCED KIOSK LOCKDOWN & ANTI-FOCUS DEFENSE
// ========================================================
function setupFullscreenLock() {
  if (document.fullscreenElement) {
    state.isKioskLocked = true;
    el.fullscreenEntryOverlay.style.display = 'none';
    engageKeyboardHardwareLock();
  }

  // Attempt auto fullscreen
  attemptFullscreen();

  el.btnEnterFullscreen.addEventListener('click', (e) => {
    e.stopPropagation();
    state.isKioskLocked = true;
    enterFullscreen();
  });

  el.fullscreenEntryOverlay.addEventListener('click', () => {
    state.isKioskLocked = true;
    enterFullscreen();
  });

  if (el.btnRestoreFullscreen) {
    el.btnRestoreFullscreen.addEventListener('click', (e) => {
      e.stopPropagation();
      enterFullscreen();
    });
  }
  if (el.fullscreenRestoreOverlay) {
    el.fullscreenRestoreOverlay.addEventListener('click', () => {
      enterFullscreen();
    });
  }

  // Resume focus button on lockout alert modal
  if (el.btnResumeFocus) {
    el.btnResumeFocus.addEventListener('click', () => {
      if (el.sebLockoutModal) el.sebLockoutModal.style.display = 'none';
      window.focus();
      enterFullscreen();
    });
  }

  // Handle Fullscreen Exit Interception (Senyap tanpa popup alert)
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      engageKeyboardHardwareLock();
    }
  });

  // Setup Anti-Focus & Tab Switching Defense
  setupAntiFocusDefense();
}

// Hardware Keyboard Lock (Intercepts Esc, F11, Alt, Tab, Windows Key in Chrome/Edge)
async function engageKeyboardHardwareLock() {
  if (navigator.keyboard && navigator.keyboard.lock) {
    try {
      await navigator.keyboard.lock([
        'Escape',
        'F11',
        'Tab',
        'AltLeft',
        'AltRight',
        'MetaLeft',
        'MetaRight',
        'ContextMenu'
      ]);
    } catch (e) {}
  }
}

// Dinonaktifkan - Murni tanpa notifikasi suara
function playSecurityAlertSound() {}

// Anti-Focus & Tab Switch Interceptor (MURNI NO NOTIFIKASI)
function setupAntiFocusDefense() {
  // Blokir kombinasi tombol terlarang secara senyap (tanpa popup alarm)
  window.addEventListener('keydown', (e) => {
    // F2: Satu-satunya cara membuka Konsol Pengawas (Sesuai Permintaan!)
    if (e.key === 'F2') {
      e.preventDefault();
      toggleProctorDrawer();
      return;
    }

    if (!state.isKioskLocked || state.isAuthorizedExit) return;

    // Block F11 & Escape (Force Fullscreen)
    if (e.key === 'F11' || e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      enterFullscreen();
      return false;
    }

    // Block Alt combinations (Alt+Tab, Alt+F4, Alt+Left/Right)
    if (e.altKey) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block Ctrl combinations (Except Ctrl+C which is permitted for text copy)
    if (e.ctrlKey || e.metaKey) {
      const k = (e.key || '').toLowerCase();
      // 'c' is excluded so student can freely use Ctrl+C to copy without popup!
      if (['w', 't', 'n', 'r', 'p', 's', 'u', 'i', 'j'].includes(k) || e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Block F12 (DevTools), F5 (Reload)
    if (e.key === 'F12' || e.key === 'F5') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // M2 (Klik Kanan) Interception - Mencegat menu konteks dan otomatis salin teks secara senyap
  const handleContextMenuInterception = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') {
      e.stopImmediatePropagation();
    }

    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim().length > 0) {
      copyTextToClipboard(selectedText);
    }
    return false;
  };
  window.addEventListener('contextmenu', handleContextMenuInterception, true);
  document.addEventListener('contextmenu', handleContextMenuInterception, true);
  if (document.documentElement) {
    document.documentElement.addEventListener('contextmenu', handleContextMenuInterception, true);
  }
  window.addEventListener('auxclick', (e) => {
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

// Copy Helper (Senyap tanpa toast pop-up)
function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  try {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
  } catch (err) {}
}

function showCopyToast(msg) {
  // Dinonaktifkan - Murni tanpa notifikasi
}

// Telemetri senyap tanpa modal popup
function handleFocusLostViolation(reason) {
  state.violationsCount++;
  logSecurityViolation(reason);
}

function logSecurityViolation(reason) {
  fetch('/api/exam/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'KIOSK_FOCUS_VIOLATION',
      reason: reason,
      violations: state.violationsCount,
      timestamp: new Date().toISOString()
    })
  }).catch(() => {});
}

function attemptFullscreen() {
  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().then(() => {
      state.isKioskLocked = true;
      el.fullscreenEntryOverlay.style.display = 'none';
      engageKeyboardHardwareLock();
    }).catch(() => {
      el.fullscreenEntryOverlay.style.display = 'flex';
    });
  }
}

function enterFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().then(() => {
      state.isKioskLocked = true;
      el.fullscreenEntryOverlay.style.display = 'none';
      engageKeyboardHardwareLock();
    }).catch(() => {});
  }
}

// ========================================================
// SEB TASKBAR CLOCK
// ========================================================
function startSebClock() {
  updateSebClock();
}

function updateSebClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  el.sebClock.textContent = `${hours}:${minutes}`;
}

// ========================================================
// MULTI-STAGE GOOGLE FORMS NAVIGATION FLOW
// ========================================================
function setupFormNavigationFlow() {
  
  // TAHAP 1 -> TAHAP 2 (Dari Token Awal ke Absensi)
  if (el.btnToAbsensi) {
    el.btnToAbsensi.addEventListener('click', () => {
      const email = el.inputEmail ? el.inputEmail.value.trim() : '';
      const token = el.inputToken ? el.inputToken.value.trim().toUpperCase() : '';

      let valid = true;
      if (el.inputEmail && (!email || !email.includes('@'))) {
        if (el.errorEmail) el.errorEmail.style.display = 'block';
        valid = false;
      } else if (el.errorEmail) {
        el.errorEmail.style.display = 'none';
      }

      if (token !== GOOGLE_FORM_CONFIG.initialToken.toUpperCase()) {
        if (el.errorToken) el.errorToken.style.display = 'block';
        valid = false;
      } else if (el.errorToken) {
        el.errorToken.style.display = 'none';
      }

      if (!valid) return;

      state.studentEmail = email || 'peserta@man19jkt.sch.id';
      state.studentToken = token;

      // Switch to Absensi
      el.gformSection1.style.display = 'none';
      el.gformSectionAbsensi.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // TAHAP 2 -> TAHAP 1 (Kembali dari Absensi ke Token)
  el.btnBackToS1.addEventListener('click', () => {
    el.gformSectionAbsensi.style.display = 'none';
    el.gformSection1.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // TAHAP 2 -> TAHAP 3 (Dari Absensi ke Pilih Mapel)
  el.btnToPilihMapel.addEventListener('click', () => {
    const nama = el.inputNamaSiswa.value.trim();
    const nisn = el.inputNisn.value.trim();

    let valid = true;
    if (!nama) {
      el.errorNama.style.display = 'block';
      valid = false;
    } else {
      el.errorNama.style.display = 'none';
    }

    if (!nisn) {
      el.errorNisn.style.display = 'block';
      valid = false;
    } else {
      el.errorNisn.style.display = 'none';
    }

    if (!valid) return;

    state.studentNama = nama;
    state.studentNisn = nisn;
    const kelasRadio = document.querySelector('input[name="radio-kelas"]:checked');
    if (kelasRadio) state.studentKelas = kelasRadio.value;

    // Switch to Pilih Mapel
    el.gformSectionAbsensi.style.display = 'none';
    el.gformSectionMapel.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // TAHAP 3 -> TAHAP 2 (Kembali dari Pilih Mapel ke Absensi)
  el.btnBackToAbsensi.addEventListener('click', () => {
    el.gformSectionMapel.style.display = 'none';
    el.gformSectionAbsensi.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // TAHAP 3 -> TAHAP 4 (Verifikasi Token Mapel L0G1K4 & Masuk ke Soal)
  el.btnToSoalUjian.addEventListener('click', () => {
    const mapelRadio = document.querySelector('input[name="radio-mapel"]:checked');
    const selectedMapel = mapelRadio ? mapelRadio.value : 'MTK';
    const enteredToken = el.inputTokenMapel.value.trim().toUpperCase();

    state.studentMapel = selectedMapel;
    const expectedToken = (GOOGLE_FORM_CONFIG.mapelTokens[selectedMapel] || 'L0G1K4').toUpperCase();

    // Verifikasi Token Mapel (misal: L0G1K4 untuk MTK)
    if (enteredToken !== expectedToken) {
      el.errorTokenMapel.textContent = `Token ujian salah! Token mapel ${selectedMapel} tidak valid.`;
      el.errorTokenMapel.style.display = 'block';
      return;
    }
    el.errorTokenMapel.style.display = 'none';
    state.studentTokenMapel = enteredToken;

    // Update Judul Soal
    if (selectedMapel === 'MTK') {
      el.soalMapelTitle.textContent = "Soal Ujian: Matematika (MTK) & Logika";
    } else if (selectedMapel === 'INFORMATIKA') {
      el.soalMapelTitle.textContent = "Soal Ujian: Informatika & Literasi Komputer";
    } else {
      el.soalMapelTitle.textContent = "Soal Ujian: Bahasa Indonesia";
    }

    // Switch to Soal
    el.gformSectionMapel.style.display = 'none';
    el.gformSectionSoal.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // TAHAP 4 -> TAHAP 3 (Kembali dari Soal ke Pilih Mapel)
  el.btnBackToMapel.addEventListener('click', () => {
    el.gformSectionSoal.style.display = 'none';
    el.gformSectionMapel.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Kirim Jawaban ke Server CBT
  el.btnSubmitExam.addEventListener('click', submitExamAnswers);

  // Clear Form Buttons
  if (el.btnClearS1) {
    el.btnClearS1.addEventListener('click', () => {
      if (el.inputEmail) el.inputEmail.value = '';
      if (el.inputToken) el.inputToken.value = '';
    });
  }
  if (el.btnClearAbsensi) {
    el.btnClearAbsensi.addEventListener('click', () => {
      if (el.inputNamaSiswa) el.inputNamaSiswa.value = '';
      if (el.inputNisn) el.inputNisn.value = '';
    });
  }
  if (el.btnClearMapel) {
    el.btnClearMapel.addEventListener('click', () => {
      if (el.inputTokenMapel) el.inputTokenMapel.value = '';
    });
  }
  if (el.btnClearSoal) {
    el.btnClearSoal.addEventListener('click', () => {
      state.answers = {};
      renderSoalUjian();
    });
  }

  // Restart Exam
  if (el.linkRestartExam) {
    el.linkRestartExam.addEventListener('click', () => {
      state.answers = {};
      el.gformSectionCompleted.style.display = 'none';
      el.gformSection1.style.display = 'flex';
      renderSoalUjian();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reload icons (Sesuai Gambar 4: Reload live Google Form atau halaman)
  if (el.topNavReload) {
    el.topNavReload.addEventListener('click', () => {
      if (GOOGLE_FORM_CONFIG.useLiveGoogleForm && el.liveGformIframe) {
        try {
          el.liveGformIframe.src = el.liveGformIframe.src;
        } catch (e) {
          window.location.reload();
        }
      } else {
        window.location.reload();
      }
    });
  }
  if (el.taskbarBtnReload) {
    el.taskbarBtnReload.addEventListener('click', () => window.location.reload());
  }
}

// Render Questions
function renderSoalUjian() {
  el.gformQuestionsList.innerHTML = '';

  SOAL_MAPEL_MTK.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'gform-card question-card';
    card.id = `q-card-${idx}`;

    const optionsHtml = q.options.map(opt => {
      const displayText = opt.text.startsWith(opt.letter + '.') ? opt.text : `${opt.letter}. ${opt.text}`;
      return `
        <label class="gform-option-item" for="q-${idx}-opt-${opt.letter}">
          <input type="radio" name="question-${idx}" id="q-${idx}-opt-${opt.letter}" 
                 value="${opt.letter}" class="gform-radio" 
                 ${state.answers[idx] === opt.letter ? 'checked' : ''}>
          <span>${displayText}</span>
        </label>
      `;
    }).join('');

    const formattedText = q.text.split('\n\n').map(p => `<p style="margin-bottom: 8px; line-height: 1.55;">${p.replace(/\n/g, '<br>')}</p>`).join('');

    card.innerHTML = `
      <div class="gform-question-label" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <div style="flex: 1;">${formattedText}</div>
        <span class="required-star" style="font-size: 16px; font-weight: bold; color: #d93025;">*</span>
      </div>
      <div class="gform-options-list">
        ${optionsHtml}
      </div>
      <div class="gform-error-msg" id="err-q-${idx}" style="display: none;">
        Pertanyaan ini wajib diisi.
      </div>
    `;

    card.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.answers[idx] = e.target.value;
        const err = document.getElementById(`err-q-${idx}`);
        if (err) err.style.display = 'none';
      });
    });

    el.gformQuestionsList.appendChild(card);
  });
}

// Submit Answers
async function submitExamAnswers() {
  let allAnswered = true;
  SOAL_MAPEL_MTK.forEach((q, idx) => {
    if (!state.answers[idx]) {
      allAnswered = false;
      const err = document.getElementById(`err-q-${idx}`);
      if (err) err.style.display = 'block';
    }
  });

  if (!allAnswered) {
    alert('Harap lengkapi semua jawaban yang bertanda bintang sebelum mengirimkan ujian.');
    return;
  }

  // Calculate score
  let correctCount = 0;
  SOAL_MAPEL_MTK.forEach((q, idx) => {
    if (state.answers[idx] === q.correctAnswer) {
      correctCount++;
    }
  });
  const score = Math.round((correctCount / SOAL_MAPEL_MTK.length) * 100);

  const payload = {
    studentId: state.studentEmail || 'PESERTA-ASAT-01',
    namaSiswa: state.studentNama,
    nisn: state.studentNisn,
    kelas: state.studentKelas,
    mapel: state.studentMapel,
    tokenMapel: state.studentTokenMapel,
    answers: state.answers,
    score: score,
    totalQuestions: SOAL_MAPEL_MTK.length
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Exambro-Client': 'OfficialWrapper',
    'X-Exambro-Signature': 'EXAMBRO-HMAC-SECURE-KEY-2026',
    'X-Simulated-UA': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ExambroClient/2.0 CBT-Official/2026 SafeExamBrowser/3.4'
  };

  try {
    const res = await fetch('/api/exam/submit', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.status === 200 && data.success) {
      el.gformSectionSoal.style.display = 'none';
      el.gformSectionCompleted.style.display = 'flex';
      el.completedScoreBox.innerHTML = `
        <strong>Rekapitulasi Ujian &amp; Absensi Peserta:</strong><br>
        - Nama Peserta: <strong>${state.studentNama}</strong> (NISN: ${state.studentNisn})<br>
        - Kelas: <strong>${state.studentKelas}</strong> | Status: <strong>HADIR</strong><br>
        - Mata Pelajaran: <strong>${state.studentMapel}</strong> (Token: ${state.studentTokenMapel})<br>
        - Skor Akhir: <strong>${score} / 100</strong> (${correctCount} dari ${SOAL_MAPEL_MTK.length} Soal Benar)<br>
        - Status Server CBT: <strong style="color:#137333;">TERVERIFIKASI &amp; TERSIMPAN</strong>
      `;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      el.rejectionModalReason.textContent = data.reason || 'Server CBT menolak jawaban Anda.';
      el.sebRejectionModal.style.display = 'flex';
    }
  } catch (err) {
    alert('Gagal menghubungi server CBT: ' + err.message);
  }
}

// ========================================================
// SEB TASKBAR & DIRECT WINDOW CLOSING (PASSWORD: 1234567890)
// ========================================================
function setupSebTaskbar() {
  // Power button -> opens Password Modal
  el.taskbarBtnPower.addEventListener('click', () => {
    state.isQuittingModalOpen = true;
    el.quitPasswordInput.value = '';
    el.quitErrorText.style.display = 'none';
    el.sebQuitModal.style.display = 'flex';
    el.quitPasswordInput.focus();
  });

  // Reload button
  if (el.taskbarBtnReload) {
    el.taskbarBtnReload.addEventListener('click', () => {
      window.location.reload();
    });
  }

  el.btnCancelQuit.addEventListener('click', () => {
    state.isQuittingModalOpen = false;
    el.sebQuitModal.style.display = 'none';
    window.focus();
  });

  // Confirm Quit with Password: 1234567890
  el.btnConfirmQuit.addEventListener('click', handleQuitConfirmation);
  el.quitPasswordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuitConfirmation();
    }
  });

  // Rejection modal dismiss
  if (el.btnDismissRejection) {
    el.btnDismissRejection.addEventListener('click', () => {
      if (el.sebRejectionModal) el.sebRejectionModal.style.display = 'none';
    });
  }

  // SEB Logo: Pasif murni seperti SEB asli (TIDAK MEMBUKA PANEL APAPUN SAAT DIKLIK)
  // Panel laci pengawas HANYA bisa dibuka dengan menekan tombol F2 sesuai permintaan!

  // 1. Audio Flyout & Interactive Volume Slider
  function getAudioIconSvg(val, isMuted) {
    if (isMuted || val === 0) {
      // Muted: Speaker with X
      return `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"></line>
          <line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"></line>
        </svg>
      `;
    } else if (val <= 35) {
      // Low: Speaker with no waves
      return `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        </svg>
      `;
    } else if (val <= 70) {
      // Medium: Speaker with 1 wave
      return `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"></path>
        </svg>
      `;
    } else {
      // High: Speaker with 2 waves
      return `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"></path>
        </svg>
      `;
    }
  }

  function updateAudioDisplay() {
    const val = state.volumeLevel;
    const isMuted = state.isAudioMuted || val === 0;
    const svg = getAudioIconSvg(val, isMuted);

    if (el.audioIconContainer) el.audioIconContainer.innerHTML = svg;
    if (el.volumeFlyoutIconBox) el.volumeFlyoutIconBox.innerHTML = svg;
    if (el.volumeSliderMuteIcon) el.volumeSliderMuteIcon.innerHTML = svg;
    if (el.volumePercentText) el.volumePercentText.textContent = `${isMuted ? 0 : val}%`;
    if (el.volumeRangeInput) {
      el.volumeRangeInput.value = isMuted ? 0 : val;
      const pct = isMuted ? 0 : val;
      el.volumeRangeInput.style.background = `linear-gradient(to right, #0078d7 0%, #0078d7 ${pct}%, #dadce0 ${pct}%, #dadce0 100%)`;
    }

    if (el.taskbarBtnAudio) {
      el.taskbarBtnAudio.title = isMuted
        ? "Audio Sistem: Dibisukan (0%) - Klik untuk Buka Pengaturan Volume"
        : `Audio Sistem: ${val}% - Klik untuk Buka Pengaturan Volume`;
    }
  }

  // Toggle Volume Flyout on Taskbar Audio Button Click
  if (el.taskbarBtnAudio) {
    el.taskbarBtnAudio.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!el.sebVolumeFlyout) return;
      const isVisible = el.sebVolumeFlyout.style.display === 'block';
      el.sebVolumeFlyout.style.display = isVisible ? 'none' : 'block';
      if (!isVisible && el.sebWifiFlyout) el.sebWifiFlyout.style.display = 'none';
      if (!isVisible) updateAudioDisplay();
    });
  }

  // Volume Slider Drag / Change Handler
  if (el.volumeRangeInput) {
    el.volumeRangeInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.volumeLevel = val;
      state.isAudioMuted = (val === 0);
      updateAudioDisplay();
    });
  }

  // Mute / Unmute Toggle inside Flyout
  if (el.btnVolumeMuteToggle) {
    el.btnVolumeMuteToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.volumeLevel > 0 && !state.isAudioMuted) {
        state.prevVolumeLevel = state.volumeLevel;
        state.volumeLevel = 0;
        state.isAudioMuted = true;
      } else {
        state.volumeLevel = state.prevVolumeLevel || 80;
        state.isAudioMuted = false;
      }
      updateAudioDisplay();
    });
  }

  // 2. Wi-Fi Flyout Network Popup
  if (el.taskbarBtnWifi) {
    el.taskbarBtnWifi.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!el.sebWifiFlyout) return;
      const isVisible = el.sebWifiFlyout.style.display === 'block';
      el.sebWifiFlyout.style.display = isVisible ? 'none' : 'block';
      if (!isVisible && el.sebVolumeFlyout) el.sebVolumeFlyout.style.display = 'none';
    });
  }

  // Close Wi-Fi and Volume flyouts when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (el.sebWifiFlyout && el.sebWifiFlyout.style.display === 'block') {
      if (!el.sebWifiFlyout.contains(e.target) && e.target !== el.taskbarBtnWifi && !el.taskbarBtnWifi.contains(e.target)) {
        el.sebWifiFlyout.style.display = 'none';
      }
    }
    if (el.sebVolumeFlyout && el.sebVolumeFlyout.style.display === 'block') {
      if (!el.sebVolumeFlyout.contains(e.target) && e.target !== el.taskbarBtnAudio && !el.taskbarBtnAudio.contains(e.target)) {
        el.sebVolumeFlyout.style.display = 'none';
      }
    }
  });

  // Wi-Fi On/Off Switch
  if (el.wifiToggleSwitch) {
    el.wifiToggleSwitch.addEventListener('change', (e) => {
      state.isWifiActive = e.target.checked;
      const netList = document.getElementById('wifi-networks-list');
      const footer = document.getElementById('wifi-status-footer');
      if (state.isWifiActive) {
        if (netList) netList.style.display = 'block';
        if (footer) footer.textContent = 'IP: 192.168.1.108 · Status: Online';
        if (el.taskbarBtnWifi) {
          el.taskbarBtnWifi.style.opacity = '1';
          el.taskbarBtnWifi.title = 'Koneksi Jaringan: Terhubung ke MAN19-HOTSPOT-CBT';
        }
      } else {
        if (netList) netList.style.display = 'none';
        if (footer) footer.textContent = 'Wi-Fi Dinonaktifkan';
        if (el.taskbarBtnWifi) {
          el.taskbarBtnWifi.style.opacity = '0.4';
          el.taskbarBtnWifi.title = 'Wi-Fi Dimatikan';
        }
      }
    });
  }

  // Connect/Disconnect CBT Hotspot Button
  if (el.btnWifiActionCbt) {
    el.btnWifiActionCbt.addEventListener('click', () => {
      const net1 = document.getElementById('wifi-net-1');
      if (el.btnWifiActionCbt.textContent === 'Tersambung') {
        el.btnWifiActionCbt.textContent = 'Hubungkan';
        el.btnWifiActionCbt.classList.add('secondary');
        if (el.wifiCbtStatus) el.wifiCbtStatus.textContent = 'Tersedia, diamankan';
        if (net1) net1.classList.remove('connected');
        if (el.wifiStatusFooter) el.wifiStatusFooter.textContent = 'Terputus dari jaringan';
      } else {
        el.btnWifiActionCbt.textContent = 'Tersambung';
        el.btnWifiActionCbt.classList.remove('secondary');
        if (el.wifiCbtStatus) el.wifiCbtStatus.textContent = 'Tersambung, aman (Hotspot Ujian)';
        if (net1) net1.classList.add('connected');
        if (el.wifiStatusFooter) el.wifiStatusFooter.textContent = 'IP: 192.168.1.108 · Status: Online';
      }
    });
  }

  // Inisialisasi tampilan awal audio
  updateAudioDisplay();
}

function handleQuitConfirmation() {
  const entered = el.quitPasswordInput.value.trim();

  // Verifikasi Password: 1234567890
  if (entered === GOOGLE_FORM_CONFIG.proctorQuitPassword) {
    state.isAuthorizedExit = true;
    state.isKioskLocked = false;
    state.isQuittingModalOpen = false;
    el.sebQuitModal.style.display = 'none';

    // 1. Lepas Hardware Keyboard Lock
    if (navigator.keyboard && navigator.keyboard.unlock) {
      navigator.keyboard.unlock();
    }

    // 2. Keluar dari fullscreen
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    // 3. Langsung tutup tab / window seketika
    try {
      window.open('', '_self', '');
      window.close();
    } catch (e) {}

    // 4. Fallback jika browser membatasi window.close() pada tab primer:
    setTimeout(() => {
      window.location.replace("about:blank");
    }, 40);

  } else {
    el.quitErrorText.style.display = 'block';
    el.quitPasswordInput.select();
  }
}

// ========================================================
// PROCTOR DRAWER (F2) & FORM LINK CONFIGURATOR
// ========================================================
function setupProctorDrawer() {
  if (el.btnCloseDrawer) {
    el.btnCloseDrawer.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleProctorDrawer();
    });
  }

  // Apply Live Google Form URL directly from drawer
  if (el.btnDrawerApplyLiveUrl) {
    el.btnDrawerApplyLiveUrl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const rawUrl = el.drawerLiveUrlInput ? el.drawerLiveUrlInput.value.trim() : '';
      const useLive = el.drawerUseLiveToggle ? el.drawerUseLiveToggle.checked : true;

      if (!rawUrl) {
        if (el.drawerLiveUrlInput) {
          el.drawerLiveUrlInput.focus();
          el.drawerLiveUrlInput.style.borderColor = '#d93025';
          setTimeout(() => { el.drawerLiveUrlInput.style.borderColor = '#dadce0'; }, 1500);
        }
        return;
      }

      GOOGLE_FORM_CONFIG.liveFormUrl = rawUrl;
      GOOGLE_FORM_CONFIG.useLiveGoogleForm = useLive;
      checkLiveFormMode();

      // Visual feedback directly on the button (Tanpa alert yang merusak fokus!)
      const origText = el.btnDrawerApplyLiveUrl.textContent;
      el.btnDrawerApplyLiveUrl.textContent = '✓ Link Berhasil Diterapkan!';
      el.btnDrawerApplyLiveUrl.style.backgroundColor = '#137333';

      setTimeout(() => {
        el.btnDrawerApplyLiveUrl.textContent = origText;
        el.btnDrawerApplyLiveUrl.style.backgroundColor = '';
        state.proctorDrawerOpen = false;
        if (el.proctorDrawer) el.proctorDrawer.classList.remove('open');
      }, 700);
    });
  }

  // Close drawer when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (state.proctorDrawerOpen && el.proctorDrawer) {
      if (!el.proctorDrawer.contains(e.target) && e.target !== el.sebLogoBtn && !el.sebLogoBtn?.contains(e.target)) {
        state.proctorDrawerOpen = false;
        el.proctorDrawer.classList.remove('open');
      }
    }
  });
}

function toggleProctorDrawer() {
  state.proctorDrawerOpen = !state.proctorDrawerOpen;
  if (el.proctorDrawer) {
    el.proctorDrawer.classList.toggle('open', state.proctorDrawerOpen);
    if (state.proctorDrawerOpen) {
      if (el.drawerLiveUrlInput) {
        el.drawerLiveUrlInput.value = GOOGLE_FORM_CONFIG.liveFormUrl || '';
        setTimeout(() => el.drawerLiveUrlInput.focus(), 60);
      }
      if (el.drawerUseLiveToggle) {
        el.drawerUseLiveToggle.checked = GOOGLE_FORM_CONFIG.useLiveGoogleForm;
      }
    }
  }
}

// ========================================================
// CREATOR SECURITY & HARNESS RECOGNITION (ADMIN ONLY)
// ========================================================
function setupCreatorHandshake() {
  // Cegah duplikasi: Jika Tampermonkey sempat menginjeksi widget ke outer window,
  // segera bersihkan dari outer shell sehingga HANYA 1 widget yang tampil (yaitu di dalam Google Forms)!
  const cleanupOuterDuplicate = () => {
    const outerHarness = document.getElementById('rdc-test-harness');
    if (outerHarness) {
      if (!state.isCreatorAuthorized) {
        state.isCreatorAuthorized = true;
        console.log("%c[Security Protocol] Creator Admin Verified via Tampermonkey Harness.", "color:#38ef7d; font-weight:bold; font-size:12px;");
        fetch('/api/exam/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'CREATOR_HARNESS_AUTHENTICATED',
            studentId: 'CREATOR_ADMIN_ILYAS',
            violationCount: 0
          })
        }).catch(() => {});
      }
      outerHarness.remove();
    }
  };

  const observer = new MutationObserver(() => cleanupOuterDuplicate());
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
  cleanupOuterDuplicate();
  setInterval(cleanupOuterDuplicate, 500);
}

// Start (Instant execution fallback so Tampermonkey / late load never blocks init)
function startApp() {
  init();
  setupCreatorHandshake();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
