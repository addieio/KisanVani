---
name: frontend-design
description: Design engineering rules for accessible, high-taste agricultural PWA and B2B buyer interfaces.
---

# Frontend Design Engineering for KisanVaani

1. **Farmer Touch Targets**: All primary farmer action buttons must be at least 72px tall (`min-h-[72px]`), with tactile active feedback (`active:scale-95`). Zero-typing ergonomics.
2. **High Contrast**: Ensure text contrast meets WCAG AAA standards for bright sunlight outdoor viewability.
3. **PWA Offline Indicator**: Permanent visible offline sync indicator pill.
4. **Visual Hierarchy & Depth**: Subtle border rings, layered shadows (`shadow-sm`, `shadow-md`), and tinted backgrounds.
5. **Component Modularity**: Reusable, well-structured UI components with semantic HTML.
