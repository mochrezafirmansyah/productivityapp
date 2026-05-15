# Focus App — Design Handover

## What this is
A personal productivity PWA for **Eza** — a mobile-first task manager styled after Apple Wallet's stacked-card UI. It lives entirely in a single `Focus.html` file (no framework, no build step). The live version is at `mochrezafirmansyah.github.io/productivityapp`.

---

## Design language

### Typography
- **Font:** Newsreader (Google Fonts) — a contemporary editorial serif. Weights 300–700, italic variants used for labels and suffixes.
- **Display size:** 48px card numbers, 32px greeting headline, 28px pomodoro timer
- **Body:** 15px / line-height 1.5
- **Labels:** 11px, uppercase, letter-spacing .14–.18em
- **Letter-spacing:** tight on large text (−1.8px on 48px numbers, −0.8px on headline)

### Color tokens (light mode)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#f2f1f6` | App background (iOS system gray) |
| `--white` | `#ffffff` | Card / pill backgrounds |
| `--text` | `#1a1a1e` | Primary text, active buttons |
| `--text2` | `#6b6b72` | Secondary text |
| `--text3` | `#adadb5` | Tertiary / labels |
| `--border` | `rgba(0,0,0,0.07)` | Hairlines |
| `--shadow` | `0 2px 12px rgba(0,0,0,0.07)` | Card elevation |

### Color tokens (dark mode — `[data-theme="dark"]`)
| Token | Value |
|---|---|
| `--bg` | `#111113` |
| `--white` | `#1c1c1e` |
| `--text` | `#f2f1f6` |
| `--text2` | `#8e8e93` |
| `--text3` | `#48484a` |

### Border radius
- Cards: `20px` (`--r-card`)
- Pills / inputs: `14px` (`--r-pill`)
- Wallet cards: `24px`
- Nav buttons: `50%` (circle)

---

## Components

### 1. Status bar
Simulated iOS status bar — time (left) + wifi/battery icons (right). Updates every 30 s.

### 2. Top nav
- 32px greeting headline: "Good morning, Eza" (time-aware)
- Three 36px circle buttons: ⚙ Settings · ☾ Dark mode · **+** Add task (accent filled)

### 3. Wallet card stack (hero element)
Four gradient mesh cards stacked like Apple Wallet:
- **Collapsed:** front card fully visible, cards 2–4 peek below (8px each, scaleX shrinks to 0.835)
- **Expanded:** tap to fan all 4 cards at 185px intervals
- **Tap a card:** filters task list to that area and collapses

Card gradients (multi-point radial + linear):
| Card | Colors |
|---|---|
| All tasks | indigo → violet → pink (`#1e1b4b → #6d28d9 → #be185d`) |
| Today | amber (`#92400e → #d97706 → #fbbf24`) |
| nūsa | teal (`#064e3b → #0f766e → #0e7490`) |
| Consulting | purple-orange (`#581c87 → #9333ea → #c2410c`) |

Each card has: label (11px uppercase) + emoji (top row), big number + italic "tasks" superscript + subtitle (bottom row). Glossy highlight via `::after` radial gradient overlay.

### 4. Stats pills
Horizontal scrollable row of 4 pills: done · urgent · today · total. First pill (done) is accent-filled (dark bg).

### 5. Progress bar
- **8px tall**, `border-radius: 100px`
- Gradient fill: `#7c3aed → #a855f7 → #ec4899 → #f97316` (purple → violet → pink → orange)
- Glow: `box-shadow: 0 0 10px rgba(168,85,247,.4)`
- **Counts today's tasks only** (due === today). Shows "X% of today done" and "Y / Z today".

### 6. Pomodoro timer
Compact card: icon box (12px radius) + large time display + description + dot indicator + play/pause button.
- States: idle (⏱) / focus (🎯, red dot blinks) / break (☕, amber dot blinks)
- Cycle: 25m focus → 5m short break × 3 → 15m long break (fully configurable in Settings)

### 7. Area tabs
Horizontally scrollable pill tabs. Active tab: dark fill. Each tab shows active task count badge (e.g. "nūsa · 2").
Areas: All · Today · nūsa · Consulting · Personal · Someday · (+ any custom categories)

### 8. Task list
Each task card (20px radius, white bg, subtle shadow):
- **Left stripe:** 3px colored priority indicator (red P1 / amber P2 / violet P3 / gray P4)
- **Icon:** 40px × 40px rounded square with gradient background per area
- **Body:** task name (15px) + chip row (area name + due date badge)
- **Right:** priority badge (Px label)
- Due date chips: normal / today (red) / overdue (red bold)
- Done state: 42% opacity + strikethrough

**Section headers:** "To do X / Y" (active out of total) · "Completed [hide]"

**Completed section features:**
- hide / show toggle button
- Tasks grouped by month (e.g. "May 2026" sub-header) when multiple months exist

Sort order: priority → due date → no date last.

Animation: `fadeUp` (opacity 0→1, translateY 8px→0, staggered 40ms per card).

### 9. Bottom bar
Frosted glass (`backdrop-filter: blur(24px) saturate(1.8)`), `border-top: 0.5px`.
- Full-width text input: "Quick add a task…" — press Enter to add instantly
- **Text typed here carries over into the full Add Task modal** when + FAB is tapped
- 46px FAB button (14px radius, dark fill)

### 10. Add Task modal (bottom sheet)
Slides up from bottom. Fields: task name · area (select) · priority (select) · due date · notes.
Buttons: Cancel · "Add task ✦"

### 11. Task Action sheet
Tap any task card to open. Shows task icon/name/meta. Actions: Mark done ✓ (green gradient) / Mark to do ↩ (gray) / Delete task (white + red text) / Cancel.

### 12. Settings sheet (3 tabs)

**Categories tab:**
- List of existing areas with color swatch + emoji + name
- Built-in areas (nūsa, Consulting) are locked
- Delete button on custom areas
- Add form: emoji input + name input + color palette (10 preset colors)

**Timer tab:**
- 3 large number inputs in a grid: Focus / Short break / Long break (minutes)
- Label inputs: focus session name + break name
- Save resets the pomodoro display

**Calendar tab:**
- Google Calendar OAuth 2.0 integration
- Paste Client ID → Connect → OAuth popup → Sync tasks with due dates as all-day events
- Color coding: P1=red, P2=yellow, P3=blue
- Expandable setup instructions

---

## Interactions & motion

| Element | Animation |
|---|---|
| Wallet stack expand/collapse | `height` + card `transform` — `cubic-bezier(.34,1.2,.64,1)` 550ms (slight overshoot) |
| Sheet slide-up | `translateY(100% → 0)` — `cubic-bezier(.34,1.2,.64,1)` 320ms |
| Overlay fade | `opacity 0→1` — 220ms |
| Progress bar fill | `width` — `cubic-bezier(.34,1.2,.64,1)` 600ms |
| Button press | `scale(.88–.97)` — 120ms |
| Pomodoro dot | `blink` keyframe — opacity 1→0.25→1, 1.4s infinite |
| Task cards | `fadeUp` stagger — 40ms per card |

---

## Data model

```js
// Task
{ id, title, area, priority (1–4), due ('YYYY-MM-DD' or ''), done, notes }

// Category (custom)
{ id, name, emoji, color ('#hex'), builtin (bool) }

// Timer config
{ focusMins, shortMins, longMins, focusLabel, breakLabel }
```

Persisted to `localStorage` under keys: `eza_focus_v3` · `eza_cats_v1` · `eza_timer_v1` · `eza_gcal_v1`.

Seed tasks on first load: 9 tasks across nūsa / Consulting / Personal / Someday with realistic content for Eza's life (Gili Air boat ops, branding clients, travel).

---

## What to redesign / directions to explore

This is a working v1. When redesigning, keep all functionality intact but feel free to rethink:

- **Visual hierarchy** — the wallet card stack is the hero; everything below it competes. Could the stats pills and progress bar be more integrated?
- **Empty states** — only a basic "All clear" state exists; could be more expressive
- **Completed tasks** — currently identical to active tasks visually; could be more muted or collapsed by default
- **Progress bar** — currently thin and linear; could be a ring, arc, or more expressive shape
- **Pomodoro** — feels separate from tasks; could be more integrated (e.g. show which task you're focusing on)
- **Settings** — functional but plain; could match the card aesthetic
- **Dark mode** — works but hasn't been polished separately; cards look the same in both modes

The font (Newsreader) and the wallet-card gradient aesthetic are core to the identity — keep those.
