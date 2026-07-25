# Notebook Portal Loader

## Vision

A cinematic loading experience that feels like entering an AI workspace
instead of waiting for a page to load.

**Tech Stack**

-   React
-   Next.js
-   Tailwind CSS
-   CSS Keyframes
-   Lucide React
-   No Framer Motion
-   No Three.js
-   No external animation libraries

------------------------------------------------------------------------

# Experience Timeline

## 0--0.5s

The screen fades into a dark background.

A soft aurora glow slowly appears behind the center.

A thin energy beam begins scanning across the top.

------------------------------------------------------------------------

## 0.5--1.5s

A notebook gently materializes.

It does **not** spin.

It floats up and down with a slow breathing motion.

Behind it is a blurred radial glow.

------------------------------------------------------------------------

## 1.5--3s

Tiny particles appear.

They orbit the notebook at different speeds.

Some drift upward.

Some fade away.

The scene should feel alive without becoming distracting.

------------------------------------------------------------------------

## Continuous Animations

### Floating Notebook

-   Moves vertically 8--12px
-   Slight rotation (±2°)
-   Duration: \~5s
-   Infinite ease-in-out

### Aurora Background

Three blurred gradient blobs move independently.

Each has:

-   Different duration
-   Different scale
-   Different opacity
-   Different direction

### Energy Beam

A glowing beam continuously scans from left to right across the top
edge.

### Particles

20--30 particles.

Each particle:

-   Random position
-   Random delay
-   Random duration
-   Small scale changes
-   Fade in/out

------------------------------------------------------------------------

# Notebook Animation

Every few seconds:

1.  Cover tilts slightly.
2.  A page flips.
3.  Tiny glowing words escape.
4.  Words dissolve into particles.
5.  Particles spiral upward.
6.  Notebook returns to idle.

------------------------------------------------------------------------

# Escaping Words

Examples:

-   React
-   AI
-   Memory
-   Vector
-   Search
-   Notebook
-   TypeScript
-   LangGraph
-   Knowledge
-   Thinking

Each word:

-   Appears above notebook
-   Moves upward
-   Rotates slightly
-   Fades into particles

------------------------------------------------------------------------

# Rotating Messages

Cycle every two seconds.

Preparing your workspace...

↓

Loading notebooks...

↓

Synchronizing memories...

↓

Building knowledge graph...

↓

Almost there...

Fade transitions only.

------------------------------------------------------------------------

# Mouse Parallax

Cursor movement shifts:

-   Notebook
-   Glow
-   Particles

Maximum movement:

-   X: ±8px
-   Y: ±8px

Very subtle.

------------------------------------------------------------------------

# Color Palette

~~Light Mode~~ (App is dark-mode only — see `layout.tsx`)

Dark Mode

-   Background: near black
-   Glow: indigo + cyan
-   Beam: electric blue
-   Particles: white/cyan

------------------------------------------------------------------------

# Exit Animation

When loading completes:

1.  Notebook glow intensifies.
2.  Particles accelerate.
3.  Notebook dissolves into particles.
4.  Aurora fades.
5.  App content fades in underneath.

Avoid abrupt cuts.

------------------------------------------------------------------------

# Component Structure

``` text
components/shared/
│
├── page-loader.tsx
├── notebook.tsx
├── particles.tsx
├── loading-text.tsx
├── aurora.tsx
├── beam.tsx
```

------------------------------------------------------------------------

# CSS Animations

Implement keyframes for:

-   float
-   orbit
-   pulseGlow
-   auroraMove
-   pageFlip
-   beam
-   particleRise
-   dissolve
-   fadeSwap
-   breathe

------------------------------------------------------------------------

# Performance

-   60 FPS target
-   GPU transforms only
-   transform + opacity animations
-   Avoid layout recalculations
-   Randomize particle delays once

------------------------------------------------------------------------

# Design Philosophy

The loader should never feel like a spinner.

It should feel like a calm, intelligent workspace waking up.

Users should remember the experience, not the wait.
