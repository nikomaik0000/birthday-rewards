# Birthday Rewards AI Development Rules

## Project

Birthday Rewards

A production Next.js web application for managing birthday rewards.

Current Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

---

# Core Principle

This project is already in production.

Always prioritize:

1. Stability
2. Maintainability
3. Readability

Never prioritize speed over safety.

---

# Before Making Changes

Always:

- Read the current project first.
- Understand the existing architecture.
- Explain the implementation plan before editing.

Wait for approval before large changes.

---

# File Modification Rules

Never:

- Global Regex Replace
- Mass search & replace
- Rewrite unrelated components
- Rename files without approval

Only modify files directly related to the requested feature.

If more than **10 files** need modification,

STOP.

Explain why first.

---

# Commit Style

One task = One commit

Examples

✅ Theme System

✅ Remove Dark Mode

✅ Mobile Table UI

❌ Theme + Table + Search + Admin

---

# UI Principles

The website should feel:

- Clean
- Calm
- Premium
- Minimal
- Apple
- MUJI
- Not Material Design

Avoid:

- Bright colors
- Heavy gradients
- Oversized shadows
- Excessive animations

---

# Design Tokens

All design values must come from ONE place.

Never hardcode values.

Centralize:

- Colors
- Radius
- Shadows
- Typography
- Spacing
- Borders
- Animation Duration

Example

lib/theme.ts

or

lib/design-system.ts

---

# Colors

Use low saturation.

Soft warm gray.

Coffee tone.

No highly saturated colors.

Default background:

#F9F9F9

---

# Border Radius

Avoid overly rounded UI.

Preferred:

Cards

12px

Buttons

10px

Inputs

10px

Tags

8px

---

# Shadow

Very light.

Soft.

Never floating.

---

# Typography

Readable.

Simple.

Consistent.

Avoid too many font sizes.

---

# Responsive Design

Desktop first.

Then Mobile.

Both versions should feel native.

Mobile should never simply shrink Desktop UI.

---

# Mobile Rules

Prioritize:

Information density

Hide secondary information.

Never require horizontal scrolling.

---

# Component Rules

Prefer reusable components.

Avoid duplicated code.

Extract shared UI.

---

# Theme

Single Light Theme only.

Do NOT add Dark Mode.

Do NOT reintroduce next-themes.

---

# Local Storage

Visitor features

Store locally:

- Favorites
- Used Status

Administrator

Store in Supabase.

Never mix the two.

---

# Admin

Admin is the source of truth.

Visitors never modify database data.

---

# Performance

Avoid unnecessary re-rendering.

Lazy load where appropriate.

Keep bundle small.

---

# Accessibility

Buttons must have labels.

Keyboard accessible.

Visible focus state.

---

# Git Workflow

Feature

↓

Test

↓

Commit

↓

Push

↓

Vercel Deploy

Never skip testing.

---

# Before Finishing

Confirm:

✓ TypeScript builds

✓ No lint errors

✓ No console errors

✓ No broken imports

✓ No unused code

Then stop.

Wait for next task.