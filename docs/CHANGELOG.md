# Changelog

## v3.3 (In Progress)

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