# Changelog

## v4.0 (In Progress)

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