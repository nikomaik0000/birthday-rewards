# Changelog

## v3.3 (In Progress)

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