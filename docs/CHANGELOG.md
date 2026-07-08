# Changelog

## v4.0 (In Progress)

### Phase 4E - Homepage UX Polish

A refinement pass on top of Phase 4D. Reuses existing components; no functional changes.

Changed

- Desktop table's expanded row no longer repeats what's already visible in the row itself (category/description/date/score/expiry/used/link) — it now shows only notes, tags, and the official link, i.e. the information that's genuinely missing from the table
- When a reward has none of those three things, the desktop expand panel now collapses to true zero height instead of revealing an empty padded box, and its chevron dims to not promise content that isn't there (mobile is unaffected — it always has something to show, since its columns are hidden)
- Mobile's expanded row now always shows the full description (kept intentionally simple — no JS-based truncation detection) alongside rating/category/expiry (the only place those are visible on mobile), plus notes/tags/link
- Tightened spacing throughout the expand panel so it's only as tall as its content requires

Added

- `components/reward-extra-info.tsx`: the notes/tags/official-link block, shared identically between the Desktop and Mobile expand panels

Verified (not assumed) that the Card grid's equal-height mechanism (`min-h-card` + `flex flex-col` + `mt-auto`-pinned badge row, combined with CSS Grid's default row-stretch) already produces consistent card heights regardless of notes/description length — confirmed by rendering the actual components with varied mock content and pixel-measuring the output; no changes were needed there.

### Phase 4D - Homepage UX Refinement

UX/behavior refinement on top of Phase 4C. Reuses existing components; no new visual design outside what's described below.

Changed

- Mobile header: the "BIRTHDAY REWARDS" wordmark now stays on one line at every screen size — smaller size + tighter tracking below `sm`, `whitespace-nowrap` instead of `truncate` (no ellipsis, no wrap)
- Reward card: padding and internal spacing trimmed to remove empty vertical space on shorter cards (typography unchanged); `cardMinHeight` reduced accordingly
- Desktop table: clicking a row now expands/collapses inline (same accordion + animation the mobile table already used) instead of navigating to `/reward/[id]` — behavior is now identical across all screen sizes
- Table's expanded row now shows the full description, notes (previously missing entirely), and tag badges, alongside the rating and official-site link that were already there

Added

- `components/reward-card-body.tsx`: extracted the description/notes/badges/rating block shared by `RewardCard` and `RewardTable`'s expanded row, so the Card grid and Table accordion can never visually drift apart — single source of truth instead of duplicated markup
- `lib/theme.ts`: `typography.letterSpacing.wordmarkCompact`, used only below the `sm` breakpoint

No changes to search/filter/sort/favorite/used logic, data fetching, or the `/reward/[id]` route itself — it's kept fully intact for direct URL access and `sitemap.ts`; only the one internal link to it (from the table's store cell) was removed.

### Phase 4B - Homepage UI Refinement

Changed

- Removed the Phase 4A modal entirely — reward cards are plain, non-interactive containers again; clicking a card does nothing (no dialog, no navigation to `/reward/[id]`)
- Consolidated badges into a single row directly under the store name, in a fixed order: Category → Validity Period (`ExpiryBadge`) → Redemption Method(s) (tags) — previously tags rendered in a separate row below the description
- All badges (`CategoryBadge`, `TagBadge`, `ExpiryBadge`) now share one unified visual style (background, text color, border, shadow, radius, padding, font size) instead of per-category/per-tag/per-expiry-state colors; the shared style lives in one place (`BADGE_CLASSES` in `lib/constants.ts`)
- Added a permanently-reserved one-line notes row below the description: `› {note}` (truncated to one line) when `reward.notes` is set, or a non-breaking space placeholder when it's empty — so every card is exactly the same height whether or not it has a note
- Typography hierarchy: store name is now 16px/semibold (was unstyled/medium); description stays 14px/regular; the new notes line is 12px, light gray, regular weight
- `StarRating` now renders a small (14px) Lucide `Star` outline icon (no fill, matching the outline style of Heart/Link) instead of the ⭐ emoji, still showing `★ 4/5`-style output; the same swap was applied to the score-filter checkboxes in `FilterPanel` for consistency
- The `›` note prefix renders at reduced opacity (`text-muted/50`) so it reads as a subtle cue rather than competing with the note text itself
- Fine-tuned vertical rhythm: slightly tighter spacing between the badge row and the description, slightly more spacing between the description and the notes line
- Replaced the 🏷 / 📅 emoji in the mobile table accordion (`RewardTable`) with Lucide `Tag` / `Calendar` icons, since that view is part of the same homepage
- The used-status pill ("已兌換" / "未使用") is unchanged — it remains a bordered pill with its text label, intentionally distinct from the icon-only Heart/Link controls since it's a status indicator, not an action button
- The `/reward/[id]` detail page is unchanged; search, filters, sorting, favorites, used-status, and the admin dashboard are all unaffected

### Phase 4A - Card Modal (Replaces Detail Page Navigation)

Changed

- Reward cards (grid view) no longer link to the `/reward/[id]` detail page on click; the entire card now opens a lightweight modal instead
- Cards keep a fixed height at all times — the 3-line content clamp is never removed, so the grid layout stays clean and consistent on both desktop and mobile
- Removed the chevron indicator — the whole card is already the click target, so a separate arrow was redundant
- Store name is now plain text instead of a hyperlink; the top-right link icon is the single, unambiguous way to visit the official site (avoids two navigation targets pointing at the same URL)
- The modal (built on the existing `Dialog`/`DialogContent` components already used elsewhere in the app) shows the reward's full, untruncated content plus its category/expiry badges and tags; it is reserved for additional information going forward (e.g. notes) and is intentionally lightweight — no navigation, no notes/history/admin editing
- A small link icon now sits beside the favorite icon in the top-right corner of the card; clicking it opens the official website directly in a new tab (only shown when the reward has an `official_url`)
- Favorite button, used-toggle button, the store-name official-site link, and the top-right link icon all stop event propagation so they keep their own click behavior and never open the modal
- The `/reward/[id]` detail page is unchanged and still reachable directly (deep links, sharing, sitemap); it's just no longer linked from the card grid
- No changes to search, filters, sorting, favorites, used-status, or admin functionality

### Phase 3D - Dashboard Summary Simplification

Removed

- Total Rewards, Average Score, and Highest-rated Store cards from the dashboard summary

Changed

- Dashboard summary now shows a single row of four cards: 店家數, 收藏, 已使用, 未使用
- Result counter simplified from "共 N 筆優惠" to "N 筆"
- Removed the "各類別數量" title above the category summary row; increased its vertical padding and switched its background to 90% opacity (`bg-surface/90`, no border) so it reads as a lighter section beneath the summary cards rather than another card

### Phase 3C - Mobile Rewards Table UI

Changed

- Rewards table on mobile now shows a single-line row: ▼ chevron + Store Name (fixed width, truncated) + one-line Promotion Content preview (fills remaining space, truncates with ellipsis) + Favorite icon (far right)
- Category, Date, Rating, Expiry, Used, and Website Link columns are hidden on mobile (`hidden md:table-cell`) and moved into an expandable accordion panel
- Removed the mobile `min-w-[880px]` constraint that forced horizontal scrolling; the minimum width now only applies at `md` and above
- Tapping a row on mobile expands an inline accordion panel below it showing the star rating, category, offer date, full offer content, and a full-width "前往官網" button — no modal or separate page
- Added a chevron indicator (mobile only) on the store cell that rotates 90° when a row is expanded
- Added a lightweight ~200ms expand/collapse transition to the accordion panel (CSS grid-rows, no animation library)
- Favorite button now stops event propagation so tapping it does not also expand/collapse the row
- Row click handler only toggles the accordion on mobile widths (`< md`); desktop clicks no longer trigger unnecessary state updates
- Simplified the expanded accordion: removed the duplicated full promotion content (already visible as the collapsed row's preview); rating, category, and date are now shown in a single horizontal row (⭐ Rating · 🏷 Category · 📅 Date) with the "前往官網" button below
- Store name width increased to 116px (from an earlier 92px pass) so medium-length names have more room before truncating
- Favorite icon gets a touch of extra left spacing on mobile (`pl-6` vs the default `pl-4`) so the row doesn't feel cramped; desktop padding is unchanged
- Desktop layout, columns, and behavior are completely unchanged

### Phase 3B - Admin Mobile Table Optimization

Changed

- Admin table on mobile now hides the Category, Rating, and Date columns, showing only Checkbox, Store, Edit, and Delete
- Reduced the table's mobile minimum width so it fits typical phone screens without unnecessary horizontal scrolling
- Desktop layout, all columns, and table behavior remain unchanged (columns reappear at the `sm` breakpoint and above)

Fixed

- Removed the remaining mobile `min-w-[420px]` constraint that was still forcing horizontal scrolling on narrow phone screens; desktop keeps its `sm:min-w-[760px]` minimum width
- Reduced horizontal cell padding on mobile for the Checkbox, Store, and Action columns; desktop padding is unchanged via `sm:px-4`
- Slightly narrowed the Action column on mobile to reclaim additional space; desktop width is unchanged via `sm:w-20`

### Phase 3A - Rating Display Cleanup

Changed

- Replaced read-only star icon ratings with compact text format (⭐ X/5) across reward cards, tables, admin table, reward detail page, dashboard stats, and the score filter
- Admin interactive rating selector (star click input) unchanged

### Phase 2B - Admin UX

Added

-

Changed

-

Removed

-

---

## v3.4

### Phase 4C v2 - Visual Refinement Pass

A refinement pass on top of Phase 4C, per direct design feedback. UI/markup and theme tokens only — no functional changes.

Changed

- Header: Chinese subtitle removed — the English "BIRTHDAY REWARDS" wordmark is now the only header title (uppercase, serif, larger, wider tracking), for a calmer single-element header
- Global typography: `letter-spacing: 0.075em` now applies to all normal interface text site-wide (store names, descriptions, notes, search/filter/sort UI, buttons, badges) via a `tracking-body` utility on `<body>`, so it's inherited everywhere instead of set per-component; the header wordmark keeps its own wider `tracking-wordmark` value
- Reward card: more internal breathing room — larger padding, more space around the divider, description now explicitly 14px/1.5 line-height, notes pushed further below the description (visibly more than one line-height) and rendered in a lighter tone, more space before the badge/rating row; card `min-height` increased to fit the extra spacing
- Grid: increased gap between cards (also increases row gap, since CSS grid `gap` applies to both axes)
- Search bar: placeholder text removed (icon-only), border radius now matches the filter bar exactly, background uses the new `searchBackground` token — search bar and filter bar now read as the same design component
- Badges: `BADGE_CLASSES` border/text now reference the centralized `badgeBorder` / `badgeText` tokens instead of one-off hex values, so every badge (category, expiry, tag) stays perfectly consistent
- Unified all "active/selected" UI accents (view toggle, filter's active-count badge, selected tag chip ring, used-status filter toggle, selected sort option) onto one neutral `accentSoft` token, replacing the previously mixed dark-ink and coffee-tinted active states
- Store name: serif, 20px, light weight, 1.3 line-height (via the `storeName` token)
- Card divider now uses the dedicated `divider` token (same value as the badge border) instead of the general-purpose border color
- Card shadow softened slightly for a cleaner look

Added

- `lib/theme.ts`: `colors.accentSoft`, `colors.badgeBorder`, `colors.badgeText`, `colors.divider`, `colors.searchBackground`; `typography.letterSpacing.body`; `typography.fontSize.storeName` — all wired into `tailwind.config.ts` and referenced by class name in components, no hardcoded hex added anywhere

### Phase 4C - Homepage Visual Refresh

Changed

- Header: compact two-line brand lockup — serif "Birthday Rewards" wordmark (light weight, generous letter-spacing) as the primary title, with a small muted "生日優惠整理" subtitle underneath
- Search bar: taller, more rounded, more padding, softer border for a cleaner look
- Filter bar: result count now shares the same bordered row as the "篩選" toggle instead of a separate line
- Sort menu / view toggle: view toggle's active state now uses a soft coffee tint instead of dark ink; spacing tidied
- Reward card: larger store name, thin divider under the title (softened border token), description directly below, notes shown only when present in a lighter tone than the description (no more reserved blank line), badge row + rating moved together to the bottom, Link/Favorite grouped as icon buttons with Used kept as a labeled pill (clearer at a glance) in the top-right corner

Added

- `lib/theme.ts`: additive `typography.fontFamily.serif` token (web-safe serif stack, not a Google Fonts import) for the header wordmark only; `typography.letterSpacing.wordmark` and `layout.cardMinHeight` tokens, wired into `tailwind.config.ts`, replacing what would otherwise have been arbitrary one-off values (`tracking-[0.12em]`, `min-h-[248px]`)

No changes to search/filter/sort logic, data fetching, or favorite/used toggle behavior — this phase is UI/markup only.

---

## v3.2

### Phase 2A - UI Cleanup

Removed

- Dark mode
- Store logo
- Click count
- Report feature
- Top clicked dashboard card

Changed

- Simplified sorting
- Cleaner reward detail page
- Cleaner admin table

---

## v3.1

### Phase 1

Added

- Local favorites
- Local used status

Removed

- Dark theme