---
name: Kinetic Performance
colors:
  surface: '#faf9fa'
  surface-dim: '#dbdadb'
  surface-bright: '#faf9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#efedee'
  surface-container-high: '#e9e8e9'
  surface-container-highest: '#e3e2e3'
  on-surface: '#1b1c1d'
  on-surface-variant: '#5d3f3b'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f1'
  outline: '#926f69'
  outline-variant: '#e7bdb6'
  surface-tint: '#c00103'
  primary: '#970001'
  on-primary: '#ffffff'
  primary-container: '#c30505'
  on-primary-container: '#ffd1ca'
  inverse-primary: '#ffb4a8'
  secondary: '#005cba'
  on-secondary: '#ffffff'
  secondary-container: '#448ffd'
  on-secondary-container: '#002959'
  tertiary: '#8b2026'
  on-tertiary: '#ffffff'
  tertiary-container: '#ab383b'
  on-tertiary-container: '#ffd1cf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#930001'
  secondary-fixed: '#d7e3ff'
  secondary-fixed-dim: '#abc7ff'
  on-secondary-fixed: '#001b3f'
  on-secondary-fixed-variant: '#00458e'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b0'
  on-tertiary-fixed: '#410006'
  on-tertiary-fixed-variant: '#881d24'
  background: '#faf9fa'
  on-background: '#1b1c1d'
  surface-variant: '#e3e2e3'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system targets modern gym operators, personal trainers, and active members navigating workouts, schedules, and training routines. The design aesthetic is athletic, precise, and distinctly modern—blending high-end performance engineering with human-centric hospitality, reminiscent of contemporary fitness tech platforms like Technogym and Wellhub. 

The visual style pairs structured operational clarity with kinetic energy. Crisp, clean canvas backgrounds keep day-to-day training administration light and scannable, while a signature high-energy red provides decisive focal points for real-time tracking, primary metrics, and action commands. 

The interface avoids overly dense industrial paradigms in favor of spacious, card-based layouts, soft ambient separation, confident geometric typography, and tailored pill-shaped interaction elements. The emotional response is intentional: empowering, capable, premium, and rigorously organized.

## Colors

The palette is tuned specifically for light-mode performance environments where instructors, managers, and members require immediate visual parsing under diverse ambient lighting conditions.

- **Primary (`#C30505`)**: The core brand signature. Used for primary CTAs, active set highlights, timer starts, and critical progress trackers. State variations include `#E60000` (hover/interactive state) and `#960404` (pressed/active state).
- **Secondary (`#2F80ED`)**: Functional editing, member record management, schedule adjustments, and neutral administrative tasks that require clear distinction from physical execution commands.
- **Tertiary / Soft Brand (`#F46E6E`, `#FEECEB`)**: Accent tier dedicated to chip backgrounds, active workout tags, muscle group category flags, and soft highlight containers.
- **Neutrals**:
  - `Canvas Background`: `#F6F7F8` creates a warm, athletic base that prevents harsh screen glare during sustained indoor tablet/desktop sessions.
  - `Surface / Card Fill`: `#FFFFFF` for pristine content elevation.
  - `Text Primary`: `#1F2021` ensures WCAG AAA contrast compliance across all major labels and titles.
  - `Text Secondary / Metadata`: `#5C5F63` for set counts, secondary instructions, and timestamps.
  - `Borders & Separators`: `#E6E8EA` provides crisp structural delineation without visual noise.
- **System States**:
  - `Danger`: `#E74C3C` for cancellation, destructive delete, and safety warnings.
  - `Success`: `#27AE60` for completed sets, verified check-ins, and target achievements.

## Typography

The typographic strategy marries the bold, athletic posture of **Plus Jakarta Sans** with the dense, functional readability of **Inter**.

- **Plus Jakarta Sans** governs all headlines, numerical counters, set badges, and interactive labels. Its geometric baseline, tight apertures, and crisp vertical terminals project modern athleticism and urgency. Weights 600 and 700 are reserved for titles and actionable navigation.
- **Inter** handles high-density data environments: workout descriptions, exercise progression notes, set/rep tables, and administrative records. It maintains complete clarity even when displayed at sub-14px sizes on mobile devices during gym floor use.
- Tabular figures (`font-variant-numeric: tabular-nums`) must be enabled globally across all numeric metrics (stopwatches, heart-rate zones, kilograms, and rep counts) to prevent layout shifting during active session tracking.

## Layout & Spacing

Layouts follow an 8pt base grid with a responsive column strategy:
- **Mobile (< 768px)**: 4-column fluid layout with `margin-sm` (16px) and `gutter-sm` (16px). Bottom sheets, horizontal swipe carousels for routine lists, and sticky bottom utility bars anchor interaction.
- **Tablet / Gym Floor Mounts (768px - 1024px)**: 8-column fluid layout with `margin` (24px) and `gutter` (24px). Split-view layouts allow concurrent exercise queue viewing and set logging.
- **Desktop / Admin Hub (> 1024px)**: 12-column layout with a fixed max-width container of `1440px`, centered, using `margin-lg` (48px) and `gutter-lg` (32px). Multi-column operational dashboards display class rosters, performance analytics, and exercise library trees side by side.

Component padding relies strictly on internal scale tokens: cards use `space-lg` (24px) for desktop/tablet and `space-md` (16px) for compact mobile lists.

## Elevation & Depth

Visual hierarchy uses a refined ambient layering technique designed specifically for light surfaces without muddy drop shadows:

- **Level 0 (Floor)**: `#F6F7F8` app canvas background. Flat, zero shadow.
- **Level 1 (Card / Module)**: Pure white `#FFFFFF` surface bounded by a subtle `1px solid #E6E8EA` border. Paired with a soft ambient shadow: `0px 2px 8px -2px rgba(31, 32, 33, 0.04), 0px 4px 16px -4px rgba(31, 32, 33, 0.06)`. This creates crisp separation from the background without visually weighing down dense tables.
- **Level 2 (Hover / Active Workouts)**: Elevated card state triggered by mouseover or active workout sets. Shadow: `0px 8px 24px -4px rgba(31, 32, 33, 0.08), 0px 4px 12px -2px rgba(195, 5, 5, 0.06)`. The subtle crimson tint brings interactive focus.
- **Level 3 (Modals / Drawers / Quick-Logs)**: Floating sheets and dialogs. Shadow: `0px 16px 36px -6px rgba(31, 32, 33, 0.12), 0px 8px 16px -4px rgba(31, 32, 33, 0.08)`. Retains the `1px solid #E6E8EA` border to keep edge definition sharp against varying backdrop components.
- **Overlays**: Darkened scrim using `rgba(31, 32, 33, 0.4)` with an active backdrop blur of `4px` to focus attention on active modals and rest timers.

## Shapes

The design system employs a dual-radius strategy that balances structural stability with ergonomic touchability:

- **Structural Containers (`rounded-lg` / `rounded-xl`)**: Dashboards, workout modules, table cards, and media wrappers standardise on `12px` (`rounded-lg`) to `16px` (`rounded-xl`). This delivers a friendly, contemporary aesthetic while preserving perimeter space for dense workout data.
- **Interactive Units (Pill / Fully Rounded)**: Action buttons, exercise tag chips, set completion toggles, and status badges utilize a full pill geometry (`border-radius: 9999px` or minimum `24px`). This reinforces clickability and provides an unmistakable physical metaphor reminiscent of gym hardware and stopwatch toggles.
- **Inputs & Micro-Elements**: Form fields, quantity steppers, and set-rep rows use `8px` to maintain strict spatial alignment alongside tabular text figures.

## Components

### Buttons
- **Primary**: Solid background `#C30505`, text `#FFFFFF`, font `Plus Jakarta Sans 600`. Full pill radius (`9999px`), height `48px` (large) or `40px` (medium). Hover: `#E60000`. Active: `#960404`. Focus-visible ring: `3px solid rgba(195, 5, 5, 0.25)`.
- **Secondary (Outline)**: Background `transparent`, border `1.5px solid #C30505`, text `#C30505`. Hover: background `#FEECEB`. Active: background `#F46E6E` with text `#FFFFFF`.
- **Neutral / Administrative**: Solid background `#F6F7F8`, border `1px solid #E6E8EA`, text `#1F2021`. Hover: border `#2F80ED`, text `#2F80ED`, background `#FFFFFF`. Used for "Edit Routine", "Export Data", and "Reorder Sets".
- **Danger**: Solid background `#E74C3C`, text `#FFFFFF`. Hover: `#C0392B`.

### Chips & Muscle Group Badges
- **Active / Primary**: Background `#FEECEB`, text `#C30505`, border `1px solid rgba(195, 5, 5, 0.2)`. Font `Plus Jakarta Sans 600`, size `12px`.
- **Neutral Filter**: Background `#FFFFFF`, text `#5C5F63`, border `1px solid #E6E8EA`. Hover: text `#1F2021`, border `#5C5F63`.
- **Selected Filter**: Background `#1F2021`, text `#FFFFFF`, border `1px solid #1F2021`.

### Cards & Workout List Containers
- Constructed on `#FFFFFF` with a `1px solid #E6E8EA` border and `16px` border-radius (`rounded-xl`).
- Padding is standardized at `24px` (`space-lg`).
- Workout item cards include a left accent bar (`4px` width, `#C30505`) when the routine is currently "In Progress".

### Form Inputs & Exercise Steppers
- Input container height `44px`, background `#FFFFFF`, border `1.5px solid #E6E8EA`, corner radius `8px`.
- Typography: `Inter 14px`, text `#1F2021`, placeholder `#5C5F63`.
- Focus state: border `#C30505` accompanied by an ambient glow `0 0 0 3px rgba(195, 5, 5, 0.12)`.
- Numeric Weight/Reps Stepper: Integrated pill layout with inline `+` and `-` buttons in `#F6F7F8`, centered bold tabular values in `Plus Jakarta Sans`.

### Checkboxes & Set Completion Radios
- Checkbox: `20px x 20px`, border `1.5px solid #E6E8EA`, radius `6px`. Checked state: solid `#C30505` with a white checkmark icon.
- Set Completion Marker: Circular `32px` touch target with a centered radio badge. Uncompleted: `#F6F7F8` fill with `#E6E8EA` border. Completed: `#27AE60` fill with white check icon.

### Operational Data Tables
- Header: Background `#F6F7F8`, text `12px Plus Jakarta Sans 700`, uppercase, `#5C5F63`, border-bottom `1px solid #E6E8EA`.
- Row: Height `56px`, `#FFFFFF` background, border-bottom `1px solid #E6E8EA`. Hover state: `#F6F7F8`.
- Action Columns: Fixed right alignment with quick-action icon buttons (Edit in `#2F80ED`, Delete in `#E74C3C`).

### Specialized Fitness UI: Active Rest Timer
- Floating bottom pill container: `#1F2021` background, `#FFFFFF` text, radius `9999px`, elevation Level 3.
- Integrated linear progress ring or bar using `#C30505`. Tabular typography for `MM:SS` countdown in `Plus Jakarta Sans 700`.