// Vercel Serverless Function: Security Telemetry & Proctor Integrity Monitor
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Server', 'SafeExamBrowser-Server/3.3.2');
  res.setHeader('X-SafeExamBrowser-Server', '3.3.2.334');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = req.body || {};
  const violations = parseInt(body.violations || 0, 10);

  return res.status(200).json({
    received: true,
    event: body.event || 'HEARTBEAT',
    currentViolations: violations,
    maxViolations: 3,
    isExceeded: violations >= 3,
    status: violations >= 3 ? 'LOCKED_BY_PROCTOR' : 'WARNING_RECORDED',
    timestamp: new Date().toISOString()
  });
};
