# Birthday Rewards Design Guide

Version 1.0

This document defines the visual language of the Birthday Rewards project.

Every future UI change should follow this guide before implementation.

---

# 1. Design Philosophy

Birthday Rewards is not designed to feel like a traditional coupon website.

Instead, it should feel like a carefully curated lifestyle product.

The experience should be:

- Elegant
- Calm
- Spacious
- Warm
- Editorial
- Premium
- Minimal

Prefer whitespace over decoration.

Reduce visual noise.

Every element should have room to breathe.

---

# 2. Core Design Principles

When making UI decisions:

✓ Typography is more important than decoration.

✓ Whitespace is more important than fitting more content.

✓ Consistency is more important than creativity.

✓ Simplicity is more important than adding features.

The interface should never feel crowded.

---

# 3. Typography

## Wordmark

BIRTHDAY REWARDS

Style:

- ALL CAPS
- Serif
- Elegant
- Wide letter spacing

This is the brand wordmark.

---

## Store Name

Style:

- Serif
- Elegant
- Premium
- Light weight

Preferred fonts:

- Apple LiSung Light
- Songti SC
- STSong
- Georgia

Typography:

font-size: 20px;

letter-spacing: 0.075em;

line-height: 1.3;

---

## Reward Description

font-size: 14px;

line-height: 1.5;

letter-spacing: 0.075em;

---

## Notes

Notes should always be visually quieter than the reward description.

Use:

- smaller emphasis
- lighter color

Never compete with the main content.

---

## General UI

Use:

letter-spacing: 0.075em;

across normal interface text whenever appropriate.

---

# 4. Color System

Never hardcode colors inside components.

Always reference theme tokens.

Required tokens include:

- primary
- accentSoft
- border
- divider
- background
- card
- title
- body
- caption
- badgeBorder
- badgeText
- searchBackground

Future color adjustments should only require editing theme.ts.

---

# 5. Card Design

Cards should feel light and breathable.

Structure:

Store Name

↓

Divider

↓

Reward Description

↓

Notes

↓

Badges

↓

Rating

Use generous spacing.

Never compress content vertically.

---

# 6. Badge Design

Every badge shares one design language.

No colorful badges.

Use one consistent style throughout the project.

Border:

theme.badgeBorder

Text:

theme.badgeText

---

# 7. Icons

Use Lucide icons consistently.

Avoid mixing:

- Emoji
- Different icon libraries

Icons should use the project's accent color.

---

# 8. Buttons

Search

Filter

Toggle

View Switch

Action Buttons

should all share:

- border radius
- height
- hover behavior
- transition

They should feel like one design system.

---

# 9. Search

Search and Filter belong to the same visual family.

They should share:

- border radius
- spacing
- visual weight

Search should remain simple.

Do not overdecorate it.

---

# 10. Layout & Spacing

Prefer generous whitespace.

Increase breathing room before reducing typography.

Recommended spacing scale:

4

8

12

16

24

32

40

48

Avoid arbitrary spacing values.

---

# 11. Shadows

Shadows should be extremely subtle.

Cards should rely primarily on:

- whitespace
- borders
- layout

instead of heavy shadows.

---

# 12. Dividers

Dividers should be soft.

They separate information without attracting attention.

---

# 13. Motion

Animations should feel calm.

Recommended:

200ms

Ease Out

Avoid flashy effects.

---

# 14. Things to Avoid

Avoid:

- Heavy shadows
- Gradient backgrounds
- Bright colors
- Thick borders
- Crowded layouts
- Oversized icons
- Inconsistent spacing
- Random font sizes
- Random border radius
- Hardcoded colors

---

# 15. AI Instructions

When implementing UI:

Never invent new colors.

Never hardcode spacing.

Always use theme tokens.

Follow the design system.

Prefer whitespace over decoration.

Maintain consistency.

Only redesign components when explicitly requested.

---

# 16. Visual Direction

The visual language should feel closer to:

- Apple
- MUJI
- Aesop
- Leica
- Notion (lighter version)

The goal is not to imitate them.

The goal is to achieve the same feeling:

- calm
- refined
- timeless
- comfortable

---

# 17. Final Principle

If a design decision is unclear:

Choose the solution that feels:

- simpler
- lighter
- quieter
- more spacious

instead of adding more visual elements.