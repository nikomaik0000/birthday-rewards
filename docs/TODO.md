# TODO

## Done

- Homepage UX Polish (Phase 4E) — Desktop table's expand panel no longer duplicates visible columns, showing only notes/tags/link (the genuinely missing info); collapses to zero height and dims its chevron when a reward has none of those; Mobile's expand panel always shows the full description (kept simple, no JS truncation detection) plus rating/category/expiry alongside notes/tags/link; extracted a shared `RewardExtraInfo` component reused by both Desktop and Mobile; verified via actual rendering with varied mock content that the Card grid's equal-height mechanism already works correctly, no changes needed there; no functional changes
- Homepage UX Refinement (Phase 4D) — mobile wordmark stays on one line at every width (no truncation, no wrap); reward card padding/spacing trimmed to remove empty vertical space (typography unchanged); Desktop Table now expands/collapses inline on row click instead of navigating to the detail page, matching the existing Mobile accordion behavior exactly; expanded row content extended with full description, notes, and tags; extracted a shared `RewardCardBody` component so Card grid and Table accordion reuse identical rendering logic; `/reward/[id]` route kept intact for direct access/SEO, only internal navigation to it removed; no functional changes to search/filter/sort/favorite/used
- Homepage Visual Refinement (Phase 4C v2) — header simplified to English-only wordmark (uppercase, wider tracking); 0.075em letter-spacing applied site-wide via inherited body tracking; reward card breathing room increased (padding, divider spacing, description line-height, notes spacing, bottom spacing); grid gap increased; search bar background/radius now matches the filter bar; badge border/text unified via `badgeBorder`/`badgeText` tokens; all active/selected states (view toggle, filter badge, tag selection, used-filter toggle, sort selection) unified onto one `accentSoft` token; store name typography refined (serif, 20px, light); divider uses dedicated `divider` token; card shadow softened; no new hardcoded colors — everything added to `lib/theme.ts`; no functional changes
- Homepage Visual Refresh (Phase 4C) — light-weight serif "Birthday Rewards" wordmark with generous letter-spacing + small Chinese subtitle in a compact two-line header; larger/rounder search bar with more breathing room; filter toggle and result count merged into one row; view toggle active state switched from dark ink to a soft coffee tint; reward card restructured (softened divider under title, description, optional notes in a lighter tone, badges + rating moved to the bottom row, Link/Favorite grouped as top-right icon buttons with Used kept as a labeled pill); all colors driven by centralized theme tokens; no changes to search/filter/sort logic or toggle behavior
- Homepage UI Refinement (Phase 4B) — removed the modal from Phase 4A entirely (cards are non-interactive again); unified badge row (Category → Validity → Redemption tags) with one shared badge style; reserved one-line notes row for fixed card height; typography hierarchy (16px/semibold store name, 14px description, 12px notes); Lucide `Star`/`Tag`/`Calendar` icons replace remaining emoji; used-status pill kept as-is
- Card Modal (Phase 4A) — reward cards stay a fixed height and open a lightweight modal (full content + tags) instead of linking to the detail page; official-site visit moved to a small link icon beside Favorite; used-toggle/favorite/link-icon keep independent click behavior; detail page kept for direct links/sharing/sitemap
- Dashboard Summary Simplification (Phase 3D) — removed Total Rewards, Average Score, and Highest-rated Store cards; single row of 店家數/收藏/已使用/未使用, category summary unchanged
- Mobile Rewards Table UI (Phase 3C) — single-line row (store + promo preview + favorite), accordion detail, no horizontal scroll

---

## High

- Theme System
- Remove Dark Mode
- localStorage

---

## Medium

- Remove Logo
- Better Tag UX

---

## Future

- AI Import
- OCR
- CSV Import
- PWA