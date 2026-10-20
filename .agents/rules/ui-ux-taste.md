# UI/UX & Design Taste Rules for KisanVaani

## 1. Visual Aesthetics & Design System
- **Color Palette**:
  - Primary Green: `#0B7A3B` (Vibrant Indian Agriculture Green)
  - Surface Tint: `#E8F5EC` (Gentle Mint Sage Background)
  - Amber Warning: `#FF8A00` (Urgent Sowing / High Nitrogen Notice)
  - Critical Alert: `#D93025` (Hypoxia / Root Rot Red)
  - Neutral Background: `#FFFFFF` and `#F8FAF9`
  - Text Primary: `#132A1C` (Deep forest contrast)
- **Typography**:
  - Modern, legible typography: Noto Sans Devanagari, Inter, system-ui.
  - Generous base size: minimum 18px body font for rural accessibility.
- **Card Geometry & Touch Targets**:
  - Border radius: 24px (`rounded-3xl`) for friendly, modern aesthetic.
  - Touch targets: All action buttons MUST be ≥ 72px in height (`h-[72px]` or `min-h-[72px]`).
  - Ample spacing: `p-6`, `gap-4`, spacious padding for gloved or outdoor finger tapping.
- **Zero Keyboard Inputs for Farmer**:
  - Rural farmers (<2 ha, low literacy) do NOT type.
  - Inputs must only be: **Tap Big Card**, **Voice (STT)**, or **Camera Capture**.
- **Iconography**:
  - Use custom duotone icons with clear agricultural metaphors (sprout, water drop, soil flask, rupee coin, truck, shield).
