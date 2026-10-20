---
name: improve-react
description: Inspects React codebases via automated checks to suggest component and state-management UI upgrades.
---

# Improve React Skill

Analyzes and refactors React codebases for state integrity, React 19 capabilities, and clean architecture.

## Directives
1. **React 19 & Next.js 16 App Router**:
   - Leverage React Server Components (RSC) where data fetching happens.
   - Use `'use client'` selectively at interactive boundaries.
   - Use clean hook patterns (`useCallback`, `useMemo`) where computationally necessary.
2. **State Management**: Keep UI modal state local; lift shared state cleanly; avoid prop drilling.
3. **Accessibility**: Ensure keyboard navigation, ARIA dialog roles, and focus traps on modals.
