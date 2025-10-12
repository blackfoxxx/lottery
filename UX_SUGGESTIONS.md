# UX Enhancement Suggestions (Roadmap)

This document lists prioritized, low-risk UX improvements tailored for the Iraqi E‑commerce + Lottery platform. Items are grouped by impact and effort.

## High Impact, Low Effort (Phase 1)
- Navigation state persistence: Remember last visited section and active lottery category using localStorage.
- Reduce visual noise: Hide developer/debug panels by default (toggle via query param ?debug=1 or environment flag).
- Consistent primary actions: Use shared .btn-primary for all key CTAs (Login, Buy, Save in admin).
- Empty and loading states: Add skeleton loaders for product cards and ticket lists; ensure friendly empty messages.
- Form UX polish: Add input focus styles, helpful validation messages, and disable submit while processing.
- Accessible colors: Verify contrast on all colored badges (gold/silver/bronze) and buttons, especially on mobile in sunlight.
- RTL audit: Ensure paddings/margins use logical properties and icons align correctly in RTL (dir="rtl").

## Medium Impact, Low/Medium Effort (Phase 2)
- Global theme tokens: Centralize color palette (Iraqi green/red, neutral grays) and spacing scale in Tailwind config for consistency.
- Responsive layout audit: Ensure 2/3/4‑column grids breakpoints feel natural on common devices used in Iraq (budget Android phones).
- Toast notifications: Add success/error icons, semantic colors, and consistent durations with user‑dismiss option.
- Search & filters: Add quick category filter chips and a search bar on products; persist selections.
- Performance: Lazy‑load below‑the‑fold images (when real images are added) and defer non‑critical scripts.
- Micro‑copy: Clarify ticket generation rules near Buy action (e.g., “Includes 100 FREE tickets”).

## High Impact, Medium Effort (Phase 3)
- Onboarding spotlight: A one‑time guided tour highlighting Buy, Tickets, and Results sections.
- Transaction receipts: After purchase, show a visually clean receipt with order ID, ticket batch, and next‑steps.
- Account area: Add simple profile area with order history and ticket history tabs.
- Offline/resilience: Graceful fallback UIs for network failures with retry and contact options.

## Admin UX
- Table usability: Sticky headers, column sort, and compact density mode.
- Form safety: Unsaved changes warnings and confirmation modals for destructive actions.
- Batch actions: Select multiple products for category or stock updates.

## Mobile Focus
- Tap targets: Ensure 44px minimum for buttons and list items.
- Sticky bottom action bar on product detail/payment steps.
- Optimize input types (tel, email) and numeric keypad for IQD amounts.

## Localization & Trust
- Arabic content quality: Proofread and align tone to Iraqi dialect where appropriate.
- Trust markers: Display accepted payment logos, delivery partners, and refund policy in the footer.
- Winner transparency: Public, paginated list of past winners with verification badge.

## Analytics & Feedback
- Track key events (view product, click Buy, payment success/fail) using privacy‑respecting analytics.
- Add an always‑available feedback button to capture pain points.

## QA Checklist Additions
- Color contrast checks (WCAG AA) for key components.
- Keyboard navigation and focus traps (modals, toasts).
- RTL/LTR snapshot comparison.

---
Status: Phase 1 items partially implemented in v3.3 (buttons, header, cards, debug toggle). Mobile app version UI added (About page) in v3.4.