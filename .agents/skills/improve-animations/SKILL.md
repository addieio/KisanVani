---
name: improve-animations
description: Surveys and audits motion code (read-only) to produce smooth animation and micro-interaction plans.
---

# Improve Animations Skill

Dedicated to designing physics-based, 60fps animations and micro-interactions that elevate perceived app speed.

## Directives
1. **Framer Motion Patterns**:
   - Use `layoutId` for smooth shared element transitions.
   - Employ `AnimatePresence` for modal entries and exits.
   - Use spring physics (`type: "spring", stiffness: 300, damping: 25`) for organic feel.
2. **Micro-interactions**: Hover scale on primary actions (`whileHover={{ scale: 1.02 }}`), click depression (`whileTap={{ scale: 0.98 }}`).
3. **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)`.
