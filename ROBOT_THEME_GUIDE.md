# 🤖 Cyber Steel - Robotic Dark Mode Theme Guide

## Color Palette

### Backgrounds (Darkest to Lightest)
- `bg-robot-darker` - #0a0f1a - Deepest background (body)
- `bg-robot-dark` - #0f1419 - Main background
- `bg-robot-slate` - #1a1f2e - Card/Panel background
- `bg-robot-steel` - #242b3d - Elevated elements (hover states)

### Primary (Electric Cyan) - Robot Glow
- `text-primary-400` / `bg-primary-400` - #22d3ee - Bright electric cyan
- `text-primary-500` / `bg-primary-500` - #06b6d4 - Main cyan
- `text-primary-600` / `bg-primary-600` - #0891b2 - Deep cyan

### Accent (Vivid Teal) - UI Highlights
- `text-accent-400` / `bg-accent-400` - #22d8ee - Bright teal
- `text-accent-500` / `bg-accent-500` - #06b8d4 - Main teal
- `text-accent-600` / `bg-accent-600` - #0894b3 - Deep teal

### Success (Neon Green) - Power Indicators
- `text-success-400` / `bg-success-400` - #4ade80 - Neon green
- `text-success-500` / `bg-success-500` - #22c55e - Power green

### Text Colors
- `text-white` - Primary text
- `text-robot-chrome` - #8b949e - Metallic/muted text
- `text-gray-300` / `text-gray-400` - Secondary text
- `text-primary-400` - Cyan highlights

## Quick Replacement Guide

### Replace Old Colors with New Theme

**Backgrounds:**
```
bg-gray-900     →  bg-robot-dark
bg-gray-800     →  bg-robot-slate
bg-gray-700     →  bg-robot-steel
```

**Borders:**
```
border-gray-700 →  border-robot-steel
border-gray-600 →  border-primary-900/30
```

**Buttons & CTAs:**
```
bg-blue-600     →  bg-primary-500
hover:bg-blue-700 → hover:bg-primary-600
text-blue-400   →  text-primary-400
```

**Text:**
```
text-gray-400   →  text-robot-chrome
text-blue-400   →  text-primary-400
```

**Success States:**
```
bg-green-600    →  bg-success-500
text-green-400  →  text-success-400
```

## Special Effects

### Glow Effects (Add these classes)
- `glow-cyan` - Full cyan glow
- `glow-cyan-sm` - Subtle cyan glow
- `glow-green` - Green power indicator glow
- `border-glow` - Glowing border effect
- `animate-glow-pulse` - Pulsing glow animation
- `animate-text-glow` - Pulsing text glow

### Usage Examples

**Glowing Button:**
```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg glow-cyan-sm hover:glow-cyan transition-all">
  Activate
</button>
```

**Glowing Card:**
```tsx
<div className="bg-robot-slate border border-primary-500/30 rounded-lg p-6 glow-cyan-sm">
  Card content
</div>
```

**Pulsing Status Indicator:**
```tsx
<div className="w-3 h-3 bg-success-400 rounded-full animate-glow-pulse"></div>
```

**Hero Title with Glow:**
```tsx
<h1 className="text-6xl font-bold text-primary-400 animate-text-glow">
  DroidBRB
</h1>
```

## Component Patterns

### Cards
```tsx
<div className="bg-robot-slate border border-primary-900/30 rounded-lg p-6 hover:border-primary-500/50 transition-all">
  {/* content */}
</div>
```

### Input Fields
```tsx
<input className="bg-robot-steel border border-primary-900/30 text-white placeholder-robot-chrome px-4 py-3 rounded-lg focus:border-primary-500 focus:glow-cyan-sm transition-all" />
```

### Navigation
```tsx
<nav className="bg-robot-slate border-b border-primary-900/30">
  {/* nav items */}
</nav>
```

### Status Badges
```tsx
<span className="bg-success-500/20 text-success-400 px-3 py-1 rounded-full text-sm glow-green">
  Active
</span>
```

## Gradient Combinations

**Cyan Gradient (Headers):**
```
bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500
```

**Dark Gradient (Backgrounds):**
```
bg-gradient-to-b from-robot-dark to-robot-darker
```

**Power Glow Gradient:**
```
bg-gradient-to-r from-primary-500 to-success-500
```

## Typography

**Hero/Headers:**
- Use `text-primary-400` or gradient with `bg-clip-text text-transparent`
- Optional: Add `animate-text-glow` for emphasis

**Body Text:**
- Primary: `text-white`
- Secondary: `text-robot-chrome` or `text-gray-300`
- Muted: `text-gray-400`

**Links:**
- Default: `text-primary-400 hover:text-primary-300`
- Active: Add `glow-cyan-sm` on hover

## Scrollbar

The scrollbar now features a cyan gradient with glowing hover effect - automatically applied globally!

## Next Steps

1. Update HomePage hero section
2. Update all `bg-gray-900` to `bg-robot-dark`
3. Update all `bg-gray-800` to `bg-robot-slate`
4. Replace blue buttons with primary cyan
5. Add glow effects to CTAs and important elements
6. Add pulsing glows to status indicators
