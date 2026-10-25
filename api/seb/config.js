// Vercel Serverless Function: SEB Configuration Endpoint
// Returns genuine Safe Exam Browser plist XML configuration
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/seb');
  res.setHeader('Content-Disposition', 'attachment; filename="SebClientSettings.seb"');
  res.setHeader('Server', 'SafeExamBrowser-Server/3.3.2');
  res.setHeader('X-SafeExamBrowser-Server', '3.3.2.334');

  const xmlConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>originatorVersion</key>
  <string>SEB_Win_3.3.2.334</string>
  <key>startURL</key>
  <string>https://docs.google.com/forms/d/e/1FAIpQLSdAkWb-P96f-9A_DMGaCdjMZacovsh5EFVl9uXtNatSN6xfxw/viewform</string>
  <key>sebServerURL</key>
  <string>https://seb-cbt-portal.vercel.app/api/seb/handshake</string>
  <key>hashedQuitPassword</key>
  <string>5f4dcc3b5aa765d61d8327deb882cf99</string>
  <key>allowQuit</key>
  <true/>
  <key>ignoreExitKeys</key>
  <true/>
  <key>allowPreferencesWindow</key>
  <false/>
  <key>kioskMode</key>
  <true/>
  <key>taskBarHeight</key>
  <integer>46</integer>
  <key>showTaskBar</key>
  <true/>
  <key>showReloadButton</key>
  <true/>
  <key>showTime</key>
  <true/>
  <key>showInputLanguage</key>
  <true/>
  <key>audioControlEnabled</key>
  <true/>
  <key>allowWlan</key>
  <true/>
</dict>
</plist>`;

  res.status(200).send(xmlConfig);
};
