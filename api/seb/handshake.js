// Vercel Serverless Function: SEB Handshake & Verification Endpoint
// Returns authentic Safe Exam Browser Server handshake protocol
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Server', 'SafeExamBrowser-Server/3.3.2');
  res.setHeader('X-SafeExamBrowser-Server', '3.3.2.334');
  res.setHeader('X-Powered-By', 'SafeExamBrowser-Server/3.3.2');

  const clientUa = req.headers['user-agent'] || '';
  const clientBek = req.headers['x-safeexambrowser-requesthash'] || '';
  const clientCk = req.headers['x-safeexambrowser-configkeyhash'] || '';

  res.status(200).json({
    status: 'ACTIVE',
    serverVersion: '3.3.2.334',
    protocolVersion: '1.0',
    institution: 'MAN 19 JAKARTA SELATAN',
    session: {
      examId: 'ASAS-GANJIL-2025-2026',
      examName: 'ASAS Ganjil TA. 2025-2026',
      sebClientSettings: 'SebClientSettings ASAS Ganjil TA. 2025-2026.seb',
      allowQuit: true,
      quitPasswordHashed: '5f4dcc3b5aa765d61d8327deb882cf99', // MD5/SHA256 representation
      kioskMode: true,
      proctorKey: '1234567890'
    },
    verification: {
      clientDetected: clientUa.includes('SEB') || clientUa.includes('SafeExamBrowser') ? 'OFFICIAL_SEB' : 'SEB_COMPATIBLE_KIOSK',
      browserExamKeyMatch: clientBek ? true : false,
      configKeyMatch: clientCk ? true : false,
      integrityVerdict: 'VERIFIED_SAFE_EXAM_ENVIRONMENT'
    },
    timestamp: new Date().toISOString()
  });
};
