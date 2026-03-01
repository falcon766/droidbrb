# DroidBRB Design System

Use this document as the single source of truth when building or updating any page on DroidBRB. Every page must follow these rules exactly.

---

## Color Palette

```
Black:      #111111   — primary text, dark section backgrounds
Dark:       #1A1A1A   — secondary dark backgrounds
Gray 900:   #222222
Gray 700:   #444444
Gray 500:   #777777   — body text on dark backgrounds, secondary text on light
Gray 400:   #999999   — labels, muted text, placeholders
Gray 300:   #BBBBBB   — inactive/disabled states
Gray 200:   #DDDDDD   — borders, dividers on light backgrounds
Gray 100:   #EEEEEE   — subtle borders, card borders, section dividers
Gray 50:    #F5F5F3   — alternate section backgrounds (light gray)
White:      #FAFAF8   — primary light background
Pure White: #FFFFFF   — cards, elevated surfaces

Blue:       #2563EB   — accent ONLY (buttons, "Available" tags, active step numbers, links)
Blue Hover: #1D4FD7   — blue button hover state
Blue Muted: rgba(37,99,235,0.08) — text selection highlight
```

### Color Usage Rules
- Blue is used SPARINGLY — only for: primary action buttons, "Available" status, active step indicators, and inline text links
- No other accent colors. Everything else is grayscale
- Dark sections use #111111 background with #FFFFFF text
- Light sections alternate between #FAFAF8 (white) and #F5F5F3 (gray-50)
- Section borders are 1px solid #EEEEEE
- Dividers within content are 1px solid #DDDDDD
- On dark backgrounds, dividers are 1px solid #444444

---

## Typography

### Font
**Satoshi** (from Fontshare) — geometric sans-serif, closest free match to Universal Sans Display

```html
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet">
```

Font stack: `'Satoshi', sans-serif`

### Weight Scale
- 400 — headlines, body text (the font reads clean/light at large sizes like Universal Sans)
- 500 — section labels, nav items, category names, step titles, button text
- 700 — logo wordmark, card titles, prices, bold emphasis

### Headline Sizes
```
Hero H1:        clamp(44px, 5.5vw, 72px)  weight 400  tracking -0.03em  line-height 1.08
Section H2:     clamp(30px, 3.5vw, 44px)  weight 400  tracking -0.025em line-height 1.15
Card title:     16-17px                    weight 700  tracking normal
Step title:     20px                       weight 500  tracking -0.01em
Category name:  18px                       weight 500  tracking -0.01em
```

### Body Text Sizes
```
Large body:     18px  weight 400  line-height 1.7   (hero subtitle)
Body:           16px  weight 400  line-height 1.75  (paragraphs)
Small body:     15px  weight 400  line-height 1.65  (accordion content)
Card detail:    14px  weight 400  line-height 1.55  (locations, descriptions)
Caption:        13px  weight 400  (stats labels, footer links)
Micro:          12px  weight 500  (status tags, review counts)
```

### Section Labels
```
Font size:      11px
Weight:         500
Letter spacing: 0.18em
Transform:      uppercase
Color:          #999999
Margin bottom:  24px
```

### Nav Items
```
Font size:      13px
Weight:         500
Letter spacing: 0.06em
Transform:      uppercase
```

---

## Spacing System

### Section Padding
- Standard section: `100px` top and bottom, `48px` left and right
- Search section: `80px` top, `100px` bottom
- Hero section: `140px` top, `80px` bottom
- Footer: `56px` top, `36px` bottom

### Content Max Widths
- Standard content: `1100px`
- Card grid (4-col): `1200px`
- CTA centered: `800px`
- Hero layout: `1200px`

### Element Spacing
- Label to heading: `24px`
- Heading to content: `40-48px`
- Between paragraphs: `20px`
- Card grid gap: `20px`
- Button group gap: `12-16px`
- Category pill gap: `8px`
- Footer column gap: `56px`

---

## Components

### Buttons (Pill style)
All buttons use `border-radius: 100px` (full pill shape).

**Primary (Blue Filled)**
```
Background:    #2563EB — #1D4FD7 on hover
Color:         #FFFFFF
Border:        1.5px solid (matches background)
Padding:       12px 28px
Font size:     14px
Font weight:   500
```

**Secondary (Outline, light bg)**
```
Background:    transparent — #F5F5F3 on hover
Color:         #444444
Border:        1.5px solid #DDDDDD
```

**Secondary (Outline, dark bg)**
```
Background:    transparent — rgba(255,255,255,0.06) on hover
Color:         #BBBBBB
Border:        1.5px solid rgba(255,255,255,0.2)
```

### Input Fields (Pill style)
```
Background:    transparent
Border:        1.5px solid #DDDDDD — #111111 on focus
Border radius: 100px
Padding:       14px 20px
Font size:     15px
Font weight:   400
Color:         #111111
Placeholder:   inherits (gray via browser default)
```

### Category Filter Pills
```
Padding:       7px 16px
Border radius: 100px
Border:        1px solid #DDDDDD — #111111 on hover
Font size:     13px
Font weight:   500
Color:         #777777 — #111111 on hover
Transition:    all 0.2s
```

### Cards (Robot Listings)
```
Image:         aspect-ratio 4/3, border-radius 6px, 1px solid #EEEEEE, overflow hidden
Image hover:   scale(1.04), transition 0.5s
Card hover:    translateY(-3px), transition 0.35s cubic-bezier(0.23,1,0.32,1)
Title:         16px weight 700
Price:         15px weight 700, unit suffix is 13px weight 400 color #999999
Category:      11px weight 500, letter-spacing 0.1em, uppercase, color #999999
Location:      14px weight 400, color #777777
Divider:       1px solid #EEEEEE, padding-top 8px
Status:        12px weight 500, color #2563EB ("Available")
```

**NO ratings, stars, or review counts on any cards or pages.**

### Accordion Steps (How It Works)
```
Top border:    1px solid #DDDDDD — #111111 when active
Number:        12px weight 500, color #BBBBBB — #2563EB when active
Title:         20px weight 500, color #999999 — #111111 when active
Body:          max-height animation 0.4s, opacity 0.3s
Body text:     15px weight 400, color #777777
```

### Category Grid
```
Layout:        3 columns, no gap (borders create separation)
Cell padding:  28px 24px
Borders:       1px solid #DDDDDD (top + right, no right on last column)
Hover:         background — #FFFFFF
Bottom border: Full-width 1px solid #DDDDDD closing the grid
```

---

## Layout Patterns

### Navigation (Fixed)
- Height: 64px
- Transparent on top, white (rgba 0.92) + blur(16px) + bottom border on scroll
- Logo left, nav items + Sign In button right
- Logo: RobotLogo SVG + "DROIDBRB" wordmark (14px, 700, 0.12em spacing, uppercase)

### Hero Section
- Black background, full viewport height
- Two-column grid: left = headline + copy + CTAs, right = floating preview card(s)
- Stats bar at bottom: 3 stats separated by thin vertical rules on gray-700

### Two-Column Content (Mission, How It Works)
- Grid: 1fr 1fr, gap 80px
- Left: heading, Right: body text + CTA

### Section Pattern (alternating)
```
Hero:           #111111 (black)
Search:         #FAFAF8 (white)
How It Works:   #F5F5F3 (gray-50) + top/bottom border
Featured:       #FAFAF8 (white)
Categories:     #F5F5F3 (gray-50) + top border
Mission:        #111111 (black)
CTA:            #FAFAF8 (white) + top border
Footer:         #F5F5F3 (gray-50) + top border
```

### Footer
- 4-column grid: brand (2.5fr) + 3 link columns (1fr each)
- Column headers: 11px, 500, 0.14em spacing, uppercase, #999999
- Links: 14px, 400, #777777 — #111111 on hover
- Bottom bar: copyright left, Privacy/Terms/Contact right, separated by top border

---

## Logo (RobotLogo SVG)

Geometric robot head: rounded-rectangle head, antenna with dot, two circular eyes, mouth line, ear sensor nodes.

```svg
<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
  <line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="12" cy="1" r="1" fill="currentColor"/>
  <rect x="4" y="5" width="16" height="13" rx="3" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="9" cy="12" r="2" fill="currentColor"/>
  <circle cx="15" cy="12" r="2" fill="currentColor"/>
  <line x1="9" y1="16" x2="15" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <rect x="1" y="9" width="3" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
  <rect x="20" y="9" width="3" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
</svg>
```

Wordmark: "DROIDBRB" — 14px, weight 700, letter-spacing 0.12em, uppercase, always paired with the SVG.

---

## Interaction & Motion

- Button hover: `transition: all 0.25s`
- Card hover lift: `transition: transform 0.35s cubic-bezier(0.23,1,0.32,1)`
- Card image zoom: `transition: transform 0.5s ease`
- Nav background: `transition: all 0.4s ease`
- Accordion open: `max-height 0.4s ease, opacity 0.3s`
- Link/text hover color: `transition: color 0.2s`
- Input focus border: `transition: border 0.3s`

---

## Things NOT in this design

- No ratings, stars, or reviews anywhere
- No shadows on cards (only on the hero floating preview card)
- No gradients (except the hero preview card box-shadow)
- No decorative elements (orbs, circles, geometric shapes)
- No serif fonts (Instrument Serif was removed)
- No emoji or icons beyond the logo SVG
- No colored backgrounds besides black and the two grays

---

## Prompt for Claude Code

When asking Claude Code to build new pages, paste the above system and add:

> Build the [PAGE NAME] page for DroidBRB following the design system in this document exactly. Use Satoshi font from Fontshare. Color palette is black/white/gray with #2563EB blue used only for primary buttons, "Available" tags, active indicators, and text links. No ratings anywhere. No decorative elements. Section backgrounds alternate between #FAFAF8 and #F5F5F3 with #111111 for dark sections. All buttons are pill-shaped (border-radius: 100px). Cards have no shadows. Typography is weight 400 for headlines, 500 for labels/nav, 700 for bold elements. Reference the homepage JSX file for exact component patterns.

Attach both this design system file AND the homepage JSX file to give Claude Code the full picture.
