# Design Direction: Exambro CBT Research Lab

## 1. Product Identity & Purpose
A web-based research platform and simulation for institutional Computer-Based Testing (CBT) systems (analogous to the Indonesian Pusmendik ANBK / Exambro architecture). It investigates client-server browser verification, User-Agent detection, custom wrapper signatures, and security lockdown bypass vectors.

## 2. Visual Character & Mood
- **Character**: Institutional, authoritative, technically rigorous, and clean.
- **Mood**: High focus, reliable exam environment paired with an engineer's diagnostic inspection workbench.

## 3. Color System
- **Light Theme**:
  - Background: `#f8fafc` (Slate 50)
  - Card & Container Surface: `#ffffff`
  - Border: `#cbd5e1` (Slate 300)
  - Text Primary: `#0f172a` (Slate 900, Contrast ratio 14.5:1)
  - Text Secondary: `#475569` (Slate 600, Contrast ratio 5.6:1)
  - Accent / Primary Action: `#1d4ed8` (Blue 700, Contrast ratio 8.2:1)
  - Alert / Reject: `#b91c1c` (Red 700)
  - Warning / Review: `#b45309` (Amber 700)
  - Verified / Allowed: `#047857` (Emerald 700)
- **Dark Theme**:
  - Background: `#0b0f19` (Deep Slate)
  - Card & Container Surface: `#131b2e`
  - Border: `#23304a`
  - Text Primary: `#f8fafc` (Contrast ratio 13.8:1)
  - Text Secondary: `#94a3b8` (Contrast ratio 6.2:1)
  - Accent / Primary Action: `#3b82f6`
  - Alert / Reject: `#f87171`
  - Warning / Review: `#fbbf24`
  - Verified / Allowed: `#34d399`

## 4. Typography
- UI & Reading: Inter, system-ui, -apple-system, sans-serif.
- Technical Data & Payload Inspector: ui-monospace, SFMono-Regular, Menlo, monospace (for headers, User-Agent strings, HMAC tokens).

## 5. Dials
- **ENERGY**: 2 (Focused, institutional, clear visual hierarchy)
- **RHYTHM**: 2 (Structured view transitions: CBT Exam Client, Proktor Server Monitor, and Research Lab)
- **MOTION**: 1 (Immediate functional feedback, no decorative perpetual loops)
