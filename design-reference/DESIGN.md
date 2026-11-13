---
name: Academic Video & Peer Tutoring Platform
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#464555'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system establishes a high-trust, scholarly environment animated by the energy of modern creator platforms. It serves university students, academic researchers, and peer educators who require both rigorous instructional clarity and engaging, media-first discovery.

The aesthetic fuses **Corporate/Modern** systematic rigor with **EdTech Vibrancy**:
- **Trust & Authority:** Structured layouts, strict typographic hierarchy, and deep academic tones project institutional reliability.
- **Engagement & Focus:** Vibrant accents and streamlined media presentation encourage deep study sessions and continuous peer interaction.
- **Clarity Under Density:** Interfaces balance complex academic metadata—course codes, accreditation tags, timestamps, pricing tiers—without visual clutter.

## Colors

The palette balances authoritative indigo with functional signaling hues to prioritize readability and rapid scanning:

- **Primary (`#4F46E5`):** Royal Indigo anchors core navigational landmarks, primary action states, interactive media controls, and active tab highlights.
- **Secondary (`#10B981`):** Energetic Emerald denotes verified academic credentials, peer tutor availability status, live session states, and positive learning milestones.
- **Tertiary (`#F59E0B`):** Warm Amber Gold highlights course pricing, session booking tiers, ratings, and academic honor badges.
- **Neutral (`#1E293B`):** Deep Academic Navy provides foundational contrast for body copy, surface outlines, and critical headings, replacing harsh pure blacks with scholarly depth.
- **Background & Canvas:** Crisp off-white surfaces (`#F8FAFC` to `#FFFFFF`) ensure prolonged reading comfort and maximum contrast for embedded PDF decks and video players.

## Typography

Typography balances geometric approachability with utilitarian legibility:

- **Headlines (Plus Jakarta Sans):** Brings contemporary warmth and clear structural hierarchy to lecture titles, tutor profiles, and section headers.
- **Body & Data (Inter):** Chosen for its exceptional legibility at small sizes, neutral character shapes, and extensive tabular features needed for course codes, timestamps, and study notes.
- **Course Level & Metadata Badges:** Use `label-md` and `label-sm` in all-caps or title case with slight positive tracking to ensure high legibility against varied card backgrounds.

## Layout & Spacing

The layout uses a 12-column responsive fluid grid designed to display media streams, booking columns, and synchronized transcript panels simultaneously:

- **Desktop (1024px+):** 12 columns with `1.5rem` gutters and `2rem` outer margins. Accommodates dual-pane views (video player on the left, interactive notes and tutor booking sidebar on the right).
- **Tablet (768px - 1023px):** 8 columns with `1.5rem` gutters and `1.5rem` margins. Sidebars collapse into tabbed sheets beneath the primary media surface.
- **Mobile (< 768px):** 4 columns with `1rem` gutters and `1rem` canvas margins. Video feeds collapse into a single-column stacked feed.
- **Rhythm:** Internal component spacing relies strictly on the 4px baseline scale (`0.25rem` increments) to maintain alignment across metadata tags and action rows.

## Elevation & Depth

Visual hierarchy uses crisp boundaries paired with subtle ambient diffusion:

- **Resting Layer (Flat/Bordered):** Cards, lesson lists, and sidebar modules sit at baseline elevation using a 1px structural outline (`rgba(30, 41, 59, 0.08)`) over pure white surfaces.
- **Interactive Hover Layer:** On hover, media cards and tutor cards lift with an ambient shadow: `box-shadow: 0 10px 25px -5px rgba(30, 41, 59, 0.08), 0 8px 10px -6px rgba(30, 41, 59, 0.04)`.
- **Floating Controls & Video Overlays:** Scrub bars, video duration chips, and live badges use subtle glassmorphic backdrop filters (`backdrop-filter: blur(8px)`) with semi-transparent dark navy fills (`rgba(30, 41, 59, 0.75)`) to remain readable over dynamic video frames.
- **Modals & Drawer Sheets:** Elevated above all content using `box-shadow: 0 25px 50px -12px rgba(30, 41, 59, 0.25)` alongside a darkened backdrop scrim (`rgba(15, 23, 42, 0.6)`).

## Shapes

The design system enforces a balanced roundedness tier (`roundedness: 2`):

- **Base Radius (`0.5rem` / 8px):** Applied to standard interactive items, input fields, course badges, metadata tags, and tertiary buttons.
- **Large Radius (`1rem` / 16px):** Applied to primary media cards, video thumbnail viewports, tutor booking modules, and dialog containers.
- **Extra Large Radius (`1.5rem` / 24px):** Used exclusively for floating promo banners, high-tier achievement cards, and bottom sheet drawers.
- **Pill Radius (`9999px`):** Reserved for live status indicators, audio player playback thumbs, and primary CTA pill buttons.

## Components

### Buttons
- **Primary:** Filled `#4F46E5` with pure white text, 8px border radius, medium font weight (`label-lg`). Smooth hover state shifting to a deeper indigo (`#4338CA`).
- **Secondary / Booking CTA:** Energetic Emerald (`#10B981`) background for instantaneous tutor booking or "Join Live Session" actions.
- **Tertiary / Ghost:** Borderless with deep navy text (`#1E293B`), acquiring a subtle tinted background (`rgba(79, 70, 229, 0.08)`) on interaction.

### Video Cards
- 16:9 aspect ratio thumbnail with a `1rem` corner radius.
- Embedded video duration badge docked at the bottom-right using translucent neutral backing (`rgba(30, 41, 59, 0.8)`) and high-contrast white text.
- Course subject badge pinned to the top-left, color-coded by academic discipline.
- Progress bar indicator seamlessly integrated at the bottom edge of the thumbnail using Primary Indigo.

### Course Badges & Chips
- Compact padding (`0.25rem` vertical, `0.5rem` horizontal) with 8px radius.
- Academic level badges (e.g., "100-Level", "Graduate", "AP/IB") utilize low-saturation tinted backgrounds with high-contrast text to avoid competing with video thumbnails.

### Peer Tutor Profile Cards
- Horizontal or vertical cards displaying tutor portrait, institutional affiliation, star rating in Amber Gold (`#F59E0B`), and hourly rate.
- Status pip (Secondary Emerald) showing real-time availability ("Available Now" vs. "Accepting Bookings").

### Form Fields & Inputs
- Height standardized to 44px for accessible desktop and mobile tapping targets.
- 1px neutral border (`rgba(30, 41, 59, 0.2)`) transitioning to a 2px Primary Indigo focus ring with zero ambient spread.
- Text labels pinned in `label-md` with strict contrast for dark study mode adjustments.

### Study Material Lists & Transcripts
- Row-based layout separated by subtle 1px dividing borders.
- Active timestamp sync highlighting the currently spoken lecture sentence with a gentle indigo background tint (`rgba(79, 70, 229, 0.06)`).