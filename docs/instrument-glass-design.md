Rebuild this design in your project. Match it exactly: same layout,
typography, color, spacing, radius, shadow, and motion. Do not invent
new visuals.

## design.md

# Instrument Glass — Style Reference
> Dark interface — blue accents on a near-black ground.

**Theme:** dark

A dark system built on near-black surfaces (#0a0a0a) with near-white ink (#ffffff). The reference screen carries its primary actions in indigo (#7745f4); the brand primary token is #3d5afe. Type pairs Hanken Grotesk for display with Geist for body and UI.

**Ground truth (computed from tokens + reference HTML):** dark theme · page #0a0a0a · ink #ffffff · primary #3d5afe · secondary #7745f4 · applied action color #7745f4 · display "Hanken Grotesk" · body "Geist". Where the description above conflicts with these values or the Reference HTML, the tokens and HTML are authoritative.

## Tokens: Colors

| Name | Value | Token | Role | Usage | Contrast |
|------|-------|-------|------|-------|----------|
| Canvas | `#0a0a0a` | `--gesso-canvas` | Page background, the floor everything sits on. | Outermost background: body, full-bleed sections. Mirrors Neutral 50. | n/a |
| Surface recessed | `#080808` | `--gesso-surface-recessed` | Sunken surface below the canvas. | Inset wells: input fields, progress tracks, code blocks. | n/a |
| Surface | `#3f4d80` | `--gesso-surface` | Card and panel fill, raised above the canvas. | Cards, panels, sheets, table rows. Mirrors Neutral 100. | n/a |
| Surface elevated | `#4e5b8a` | `--gesso-surface-elevated` | Top elevation tier. | Modals, dropdowns, popovers, tooltips. | n/a |
| Divider | `rgba(255,255,255,0.04)` | `--gesso-divider` | Hairline borders and separators. | 1px rules between rows and sections. Never for text. | n/a |
| Foreground | `#ffffff` | `--gesso-fg` | Primary text and high-emphasis icons. | Body copy, headings, primary icons. Mirrors Neutral 900. | AA 4.5:1 on canvas (guaranteed) |
| Foreground muted | `#d6d6d7` | `--gesso-fg-muted` | Secondary text. | Captions, metadata, placeholders, disabled labels. Mirrors Neutral 600. | AA 3.0:1 on canvas (guaranteed) |
| Primary | `#3d5afe` | `--gesso-primary` | Brand accent, FILL only (alias: --gesso-accent). | CTA fills, active and selected states, focus rings. 2 to 3 per screen. Do NOT use as text, reach for --gesso-accent-text. | Pair with --gesso-on-accent for the label on top. |
| On primary | `#FFFFFF` | `--gesso-on-accent` | Text and icons on a filled primary. | Label color for buttons and chips filled with --gesso-primary. | Contrast-derived against --gesso-primary. |
| Accent (as text) | `#506bfe` | `--gesso-accent-text` | AA-safe accent for text and icons. | Use THIS for accent-colored links, headings, and icons. Use --gesso-primary for fills. | AA 4.5:1 on canvas (guaranteed). |
| Secondary | `#7745f4` | `--gesso-secondary` | Supporting brand accent. | Secondary fills, logo discs, supporting highlights. | Pair with on-fill text per --gesso-on-accent. |
| Secondary (as text) | `#8b61f6` | `--gesso-accent-2-text` | AA-safe secondary for text. | Secondary accent used as text or icons. | AA 4.5:1 on canvas (guaranteed). |
| Neutral 50 | `#0a0a0a` | `--gesso-neutral-50` | Page background. | Ramp access by step; prefer the role token above where one exists. | n/a |
| Neutral 100 | `#3f4d80` | `--gesso-neutral-100` | Surface. | Ramp access by step; prefer the role token above where one exists. | n/a |
| Neutral 200 | `#5d6792` | `--gesso-neutral-200` | Neutral ramp step. | Ramp access by step; prefer the role token above where one exists. | n/a |
| Neutral 300 | `#7b81a3` | `--gesso-neutral-300` | Neutral ramp step. | Ramp access by step; prefer the role token above where one exists. | n/a |
| Neutral 400 | `#999cb4` | `--gesso-neutral-400` | Neutral ramp step. | Ramp access by step; prefer the role token above where one exists. | n/a |
| Neutral 500 | `#b8b9c6` | `--gesso-neutral-500` | Neutral ramp step. | Ramp access by step; prefer the role token above where one exists. | n/a |
| Neutral 600 | `#d6d6d7` | `--gesso-neutral-600` | Muted text and dividers. | Ramp access by step; prefer the role token above where one exists. | AA 3.0:1 on canvas. |
| Neutral 700 | `#e4e3e4` | `--gesso-neutral-700` | Neutral ramp step. | Ramp access by step; prefer the role token above where one exists. | n/a |
| Neutral 800 | `#f2f1f1` | `--gesso-neutral-800` | Neutral ramp step. | Ramp access by step; prefer the role token above where one exists. | n/a |
| Neutral 900 | `#ffffff` | `--gesso-neutral-900` | Primary text. | Ramp access by step; prefer the role token above where one exists. | AA 4.5:1 on canvas. |
| Neutral 950 | `#ffffff` | `--gesso-neutral-950` | Neutral ramp step. | Ramp access by step; prefer the role token above where one exists. | n/a |
| Success | `#68c389` | `--gesso-success` | Positive signals (gains, completed states). | Meaning only, never decoration. | AA 3.0:1 on canvas, chroma-floored distinct. |
| Warning | `#e6a75d` | `--gesso-warning` | Caution states. | Meaning only, never decoration. | AA 3.0:1 on canvas, chroma-floored distinct. |
| Error | `#ef9d9d` | `--gesso-error` | Errors, destructive actions, negative signals. | Meaning only, never decoration. | AA 3.0:1 on canvas, chroma-floored distinct. |
| Data 1 | `#2733d9` | `--gesso-data-1` | Categorical data-viz series color. | Charts and series, applied in order. | n/a |
| Data 2 | `#3751f5` | `--gesso-data-2` | Categorical data-viz series color. | Charts and series, applied in order. | n/a |
| Data 3 | `#5174ff` | `--gesso-data-3` | Categorical data-viz series color. | Charts and series, applied in order. | n/a |
| Data 4 | `#7294ff` | `--gesso-data-4` | Categorical data-viz series color. | Charts and series, applied in order. | n/a |
| Data 5 | `#95b1ff` | `--gesso-data-5` | Categorical data-viz series color. | Charts and series, applied in order. | n/a |
| Data 6 | `#bacdff` | `--gesso-data-6` | Categorical data-viz series color. | Charts and series, applied in order. | n/a |

## Tokens: Typography

### Hanken Grotesk — Display. Headings, hero copy, large numerical specimens. · `--gesso-font-display`
- **Weights:** 300, 400, 600, 700
- **Line height:** 1.1
- **Letter spacing:** -0.02em
- **Role:** Display. Headings, hero copy, large numerical specimens.

### Geist — Body. Paragraphs, labels, UI chrome. · `--gesso-font-body`
- **Weights:** 300, 400, 600, 700
- **Line height:** 1.5
- **Letter spacing:** 0em
- **Role:** Body. Paragraphs, labels, UI chrome.

### Geist — Mono. Code, numerical tickers, mono-spaced metadata. · `--gesso-font-mono`
- **Weights:** 300, 400, 600, 700
- **Line height:** 1.4
- **Letter spacing:** 0em
- **Role:** Mono. Code, numerical tickers, mono-spaced metadata.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| H1 | 36px | 1.2 | — | `--gesso-text-4xl` |
| H2 | 30px | 1.2 | — | `--gesso-text-3xl` |
| H3 | 24px | 1.2 | — | `--gesso-text-2xl` |
| Body | 16px | 1.5 | — | `--gesso-text-base` |
| Caption | 12px | 1.5 | — | `--gesso-text-xs` |

## Tokens: Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| space-1 | 4px | `--gesso-space-1` |
| space-2 | 8px | `--gesso-space-2` |
| space-3 | 12px | `--gesso-space-3` |
| space-4 | 16px | `--gesso-space-4` |
| space-6 | 24px | `--gesso-space-6` |
| space-8 | 32px | `--gesso-space-8` |
| space-12 | 48px | `--gesso-space-12` |
| space-16 | 64px | `--gesso-space-16` |
| space-24 | 96px | `--gesso-space-24` |
| space-32 | 128px | `--gesso-space-32` |

### Border Radius

| Element | Value |
|---------|-------|
| none | 0px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| full | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `none` | `--gesso-shadow-sm` |
| md | `none` | `--gesso-shadow-md` |
| lg | `0 1px 2px rgba(0,0,0,0.04)` | `--gesso-shadow-lg` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Container max-width:** 1280px
- **Grid columns:** 12
- **Grid gutter:** 24px
- **Outer margin:** 64px
- **Section padding:** 80px

## Breakpoints

| Name | Min Width |
|------|-----------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |

## Components

### Container
**Role:** Page-level width constraint and 12-column grid wrapper.

Max-width var(--container-max-width) (1280px), centered via margin-inline auto, horizontal padding var(--outer-margin) (64px; drop to 24-32px below the md breakpoint). Vertical rhythm var(--section-padding) (80px) per band. Multi-column regions use display:grid with grid-template-columns: repeat(var(--grid-columns), 1fr) (12) and gap var(--grid-gutter) (24px); children span column ranges (span 6 = half, span 4 = third).

### Navigation Bar
**Role:** Top-anchored primary navigation. One per page.

Full-bleed bar, height 64-72px, inner contents constrained to var(--container-max-width) with var(--outer-margin) inline padding. Logo left, primary links centered or left-grouped, one primary CTA right. Links in --gesso-font-body weight 400, color --gesso-neutral-700 (#B0BED8); hover/active resolve to --gesso-neutral-900 (#ffffff). CTA is the Primary Button. Transparent over a hero, then sticky with a --gesso-neutral-50 (#0a0a0a) fill and 1px --gesso-neutral-200 bottom border once scrolled. z-index 100.

### Hero Section
**Role:** Above-the-fold headline band. Sets the first impression.

Fills the upper 55-70% of the viewport with var(--section-padding) vertical breathing room, constrained to the Container. Headline in --gesso-font-display (Hanken Grotesk) at 2.25rem, weight 600, line-height 1.05-1.1, never italic. Subcopy in body font at --gesso-text-lg, color --gesso-neutral-600 (#8a8a8e), max-width ~60ch. Primary + Secondary Button pair beneath. Left-aligned for a marketing scroll, centered for a landing hero.

### Card
**Role:** Container surface for content groupings.

Background --gesso-neutral-50 (#0a0a0a), border 1px solid --gesso-neutral-200 (#1C2438), border-radius var(--gesso-radius-md) (16px), padding 24px, --gesso-shadow-sm. Body font for content; display font for any embedded headline. Text fg --gesso-neutral-900 (#ffffff). In a grid, cards span 3-6 of the 12 columns.

### Primary Button
**Role:** Highest-emphasis action. Reserved for the main CTA per section.

Background --gesso-primary (#3d5afe), text auto-picked for max contrast (white or near-black), padding 12px 24px, border-radius var(--gesso-radius-md) (16px), font-family --gesso-font-body, font-weight 600. Hover: mix toward --gesso-fg by 10-12%. Use 1-2 per section, never more. The reference screen applies #7745f4 as its dominant on-screen action color; follow the Reference HTML for color application.

### Secondary Button
**Role:** Supporting action next to a primary CTA.

Background transparent, border 1.5px solid --gesso-primary (#3d5afe), text --gesso-primary, padding 12px 24px (minus 1.5px each axis to compensate for the border), border-radius var(--gesso-radius-md) (16px), body font, weight 600.

### Input
**Role:** Single-line text entry. Default form field.

Background --gesso-neutral-100 (#3f4d80), border 1px solid --gesso-neutral-300 (#2A3550), border-radius var(--gesso-radius-md) (16px), padding 12px 16px, body font. Focus: border --gesso-primary, ring 3px --gesso-primary at 14% alpha.

### Footer
**Role:** Page-closing navigation and legal. One per page.

Full-bleed block with a top 1px --gesso-neutral-200 (#1C2438) divider, var(--section-padding) vertical padding, contents constrained to var(--container-max-width). Multi-column link groups (grid, 2-4 columns): group headings at body weight 600, links --gesso-neutral-600 (#8a8a8e) resolving to --gesso-neutral-900 on hover. Logo and copyright row pinned along the bottom.

### Badge
**Role:** Compact label for status, tags, counts.

Background --gesso-primary (#3d5afe) at 12% alpha, text --gesso-primary, padding 8px 12px, border-radius var(--gesso-radius-full) (9999px), font-size 12px, body font, weight 600, uppercase, letter-spacing 0.04em.

## Do's and Don'ts

### Do

- Two families max: a clean grotesque/sans for display + body (weights 400 body, 600-700 display, large display tracks tight at -0.02em), plus a monospaced/LCD bitmap numeric face reserved EXCLUSIVELY for stat values and metrics. Labels are small, muted, sentence/Title case, never bold. Big numbers carry the hierarchy; prose stays calm.
- Tone-locked dark. canvas = near-black #0E1014 to #141619; surface/tile = #1A1D21 to #22262B (one lightness step up, no border); ink = #F2F4F6 (primary), muted-ink = rgba(255,255,255,0.45) for labels, fainter rgba(255,255,255,0.25) for units/secondary. Accent is OPTIONAL and singular, at most one desaturated tone (e.g. muted green #4A7C59 / desaturated blue) confined to <=5% area (a single CTA fill, one link, one chart segment). Default to zero chromatic accent and let type contrast do the work.
- Both web (1280 multi-column). Strict 8px rhythm. Mobile: rounded bottom-sheet over content, segmented control top, then a 2-col stat-tile grid, then a full-width chart tile. Web: left rail nav + center list + right content column, sticky top chrome. Whitespace is structural and abundant, tiles breathe, no crowding. Left-aligned everything.
- Apply --gesso-primary (#3d5afe) to a maximum of 2-3 elements per screen: a button, a highlight, a badge. Never paint large areas with primary.
- Use --gesso-radius-md (16px) for cards and inputs, --gesso-radius-full for badges and avatars. Inner radii inside a parent: subtract the parent's padding from its radius.
- Build hierarchy with the neutral scale, not extra hues. 90%+ of any screen should be neutrals; chromatic colors carry meaning, never decoration.

### Don't

- No drop shadows or glows on tiles, separate surfaces by lightness step only
- No saturated or multi-hue accents; never more than one desaturated accent and never above ~5% of screen area
- No color-to-color gradients, no purple/blue 'AI' gradient washes
- No bordered cards everywhere, default to borderless tiles, hairlines only when structurally required
- Don't use Inter as the display font. It's the most overused font in tech. Pick something with character from the fontHints display list.
- Don't use #3B82F6 / indigo-600 as primary unless explicitly briefed. Default blue is the hallmark of a generic SaaS aesthetic.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page | `#0a0a0a` | Default page background. The lightest surface. |
| 1 | Raised | `#3f4d80` | Cards, panels, sidebars: anything that sits on top of the page. |
| 2 | Sunken | `#1C2438` | Inset surfaces (search bars, code blocks, disabled fields). |
| 3 | Overlay | `#0a0a0a` | Modals and floating panels. Same hue as page; depth comes from --gesso-shadow-lg. |

## Agent Prompt Guide

**Quick Color Reference**

- Primary: #3d5afe
- Secondary: #7745f4
- Page bg: #0a0a0a
- Body fg: #ffffff
- Muted fg: #d6d6d7
- Success: #68c389

**Example Component Prompts**

1. Build a content container. max-width var(--container-max-width) (1280px), margin-inline auto, padding-inline var(--outer-margin) (64px, 24px below md). Wrap every section in it so the page shares one measure.

2. Build a responsive top navigation bar. Full-bleed, height 64-72px, inner row capped at var(--container-max-width) with var(--outer-margin) inline padding. Logo left, links centered (color #B0BED8, hover #ffffff), primary CTA right (bg #3d5afe, weight 600). Transparent over the hero, sticky #0a0a0a fill + 1px #1C2438 border on scroll. Collapse links to a menu button below 768px.

3. Build a hero band. Constrain to var(--container-max-width) with var(--section-padding) vertical padding. Headline display font (Hanken Grotesk) at 2.25rem weight 700, never italic; subcopy body font (Geist) max-width 60ch color #8a8a8e; primary + secondary CTA row beneath.

4. Build a 12-column responsive grid section. display:grid; grid-template-columns: repeat(12, 1fr); gap var(--grid-gutter) (24px); inside var(--container-max-width) + var(--outer-margin). Cards span 4 columns (3-up) on desktop, span 6 (2-up) at md, span 12 below sm.

5. Build a footer. Full-bleed with a top 1px #1C2438 divider, var(--section-padding) vertical padding, contents at var(--container-max-width). 3-4 link-group columns (headings weight 600, links #8a8a8e), logo + copyright row pinned along the bottom.

## Similar Brands

- **Linear** — Modern SaaS reference: restrained palette, gridded layout.
- **Stripe** — Clean, confident system with strong type hierarchy.
- **Vercel** — Black-and-white discipline with a single high-impact accent.

## Screens

### 1. Instrument Glass

- Role: screen

<details><summary>HTML</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<style id="gesso-foundation">*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}html,body{width: 100%;min-height: 100vh;overflow-x:clip;max-width:100%;}body{font-family:var(--gesso-font-body,system-ui),sans-serif;color:var(--gesso-fg,#0a0a0a);background:var(--gesso-canvas,#ffffff);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;line-height:1.4;}img,svg{display:block;max-width:100%;}button{font:inherit;color:inherit;background:none;border:none;cursor:pointer;}a{color:inherit;text-decoration:none;}</style>
<style id="gesso-text-wrap">h1,h2,h3{text-wrap:balance}p,li,figcaption,blockquote{text-wrap:pretty}</style>
<style id="gesso-font-smoothing">html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}</style>
<style id="gesso-image-outline">img:not([data-illustration]):not([data-icon]):not([aria-hidden="true"]){outline:1px solid rgba(255,255,255,0.05);outline-offset:-1px}</style>
<style>/* gesso-icon-base v1 */
.ic { display: inline-block; width: 16px; height: 16px; vertical-align: -0.125em; flex-shrink: 0; line-height: 0; }
.ic svg { width: 100%; height: 100%; display: block; }
svg.ic { width: 16px; height: 16px; display: inline-block; vertical-align: -0.125em; flex-shrink: 0; }
.ic[data-icon-style="line"] { stroke-width: var(--ic-stroke, 2); }
.ic[data-icon-style="line"] svg path, .ic[data-icon-style="line"] svg circle, .ic[data-icon-style="line"] svg rect, .ic[data-icon-style="line"] svg line, .ic[data-icon-style="line"] svg polyline, .ic[data-icon-style="line"] svg polygon { stroke-width: inherit; }
.ic-sm { --ic-stroke: 2.25; }
.ic-xs { --ic-stroke: 2.5; }
svg.ic-lg, .ic-lg svg { width: 24px; height: 24px; }
svg.ic-xl, .ic-xl svg { width: 32px; height: 32px; }
svg.ic-2xl, .ic-2xl svg { width: 32px; height: 32px; }
.ic-lg { --ic-stroke: 1.75; }
.ic-xl { --ic-stroke: 1.5; }
.ic-2xl { --ic-stroke: 1.5; }
button { border: 0; background: transparent; padding: 0; font: inherit; color: inherit; cursor: pointer; -webkit-appearance: none; appearance: none; }
</style>

<style id="gesso-responsive-shell">html,body{width:100%!important;max-width:100%!important;min-width:0;overflow-x:hidden}@media (max-width:1279.98px){*{min-width:0}h1,h2,h3,h4,h5,h6,p,td,th{min-width:min-content}}@media (min-width:1280px){*{min-width:auto}:where(nav,header){column-gap:24px}:where(nav a,header a){white-space:nowrap}}img,svg,video,canvas,iframe,table{max-width:100%}</style><style id="gesso-mobile-web-layer">.gesso-nav-check,.gesso-nav-burger{display:none}@media (max-width: 1024px){.inspector{display:none!important}}@media (max-width: 640px){.rail{display:none!important}}@media (max-width: 480px){nav,nav ul,header ul{flex-wrap:wrap}nav a,header ul a{display:inline-block}table{display:block;overflow-x:auto;min-width:0!important;max-width:100%}[data-gesso-flexwrap]{flex-wrap:wrap}h1,h2,h3{overflow-wrap:break-word}[data-gesso-pinned-height]{height:auto!important;min-height:0!important}.gesso-nav-check{display:block;position:absolute;width:1px;height:1px;margin:0;opacity:0;pointer-events:none}.gesso-nav-check:focus-visible+.gesso-nav-burger{outline:2px solid currentColor;outline-offset:2px}.gesso-nav-burger{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;cursor:pointer;flex-shrink:0;border-radius:8px}.gesso-nav-burger span{display:block;position:relative;width:18px;height:2px;border-radius:1px;background:currentColor}.gesso-nav-burger span::before,.gesso-nav-burger span::after{content:"";position:absolute;left:0;width:18px;height:2px;border-radius:1px;background:currentColor;transition:transform 150ms ease}.gesso-nav-burger span::before{top:-6px}.gesso-nav-burger span::after{top:6px}.gesso-nav-check:checked~.gesso-nav-burger span{background:transparent}.gesso-nav-check:checked~.gesso-nav-burger span::before{transform:translateY(6px) rotate(45deg)}.gesso-nav-check:checked~.gesso-nav-burger span::after{transform:translateY(-6px) rotate(-45deg)}[data-gesso-navlinks]{display:none!important}.gesso-nav-check:checked~[data-gesso-navlinks]{display:flex!important;flex-direction:column;align-items:stretch;flex-basis:100%;min-width:100%;order:99}.shell{width:100%!important;max-width:100%!important}.brand{flex-wrap:wrap}.brand-mark{flex-wrap:wrap}.navitem{flex-wrap:wrap}.topactions{flex-wrap:wrap}.icon-btn{flex-wrap:wrap}.avatar{flex-wrap:wrap}.btn{flex-wrap:wrap}.status-label{flex-wrap:wrap}.appgrid{grid-template-columns:1fr!important}.appgrid>*{grid-column:1/-1!important;grid-row:auto!important}.rail-item{flex-wrap:wrap}.chip{flex-wrap:wrap}.splitpane{grid-template-columns:1fr!important}.splitpane>*{grid-column:1/-1!important;grid-row:auto!important}.pane-label{flex-wrap:wrap}.kp-panel-head{flex-wrap:wrap}.kp-row{flex-wrap:wrap}.insp-row{flex-wrap:wrap}.insp-row-label{flex-wrap:wrap}.rmse-bars{flex-wrap:wrap}}@media (prefers-reduced-motion: reduce){.gesso-nav-burger span::before,.gesso-nav-burger span::after{transition:none}}</style><!--gesso-fonts:start--><style>@font-face{font-family:"Hanken Grotesk";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/HankenGrotesk-Variable.woff2) format("woff2");}@font-face{font-family:"Geist";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/Geist-Variable.woff2) format("woff2");}</style><style id="gesso-font-lock">:root{--gesso-font-display:"Hanken Grotesk", system-ui, -apple-system, sans-serif !important;--gesso-font-body:"Geist", system-ui, -apple-system, sans-serif !important;--gesso-font-mono:"Geist", ui-monospace, "JetBrains Mono", monospace !important;}</style><!--gesso-fonts:end-->
</head>
<body>
<meta name="x-visual-moves" content="Channeled the true-black canvas with navy/charcoal tile fills (no borders, no shadows) directly onto the split-panel inspector work surface. Took Memotron's side-by-side comparison scan path fused with Calendly's compact stat-row-above-chart hierarchy for the header band. Rendered outlier keypoints as bare capsule-style confidence bars in electric blue, reserving the accent strictly for numerals and match-quality marks per the anti-pattern list.">
<style>
:root{
  --gesso-canvas:#0A0A0A;
  --gesso-surface:#3f4d80;
  --gesso-surface-elevated:#4b5888;
  --gesso-surface-recessed:#0a0a0a;
  --gesso-fg:#FFFFFF;
  --gesso-fg-muted:#8A8A8E;
  --gesso-divider:rgba(255,255,255,0.04);
  --gesso-accent:#3D5AFE;
  --gesso-accent-2:#7745f4;
  --gesso-on-accent:#FFFFFF;
  --gesso-data-1:#2733d9; --gesso-data-2:#3751f5; --gesso-data-3:#5174ff;
  --gesso-data-4:#7294ff; --gesso-data-5:#95b1ff; --gesso-data-6:#bacdff;
  --gesso-success:#3D5AFE; --gesso-warning:#7745f4; --gesso-error:#ff5c6c;
  --gesso-primary:var(--gesso-accent); --gesso-secondary:var(--gesso-accent-2);
  --gesso-neutral-50:var(--gesso-canvas); --gesso-neutral-900:var(--gesso-fg);
  --gesso-radius-sm:8px; --gesso-radius-md:16px; --gesso-radius-lg:24px; --gesso-radius-full:9999px;
  --gesso-shadow-sm:none; --gesso-shadow-md:none; --gesso-shadow-lg:0 1px 2px rgba(0,0,0,0.04);
  --gesso-duration-fast:150ms; --gesso-easing-default:cubic-bezier(0.4,0,0.2,1);
  --gesso-font-display:"Hanken Grotesk", system-ui, -apple-system, sans-serif;
  --gesso-font-body:"Geist", system-ui, -apple-system, sans-serif;
  --gesso-charcoal:#1c1c1e;
}
html,body{width:100%;min-height:100%;overflow-x:hidden;}
*{min-width:0;}
body{
  background:var(--gesso-canvas); color:var(--gesso-fg);
  font-family:var(--gesso-font-body);
  padding-left:clamp(20px,4vw,48px); padding-right:clamp(20px,4vw,48px);
  padding-top:0; padding-bottom:24px;
}
img,video{max-width:100%;display:block;}
h1,h2,h3{font-family:var(--gesso-font-display); font-weight:700; margin:0; text-wrap:balance; overflow-wrap:break-word;}
p,span,div{overflow-wrap:break-word;}
.shell{display:flex; flex-direction:column; gap:0; max-width:1280px; margin-inline:auto;}

/* topbar */
.topbar{
  display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
  padding:20px 0; position:sticky; top:0; z-index:20;
  background:var(--gesso-canvas);
}
.brand{display:flex; align-items:center; gap:12px;}
.brand-mark{
  width:36px; height:36px; border-radius:var(--gesso-radius-full);
  background:var(--gesso-charcoal); display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.brand-mark svg{color:var(--gesso-accent);}
.brand-text{display:flex; flex-direction:column;}
.brand-title{font-family:var(--gesso-font-display); font-weight:700; font-size:16px; color:var(--gesso-fg); line-height:20px;}
.brand-tag{font-size:11px; color:var(--gesso-fg-muted); line-height:14px;}
.topnav{display:flex; align-items:center; gap:8px; flex-wrap:wrap;}
.navitem{
  display:inline-flex; align-items:center; gap:8px; padding:8px 16px; border-radius:var(--gesso-radius-full);
  background:transparent; color:var(--gesso-fg-muted); font-size:13px; font-weight:600; cursor:pointer;
  transition:background var(--gesso-duration-fast) var(--gesso-easing-default), color var(--gesso-duration-fast) var(--gesso-easing-default);
}
.navitem:hover{ background:rgba(255,255,255,0.05); color:var(--gesso-fg); }
.navitem:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }
.navitem[aria-current="page"]{ background:var(--gesso-charcoal); color:var(--gesso-fg); }
.topactions{display:flex; align-items:center; gap:12px;}
.icon-btn{
  width:36px; height:36px; border-radius:var(--gesso-radius-full); background:var(--gesso-charcoal);
  color:var(--gesso-fg-muted); display:flex; align-items:center; justify-content:center; cursor:pointer;
  transition:background var(--gesso-duration-fast) var(--gesso-easing-default), color var(--gesso-duration-fast) var(--gesso-easing-default);
}
.icon-btn:hover{ background:rgba(255,255,255,0.08); color:var(--gesso-fg); }
.icon-btn:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }
.avatar{
  width:36px; height:36px; border-radius:var(--gesso-radius-full); background:var(--gesso-accent);
  color:var(--gesso-on-accent); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;
}

/* header band */
.header{ display:flex; flex-direction:column; gap:16px; padding:20px 0 16px; }
.header-top{ display:flex; align-items:flex-start; justify-content:space-between; gap:24px; flex-wrap:wrap; }
.header-title{ font-size:clamp(22px,2.2vw,28px); line-height:32px; color:var(--gesso-fg); }
.header-sub{ font-size:13px; color:var(--gesso-fg-muted); margin-top:4px; }
.header-actions{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.btn{
  display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:var(--gesso-radius-full);
  font-size:13px; font-weight:700; cursor:pointer; white-space:nowrap;
  transition:background var(--gesso-duration-fast) var(--gesso-easing-default), transform 80ms var(--gesso-easing-default), filter var(--gesso-duration-fast) var(--gesso-easing-default);
}
.btn-primary{ background:var(--gesso-accent); color:var(--gesso-on-accent); }
.btn-primary:hover{ filter:brightness(1.08); }
.btn-primary:active{ transform:translateY(1px) scale(0.98); }
.btn-primary:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }
.btn-ghost{ background:var(--gesso-charcoal); color:var(--gesso-fg); }
.btn-ghost:hover{ background:rgba(255,255,255,0.08); }
.btn-ghost:active{ transform:translateY(1px) scale(0.98); }
.btn-ghost:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }

/* status row */
.status{ display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:24px; padding:4px 0 20px; max-height:96px; }
.status-item{ display:flex; flex-direction:column; gap:2px; }
.status-label{ display:flex; align-items:center; gap:8px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--gesso-fg-muted); }
.status-label svg{ width:14px; height:14px; flex-shrink:0; color:var(--gesso-fg-muted); }
.status-value{ font-family:var(--gesso-font-display); font-size:28px; font-weight:800; color:var(--gesso-accent); line-height:32px; }
.status-value.plain{ color:var(--gesso-fg); }

/* main grid: rail / work-surface / inspector */
.appgrid{ display:grid; grid-template-columns:220px minmax(0,1fr) 320px; gap:24px; align-items:start; }
@media (max-width:1024px){ .appgrid{ grid-template-columns:72px minmax(0,1fr); } .inspector{ display:none; } }
@media (max-width:640px){ .appgrid{ grid-template-columns:1fr; } .rail{ display:none; } }

.rail{
  display:flex; flex-direction:column; gap:4px; position:sticky; top:96px;
}
.rail-section{ font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--gesso-fg-muted); padding:12px 12px 8px; }
.rail-item{
  display:flex; align-items:center; gap:12px; padding:12px 12px; border-radius:var(--gesso-radius-md);
  color:var(--gesso-fg-muted); font-size:13px; font-weight:600; cursor:pointer;
  transition:background var(--gesso-duration-fast) var(--gesso-easing-default), color var(--gesso-duration-fast) var(--gesso-easing-default);
}
.rail-item svg{ width:18px; height:18px; flex-shrink:0; }
.rail-item:hover{ background:rgba(255,255,255,0.05); color:var(--gesso-fg); }
.rail-item:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }
.rail-item[aria-current="page"]{ background:var(--gesso-charcoal); color:var(--gesso-fg); }
.rail-item[aria-current="page"] svg{ color:var(--gesso-accent); }

/* work surface: split image inspector */
.worksurface{ display:flex; flex-direction:column; gap:16px; min-width:0; }
.toolbar{
  display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
  background:var(--gesso-charcoal); border-radius:var(--gesso-radius-lg); padding:12px 16px;
}
.toolbar-group{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.chip{
  display:inline-flex; align-items:center; gap:8px; padding:8px 16px; border-radius:var(--gesso-radius-full);
  font-size:12px; font-weight:600; color:var(--gesso-fg-muted); background:rgba(255,255,255,0.05); cursor:pointer;
  transition:background var(--gesso-duration-fast) var(--gesso-easing-default), color var(--gesso-duration-fast) var(--gesso-easing-default);
  white-space:nowrap;
}
.chip:hover{ background:rgba(255,255,255,0.09); color:var(--gesso-fg); }
.chip:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }
.chip[aria-selected="true"]{ background:var(--gesso-accent); color:var(--gesso-on-accent); }
.toolbar-meta{ font-size:12px; color:var(--gesso-fg-muted); }

.splitpane{
  display:grid; grid-template-columns:1fr 1fr; gap:16px; background:var(--gesso-charcoal);
  border-radius:var(--gesso-radius-lg); padding:16px; position:relative;
}
@media (max-width:640px){ .splitpane{ grid-template-columns:1fr; } }
.pane{ display:flex; flex-direction:column; gap:12px; min-width:0; }
.pane-label{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.pane-name{ font-size:12px; font-weight:700; color:var(--gesso-fg-muted); text-transform:uppercase; letter-spacing:0.05em; }
.pane-tag{ font-size:11px; font-weight:700; color:var(--gesso-accent-2); background:rgba(119,69,244,0.12); padding:3px 12px; border-radius:var(--gesso-radius-full); }
.pane-frame{
  position:relative; border-radius:var(--gesso-radius-md); overflow:hidden; background:var(--gesso-surface-recessed);
  aspect-ratio:4/3;
}
.pane-frame img{ width:100%; height:100%; object-fit:cover; }
.overlay-svg{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.kp{ transition:r var(--gesso-duration-fast) var(--gesso-easing-default), opacity var(--gesso-duration-fast) var(--gesso-easing-default); }
.pane-frame:hover .kp.good{ opacity:1; }
.kp.outlier{ opacity:0.85; }

.match-summary{
  display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;
  background:var(--gesso-charcoal); border-radius:var(--gesso-radius-lg); padding:16px 20px;
}
.ms-metrics{ display:flex; align-items:center; gap:32px; flex-wrap:wrap; }
.ms-metric{ display:flex; flex-direction:column; gap:2px; }
.ms-metric-label{ font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--gesso-fg-muted); }
.ms-metric-value{ font-family:var(--gesso-font-display); font-size:22px; font-weight:800; color:var(--gesso-fg); }
.ms-metric-value.accent{ color:var(--gesso-accent); }
.ms-actions{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }

/* keypoint list — data viz card */
.kp-panel{ background:var(--gesso-charcoal); border-radius:var(--gesso-radius-lg); padding:20px; display:flex; flex-direction:column; gap:16px; }
.kp-panel-head{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.kp-panel-title{ font-size:13px; font-weight:700; color:var(--gesso-fg); }
.kp-panel-count{ font-size:12px; color:var(--gesso-fg-muted); }
.kp-row{ display:flex; align-items:center; gap:12px; padding:8px 0; }
.kp-row + .kp-row{ border-top:1px solid var(--gesso-divider); }
.kp-id{ width:44px; flex-shrink:0; font-size:12px; color:var(--gesso-fg-muted); font-variant-numeric:tabular-nums; }
.kp-bar-track{ flex:1; height:8px; border-radius:var(--gesso-radius-full); background:rgba(255,255,255,0.05); overflow:hidden; }
.kp-bar-fill{ height:100%; border-radius:var(--gesso-radius-full); background:var(--gesso-accent); transition:opacity var(--gesso-duration-fast) var(--gesso-easing-default); }
.kp-row:hover .kp-bar-fill{ opacity:0.85; }
.kp-row.rejected .kp-bar-fill{ background:var(--gesso-fg-muted); }
.kp-val{ width:40px; flex-shrink:0; text-align:right; font-size:12px; font-weight:700; color:var(--gesso-fg); font-variant-numeric:tabular-nums; }

/* inspector */
.inspector{ display:flex; flex-direction:column; gap:16px; position:sticky; top:96px; }
.insp-card{ background:var(--gesso-charcoal); border-radius:var(--gesso-radius-lg); padding:20px; display:flex; flex-direction:column; gap:12px; }
.insp-hero{ background:var(--gesso-surface); border-radius:var(--gesso-radius-lg); padding:20px; display:flex; flex-direction:column; gap:8px; }
.insp-hero-label{ font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:rgba(255,255,255,0.7); }
.insp-hero-value{ font-family:var(--gesso-font-display); font-size:40px; line-height:44px; font-weight:800; color:var(--gesso-accent); }
.insp-hero-sub{ font-size:12px; color:rgba(255,255,255,0.65); }
.insp-title{ font-size:12px; font-weight:700; color:var(--gesso-fg-muted); text-transform:uppercase; letter-spacing:0.05em; }
.insp-row{ display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:13px; }
.insp-row + .insp-row{ border-top:1px solid var(--gesso-divider); padding-top:12px; margin-top:2px; }
.insp-row-label{ display:flex; align-items:center; gap:8px; color:var(--gesso-fg-muted); }
.insp-row-label svg{ width:16px; height:16px; flex-shrink:0; }
.insp-row-value{ color:var(--gesso-fg); font-weight:600; font-variant-numeric:tabular-nums; }
.rmse-bars{ display:flex; align-items:flex-end; gap:8px; height:56px; }
.rmse-bar{ flex:1; background:var(--gesso-accent); border-radius:var(--gesso-radius-full); }
</style>

<div class="shell" data-brief-id="screen-root" data-brief-role="screen">

  <header class="topbar" data-app-region="topbar" data-brief-id="topbar" data-brief-role="nav-top">
    <div class="brand">
      <div class="brand-mark"><svg data-icon="lucide/moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg></div>
      <div class="brand-text">
        <span class="brand-title">LunarMatch AI</span>
        <span class="brand-tag">AI-Powered Multi-Modal Lunar Image Registration</span>
      </div>
    </div>
    <nav class="topnav" aria-label="Primary">
      <div class="navitem" aria-current="page" role="button" tabindex="0"><svg data-icon="lucide/layout-grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></g></svg>Dashboard</div>
      <div class="navitem" role="button" tabindex="0"><svg data-icon="lucide/target" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></g></svg>Matching</div>
      <div class="navitem" role="button" tabindex="0"><svg data-icon="lucide/layers" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></g></svg>Registration</div>
      <div class="navitem" role="button" tabindex="0"><svg data-icon="lucide/bar-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 3v16a2 2 0 0 0 2 2h16m-3-4V9m-5 8V5M8 17v-3"/></svg>Analytics</div>
    </nav>
    <div class="topactions">
      <div class="icon-btn" role="button" tabindex="0"><svg data-icon="lucide/search" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21l-4.34-4.34"/><circle cx="11" cy="11" r="8"/></g></svg></div>
      <div class="icon-btn" role="button" tabindex="0"><svg data-icon="lucide/bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg></div>
      <div class="avatar">AK</div>
    </div>
  </header>

  <div class="header" data-app-region="header" data-brief-id="page-header" data-brief-role="header">
    <div class="header-top">
      <div>
        <h1 class="header-title">Live Correspondence Match Viewer</h1>
        <p class="header-sub">Field: Mare Serenitatis · Chandrayaan‑2 OHRC vs LRO‑NAC reference strip</p>
      </div>
      <div class="header-actions">
        <div class="btn btn-ghost" role="button" tabindex="0" data-brief-id="cta-rerun" data-brief-role="button"><svg data-icon="lucide/refresh-cw" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></g></svg>Re-run</div>
        <div class="btn btn-primary" role="button" tabindex="0" data-brief-id="cta-run-matching" data-brief-role="cta"><svg data-icon="lucide/zap" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>Run AI Matching</div>
      </div>
    </div>

    <div class="status" data-app-region="status" data-brief-id="status-row" data-brief-role="metrics-row">
      <div class="status-item" data-brief-id="metric-matches" data-brief-role="metric">
        <span class="status-label"><svg data-icon="lucide/git-merge" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></g></svg>Correspondences</span>
        <span class="status-value">248</span>
      </div>
      <div class="status-item" data-brief-id="metric-outliers" data-brief-role="metric">
        <span class="status-label"><svg data-icon="lucide/scan-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2m4-5h10"/></svg>Outliers Flagged</span>
        <span class="status-value">31</span>
      </div>
      <div class="status-item" data-brief-id="metric-confidence" data-brief-role="metric">
        <span class="status-label">Mean Confidence</span>
        <span class="status-value">92%</span>
      </div>
      <div class="status-item" data-brief-id="metric-rmse" data-brief-role="metric">
        <span class="status-label"><svg data-icon="lucide/ruler" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Zm-6.8-2.8l2-2m-5-1l2-2m-5-1l2-2m7 11l2-2"/></svg>Registration RMSE</span>
        <span class="status-value plain">0.8 px</span>
      </div>
    </div>
  </div>

  <div class="appgrid">
    <nav class="rail" data-app-region="rail" data-brief-id="rail-nav" data-brief-role="nav-bottom" aria-label="Sections">
      <span class="rail-section">Workspace</span>
      <div class="rail-item" aria-current="page" role="button" tabindex="0"><svg data-icon="lucide/scan" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/></svg>Correspondence</div>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/move-3d" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v16h16M5 19l6-6"/><path d="m2 6l3-3l3 3m10 10l3 3l-3 3"/></g></svg>Registration</div>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/gauge" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m12 14l4-4M3.34 19a10 10 0 1 1 17.32 0"/></svg>Accuracy Eval</div>
      <span class="rail-section">Datasets</span>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/satellite" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m13.5 6.5l-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5m7-3L19 5m-1.5 5.5l3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5M9 21a6 6 0 0 0-6-6"/><path d="M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z"/></g></svg>OHRC</div>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/aperture" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"/></g></svg>TMC‑2</div>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/waves" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2c2.5 0 2.5-2 5-2c1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1c2.5 0 2.5-2 5-2c2.6 0 2.4 2 5 2c2.5 0 2.5-2 5-2c1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1c2.5 0 2.5-2 5-2c2.6 0 2.4 2 5 2c2.5 0 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/></svg>IIRS</div>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"/></g></svg>LRO‑NAC</div>
    </nav>

    <main class="worksurface" data-app-region="work-surface" data-brief-id="split-inspector" data-brief-role="section">
      <div class="toolbar">
        <div class="toolbar-group">
          <div class="chip" aria-selected="true" role="button" tabindex="0">All Matches</div>
          <div class="chip" role="button" tabindex="0">Inliers Only</div>
          <div class="chip" role="button" tabindex="0">Outliers Only</div>
          <div class="chip" role="button" tabindex="0"><svg data-icon="lucide/sliders-horizontal" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-xs" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10 5H3m9 14H3M14 3v4m2 10v4m5-9h-9m9 7h-5m5-14h-7m-6 5v4m0-2H3"/></svg>Threshold 0.7</div>
        </div>
        <span class="toolbar-meta">Tile 14/40 · OHRC 25cm/px</span>
      </div>

      <div class="splitpane" data-viz="dual-image-panel" data-brief-id="dual-image-panel" data-brief-role="viz">
        <div class="pane">
          <div class="pane-label"><span class="pane-name">Chandrayaan‑2 OHRC</span><span class="pane-tag">Source</span></div>
          <div class="pane-frame">
            <img src="https://rpreisbpsxrjwqsfeggf.supabase.co/storage/v1/object/public/direction-images/directions/cf3619e7-402e-4b68-84f6-a4ab18d23d25/5affd76797a8.jpg" alt="Chandrayaan-2 OHRC lunar surface tile" data-stock-provider="pexels" data-stock-page="https://www.pexels.com/photo/close-up-shot-of-moon-crater-10044707/" data-stock-photographer="Micotino" />
            <svg class="overlay-svg" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
              <circle class="kp good" cx="80" cy="70" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="160" cy="120" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="240" cy="90" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="300" cy="180" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="120" cy="220" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp outlier" cx="330" cy="60" r="5" fill="none" stroke="var(--gesso-error)" stroke-width="2"></circle>
              <circle class="kp outlier" cx="60" cy="240" r="5" fill="none" stroke="var(--gesso-error)" stroke-width="2"></circle>
            </svg>
          </div>
        </div>
        <div class="pane">
          <div class="pane-label"><span class="pane-name">LRO‑NAC Reference</span><span class="pane-tag">Target</span></div>
          <div class="pane-frame">
            <img src="https://rpreisbpsxrjwqsfeggf.supabase.co/storage/v1/object/public/direction-images/directions/cf3619e7-402e-4b68-84f6-a4ab18d23d25/5affd76797a8.jpg" alt="LRO-NAC reference lunar surface tile" data-stock-provider="pexels" data-stock-page="https://www.pexels.com/photo/close-up-shot-of-moon-crater-10044707/" data-stock-photographer="Micotino" />
            <svg class="overlay-svg" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
              <circle class="kp good" cx="90" cy="75" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="168" cy="126" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="246" cy="94" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="304" cy="184" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="126" cy="224" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp outlier" cx="200" cy="250" r="5" fill="none" stroke="var(--gesso-error)" stroke-width="2"></circle>
              <circle class="kp outlier" cx="350" cy="150" r="5" fill="none" stroke="var(--gesso-error)" stroke-width="2"></circle>
            </svg>
          </div>
        </div>
      </div>

      <div class="match-summary" data-brief-id="match-summary" data-brief-role="metrics-row">
        <div class="ms-metrics">
          <div class="ms-metric"><span class="ms-metric-label">Selected Match</span><span class="ms-metric-value">KP‑117</span></div>
          <div class="ms-metric"><span class="ms-metric-label">Confidence</span><span class="ms-metric-value accent">96%</span></div>
          <div class="ms-metric"><span class="ms-metric-label">Pixel Offset</span><span class="ms-metric-value">1.2 px</span></div>
        </div>
        <div class="ms-actions">
          <div class="btn btn-ghost" role="button" tabindex="0"><svg data-icon="lucide/x" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12"/></svg>Reject Outlier</div>
          <div class="btn btn-ghost" role="button" tabindex="0"><svg data-icon="lucide/check" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>Approve</div>
          <div class="btn btn-primary" role="button" tabindex="0"><svg data-icon="lucide/layers-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74zm7 .545l1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845"/></svg>Trigger Registration</div>
        </div>
      </div>

      <div class="kp-panel" data-viz="keypoint-list" data-brief-id="keypoint-list" data-brief-role="viz">
        <div class="kp-panel-head">
          <span class="kp-panel-title">Keypoint Confidence</span>
          <span class="kp-panel-count">Top 8 of 248</span>
        </div>
        <div class="kp-row"><span class="kp-id">KP‑101</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:98%"></div></div><span class="kp-val">98%</span></div>
        <div class="kp-row"><span class="kp-id">KP‑104</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:95%"></div></div><span class="kp-val">95%</span></div>
        <div class="kp-row"><span class="kp-id">KP‑109</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:93%"></div></div><span class="kp-val">93%</span></div>
        <div class="kp-row"><span class="kp-id">KP‑117</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:96%"></div></div><span class="kp-val">96%</span></div>
        <div class="kp-row"><span class="kp-id">KP‑122</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:88%"></div></div><span class="kp-val">88%</span></div>
        <div class="kp-row rejected"><span class="kp-id">KP‑135</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:41%"></div></div><span class="kp-val">41%</span></div>
        <div class="kp-row"><span class="kp-id">KP‑140</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:90%"></div></div><span class="kp-val">90%</span></div>
        <div class="kp-row rejected"><span class="kp-id">KP‑148</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:37%"></div></div><span class="kp-val">37%</span></div>
      </div>
    </main>

    <aside class="inspector" data-app-region="inspector" data-brief-id="inspector-panel" data-brief-role="section">
      <div class="insp-hero">
        <span class="insp-hero-label">Registration Accuracy</span>
        <span class="insp-hero-value">0.8 px</span>
        <span class="insp-hero-sub">RMSE vs LRO‑NAC control points</span>
      </div>

      <div class="insp-card">
        <span class="insp-title">Match Session</span>
        <div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/satellite" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m13.5 6.5l-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5m7-3L19 5m-1.5 5.5l3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5M9 21a6 6 0 0 0-6-6"/><path d="M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z"/></g></svg>Source</span><span class="insp-row-value">OHRC Tile 14</span></div>
        <section data-component="ListRow" data-brief-id="auto-listrow-7" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"/></g></svg>Reference</span><span class="insp-row-value">LRO‑NAC M182</span></div></section>
        <section data-component="ListRow" data-brief-id="auto-listrow-6" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/scan-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2m4-5h10"/></svg>Algorithm</span><span class="insp-row-value">SIFT + RANSAC</span></div></section>
        <section data-component="ListRow" data-brief-id="auto-listrow-5" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></g></svg>Runtime</span><span class="insp-row-value">4.2 s</span></div></section>
      </div>

      <section data-component="Card" data-brief-id="auto-card-4" data-brief-role="card" data-gesso-marker-wrap style="display: contents"><div class="insp-card">
        <span class="insp-title">RMSE by Tile Region</span>
        <div class="rmse-bars">
          <div class="rmse-bar" style="height:60%"></div>
          <div class="rmse-bar" style="height:40%"></div>
          <div class="rmse-bar" style="height:75%"></div>
          <div class="rmse-bar" style="height:30%"></div>
          <div class="rmse-bar" style="height:55%"></div>
          <div class="rmse-bar" style="height:20%"></div>
        </div>
      </div></section>

      <div class="insp-card">
        <span class="insp-title">Outlier Rejection</span>
        <section data-component="ListRow" data-brief-id="auto-listrow-3" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M22 3H2l8 9.46V19l4 2v-8.54z"/></svg>RANSAC Threshold</span><span class="insp-row-value">2.5 px</span></div></section>
        <section data-component="ListRow" data-brief-id="auto-listrow-2" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/trash-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>Removed</span><span class="insp-row-value">31</span></div></section>
        <section data-component="ListRow" data-brief-id="auto-listrow-1" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/check-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12l2 2l4-4"/></g></svg>Retained</span><span class="insp-row-value">217</span></div></section>
      </div>
    </aside>
  </div>
</div>
<script data-gesso-contrast>(function(){
function ready(fn){if(document.readyState!=='loading')fn();else document.addEventListener('DOMContentLoaded',fn);}
var run=function(){
  function lin(c){c=c/255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
  function lum(rgb){return 0.2126*lin(rgb[0])+0.7152*lin(rgb[1])+0.0722*lin(rgb[2]);}
  function ratio(a,b){var x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
  // Computed colors are NOT always rgb(): color-mix / relative-color /
  // wide-gamut authored values serialize as color(srgb r g b / a) (and
  // exotic spaces as their own functions). The old rgb-only regex made
  // every such element INVISIBLE to this floor (field bug 2026-08-18:
  // 1.05:1 filter chips authored via color-mix shipped unremediated).
  // Fast paths for rgb()/color(srgb); everything else resolves through
  // a 1x1 canvas, memoized per unique string.
  var colorCanvas=null,colorMemo={};
  function parseRgb(s){
    if(!s)return null;
    if(Object.prototype.hasOwnProperty.call(colorMemo,s))return colorMemo[s];
    var out=null;
    var m=s.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if(m){out=[+m[1],+m[2],+m[3],m[4]!=null?+m[4]:1];}
    else{
      m=s.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\)$/);
      if(m){
        var al=m[4]!=null?(m[4].indexOf('%')>=0?parseFloat(m[4])/100:+m[4]):1;
        out=[Math.round(+m[1]*255),Math.round(+m[2]*255),Math.round(+m[3]*255),al];
      }else if(s!=='transparent'&&s.indexOf('url(')<0){
        try{
          if(!colorCanvas)colorCanvas=document.createElement('canvas');
          colorCanvas.width=1;colorCanvas.height=1;
          var cx2=colorCanvas.getContext('2d',{willReadFrequently:true});
          if(cx2){
            cx2.clearRect(0,0,1,1);
            cx2.fillStyle=s;
            cx2.fillRect(0,0,1,1);
            var px=cx2.getImageData(0,0,1,1).data;
            out=[px[0],px[1],px[2],px[3]/255];
          }
        }catch(e){out=null;}
      }
    }
    colorMemo[s]=out;
    return out;
  }
  // One stop matcher for gradient strings: rgb() and color(srgb) forms.
  var STOP_RE_SRC="(rgba?\\([^)]*\\)|color\\(srgb[^)]*\\))(?:\\s+(-?[\\d.]+)%)?";
  // The LAST linear-gradient in a background-image shorthand paints at the
  // BOTTOM of the stack: that is the base page/card color layer.
  function lastLinearGradient(bi){
    var at=bi.lastIndexOf('linear-gradient(');
    if(at<0)return null;
    var i=at+16,depth=1;
    while(i<bi.length&&depth>0){var ch=bi[i];if(ch==='(')depth++;else if(ch===')')depth--;i++;}
    return bi.slice(at+16,i-1);
  }
  // The gradient's color AT the element's position. A page-scale dusk
  // gradient can span 1.2:1-dark at the top and 4.5:1-light at the bottom;
  // sampling one stop for every element (the old behavior) measured all of
  // them against the same color and passed genuinely unreadable text.
  function gradientColorAt(bi,host,cx,cy){
    var g=lastLinearGradient(bi);
    if(g==null)return null;
    var hr=host.getBoundingClientRect();
    if(!hr.width||!hr.height)return null;
    var tx=Math.min(1,Math.max(0,(cx-hr.left)/hr.width));
    var ty=Math.min(1,Math.max(0,(cy-hr.top)/hr.height));
    var t=ty; // default axis: to bottom
    var head=g.split(',')[0]||'';
    var ang=head.match(/^\s*(-?[\d.]+)deg/);
    if(/^\s*to top\b/.test(head))t=1-ty;
    else if(/^\s*to right\b/.test(head))t=tx;
    else if(/^\s*to left\b/.test(head))t=1-tx;
    else if(ang){
      var a=((+ang[1])%360+360)%360;
      if(a<45||a>=315)t=1-ty;
      else if(a<135)t=tx;
      else if(a<225)t=ty;
      else t=1-tx;
    }
    var re=new RegExp(STOP_RE_SRC,"g"),mm;
    var stops=[];
    while((mm=re.exec(g))!==null){
      var c=parseRgb(mm[1]);
      if(c)stops.push({c:c,p:mm[2]!=null?(+mm[2])/100:null});
    }
    if(!stops.length)return null;
    if(stops[0].p==null)stops[0].p=0;
    if(stops[stops.length-1].p==null)stops[stops.length-1].p=1;
    for(var i2=1;i2<stops.length;i2++){
      if(stops[i2].p==null)stops[i2].p=stops[i2-1].p+(1-stops[i2-1].p)/(stops.length-i2);
    }
    var a1=stops[0],b1=stops[stops.length-1];
    for(var j=0;j<stops.length-1;j++){
      if(t>=stops[j].p&&t<=stops[j+1].p){a1=stops[j];b1=stops[j+1];break;}
    }
    var span=b1.p-a1.p;
    var f=span>0?(t-a1.p)/span:0;
    return[
      a1.c[0]+(b1.c[0]-a1.c[0])*f,
      a1.c[1]+(b1.c[1]-a1.c[1])*f,
      a1.c[2]+(b1.c[2]-a1.c[2])*f,
      a1.c[3]+(b1.c[3]-a1.c[3])*f
    ];
  }
  // Effective background at the element's own position: walk up compositing
  // EVERY paint layer (translucent card washes included; the old walk
  // ignored anything below 0.5 alpha, so a 0.3-alpha haze over a gradient
  // never entered the measurement) and interpolate gradients where the text
  // actually sits.
  function bgOf(el){
    var er=el.getBoundingClientRect();
    var cx=er.left+er.width/2,cy=er.top+er.height/2;
    var acc=null; // [r,g,b,coverage], layers accumulated top-down
    function put(c){
      if(!acc){acc=[c[0],c[1],c[2],c[3]];return;}
      var a1=acc[3],a2=c[3]*(1-a1),ao=a1+a2;
      if(ao<=0)return;
      acc=[(acc[0]*a1+c[0]*a2)/ao,(acc[1]*a1+c[1]*a2)/ao,(acc[2]*a1+c[2]*a2)/ao,ao];
    }
    for(var n=el;n&&n!==document.documentElement;n=n.parentElement){
      var cs=getComputedStyle(n);
      var bi=cs.backgroundImage;
      if(bi&&bi!=='none'&&bi.indexOf('gradient')>=0){
        var gc=gradientColorAt(bi,n,cx,cy);
        if(!gc){
          // Radial/conic or unparseable: keep the old base-layer heuristic
          // (last >= 0.5-alpha stop; low-alpha stops are overlays).
          var re2=new RegExp(STOP_RE_SRC,"g"),m2,op=null,any=null;
          while((m2=re2.exec(bi))!==null){
            var c2=parseRgb(m2[1]);
            if(!c2)continue;
            if(c2[3]>=0.5)op=c2;
            else if(c2[3]>0&&!any)any=c2;
          }
          gc=op||any;
        }
        if(gc){put([gc[0],gc[1],gc[2],Math.min(1,gc[3])]);if(acc&&acc[3]>=0.99)break;}
      }
      var c=parseRgb(cs.backgroundColor);
      if(c&&c[3]>0){put(c);if(acc[3]>=0.99)break;}
    }
    if(!acc)return[255,255,255];
    if(acc[3]<0.99)put([255,255,255,1]);
    return[Math.round(acc[0]),Math.round(acc[1]),Math.round(acc[2])];
  }
  function opaqueBg(cs){
    var c=parseRgb(cs.backgroundColor);
    if(c&&c[3]>0.5)return true;
    var bi=cs.backgroundImage;
    if(bi&&bi!=='none'&&bi.indexOf('gradient')>=0){
      var re=new RegExp(STOP_RE_SRC,"g"), mm;
      while((mm=re.exec(bi))!==null){var cc=parseRgb(mm[1]);if(cc&&cc[3]>=0.5)return true;}
    }
    return false;
  }
  // The element whose opaque background the text visually sits on (nearest
  // opaque ancestor; the page body as the floor).
  function bgHostOf(el){
    for(var n=el;n&&n!==document.documentElement;n=n.parentElement){
      if(opaqueBg(getComputedStyle(n)))return n;
    }
    return document.body;
  }
  // Is this text painted OVER a raster photo? bgOf() only sees solid/gradient
  // backgrounds, so without this an authored light-on-photo headline reads as
  // light-on-the-card-color, fails contrast, and gets flipped to BLACK — which
  // then lands unreadable on the actual photo. The photo covers the text's
  // bg-host only when a media box (img/video/picture, >=24px) is a DESCENDANT
  // of that host (so it paints over the host's background, under the text) and
  // its rect contains the text's center. This excludes: text in a sibling block
  // BELOW a hero image (geometry), and text inside its OWN opaque pill/chip
  // that floats over a photo (the pill, not the photo, is the bg-host — its
  // media set is empty), so those keep normal contrast remediation.
  function overImage(el){
    var er=el.getBoundingClientRect();
    if(!er.width||!er.height)return false;
    var cx=er.left+er.width/2, cy=er.top+er.height/2;
    var host=bgHostOf(el);
    var medias=host.querySelectorAll('img,video,picture');
    for(var j=0;j<medias.length;j++){
      var m=medias[j];
      if(m.contains(el))continue;
      var mr=m.getBoundingClientRect();
      if(mr.width<24||mr.height<24)continue;
      if(cx>=mr.left&&cx<=mr.right&&cy>=mr.top&&cy<=mr.bottom)return true;
    }
    return false;
  }
  // Walk leaf-text elements only. Skip status-bar (its fg is intentionally
  // light over arbitrary content), the tab bar (handled by its own pass below
  // so label and icon move TOGETHER), and elements the screen marked opt-out
  // via data-allow-low-contrast.
  // The bar selector must match every way the bar gets tagged: the addressable
  // pass labels it data-brief-role="nav-bottom" (NOT "tab-bar"), buttons carry
  // role "tab", and some bars only carry the class / id — guarding on the lone
  // role "tab-bar" lets a "nav-bottom" bar's labels through and splits them.
  var els=document.querySelectorAll('body *');
  var TAB_BAR_SKIP='[data-brief-role="tab-bar"],[data-brief-role="nav-bottom"],[data-brief-role="tab"],[data-brief-id="tab-bar"],nav.tab-bar,nav.tabbar,nav.bottom-nav,nav.nav-bar,nav.navbar';
  // Catastrophic-only floor. WCAG-level thresholds (4.5:1 / 3:1) made this
  // script re-litigate authored muted/tinted text tiers; readability belongs
  // to the scorer's contrast dimension. Below 2:1 the text is genuinely
  // unreadable, so only then do we intervene — but we remediate the whole
  // AUTHORED INK, not the lone element. One ink painted across a page-scale
  // gradient fails at the dark end and squeaks past the floor at the light
  // end; flipping only the sub-2 elements leaves the same paragraph half
  // white, half black. So: group leaf text by (bg-host, computed color); a
  // group with any sub-2 member flips per-element to the better pole, and
  // only where that pole IMPROVES the element's own local ratio (a member
  // already better off stays put).
  var groups={},order=[];
  for(var i=0;i<els.length;i++){
    var el=els[i];
    if(el.children.length||!el.textContent||!el.textContent.trim())continue;
    if(el.closest&&(el.closest('[data-brief-role="status-bar"]')||el.closest(TAB_BAR_SKIP)||el.closest('[data-allow-low-contrast]')))continue;
    var cs=getComputedStyle(el);
    var fg=parseRgb(cs.color);
    if(!fg||fg[3]<0.1)continue;
    if(overImage(el)){
      // Text over a photo: bgOf() measured the card color, not the photo, so
      // any verdict here is a guess. Do NOTHING: never flip to black (the old
      // bug) and never force light either (the forced rgba(255,255,255,.94)
      // misfired on light photos and authored scrims). The designer owns
      // photo-overlay treatment.
      continue;
    }
    var bg=bgOf(el);
    // Measure the ink the user SEES: low-alpha text sits far closer to its
    // background than its raw color claims (0.62-alpha cream on tan reads
    // 2.2:1 raw but 1.7:1 composited).
    var eff=fg[3]<1?[fg[0]*fg[3]+bg[0]*(1-fg[3]),fg[1]*fg[3]+bg[1]*(1-fg[3]),fg[2]*fg[3]+bg[2]*(1-fg[3])]:fg;
    var r=ratio([eff[0],eff[1],eff[2]],bg);
    var host=bgHostOf(el);
    var key=(host.getAttribute&&host.getAttribute('data-brief-id')||host.tagName)+'|'+cs.color;
    if(!groups[key]){groups[key]={members:[],bad:false};order.push(key);}
    groups[key].members.push({el:el,bg:bg,r:r});
    if(r<2)groups[key].bad=true;
  }
  for(var k=0;k<order.length;k++){
    var g2=groups[order[k]];
    if(!g2.bad)continue;
    for(var m3=0;m3<g2.members.length;m3++){
      var mem=g2.members[m3];
      var rB=ratio([0,0,0],mem.bg),rW=ratio([255,255,255],mem.bg);
      var best=Math.max(rB,rW);
      if(best<=mem.r)continue;
      mem.el.style.color=rB>rW?'rgba(0,0,0,0.92)':'rgba(255,255,255,0.92)';
    }
  }
  // Tab bar: label and icon are PINNED to one color (enforceTabBarLabelColor),
  // so the main pass skips the bar rather than split them. But a pinned pair
  // can still be pinned to an unreadable color (cream labels over a light
  // gradient tail). Remediate per tab ITEM, moving label + icon together:
  // inherited color for everything riding currentColor, plus explicit
  // fill/stroke attributes (fill="none" stays none). The original alpha keeps
  // the active/inactive hierarchy, floored at 0.85 so the flip actually reads.
  var bars=document.querySelectorAll(TAB_BAR_SKIP);
  for(var b3=0;b3<bars.length;b3++){
    var bar=bars[b3];
    if(bar.closest('[data-allow-low-contrast]'))continue;
    var labels=bar.querySelectorAll('*');
    var seen=[];
    for(var l3=0;l3<labels.length;l3++){
      var lab=labels[l3];
      if(lab.children.length||!lab.textContent||!lab.textContent.trim())continue;
      var lcs=getComputedStyle(lab);
      var lfg=parseRgb(lcs.color);
      if(!lfg||lfg[3]<0.1)continue;
      var lbg=bgOf(lab);
      var leff=lfg[3]<1?[lfg[0]*lfg[3]+lbg[0]*(1-lfg[3]),lfg[1]*lfg[3]+lbg[1]*(1-lfg[3]),lfg[2]*lfg[3]+lbg[2]*(1-lfg[3])]:lfg;
      if(ratio([leff[0],leff[1],leff[2]],lbg)>=2)continue;
      var item=lab;
      for(var p3=lab.parentElement;p3&&p3!==bar;p3=p3.parentElement)item=p3;
      if(seen.indexOf(item)>=0)continue;
      seen.push(item);
      var pole=ratio([0,0,0],lbg)>ratio([255,255,255],lbg)?[0,0,0]:[255,255,255];
      var subs=item.querySelectorAll('*');
      for(var s3=-1;s3<subs.length;s3++){
        var sub=s3<0?item:subs[s3];
        var scs=getComputedStyle(sub);
        var sfg=parseRgb(scs.color);
        var al2=Math.max(sfg?sfg[3]:1,0.85);
        sub.style.color='rgba('+pole[0]+','+pole[1]+','+pole[2]+','+al2+')';
        if(sub.tagName==='path'||sub.tagName==='PATH'||sub.getAttribute){
          var fa=sub.getAttribute&&sub.getAttribute('fill');
          if(fa&&fa!=='none'&&fa!=='currentColor')sub.style.fill='currentColor';
          var sa=sub.getAttribute&&sub.getAttribute('stroke');
          if(sa&&sa!=='none'&&sa!=='currentColor')sub.style.stroke='currentColor';
        }
      }
    }
  }
};
ready(run);
// Single pass, on purpose. The old window.load re-run (added so overImage()
// saw decoded media geometry) visibly re-flipped text after the user was
// already reading the screen. overImage() is now skip-only, so a missed
// photo at DOMContentLoaded costs at most one skipped remediation, not a
// wrong recolor; that trade is worth losing the late flip.
})();</script><script id="__GESSO_TOKEN_BRIDGE__">
window.addEventListener("message", function(e) {
  var d = e && e.data;
  if (!d || d.type !== "gesso-tokens" || !d.vars) return;
  var root = document.documentElement;
  for (var k in d.vars) {
    if (Object.prototype.hasOwnProperty.call(d.vars, k)) {
      root.style.setProperty(k, d.vars[k]);
    }
  }
});
</script></body></html>
```

</details>

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --gesso-canvas: #0a0a0a;
  --gesso-surface-recessed: #080808;
  --gesso-surface: #3f4d80;
  --gesso-surface-elevated: #4e5b8a;
  --gesso-divider: rgba(255,255,255,0.04);
  --gesso-fg: #ffffff;
  --gesso-fg-muted: #d6d6d7;
  --gesso-primary: #3d5afe;
  --gesso-on-accent: #FFFFFF;
  --gesso-accent-text: #506bfe;
  --gesso-secondary: #7745f4;
  --gesso-accent-2-text: #8b61f6;
  --gesso-neutral-50: #0a0a0a;
  --gesso-neutral-100: #3f4d80;
  --gesso-neutral-200: #5d6792;
  --gesso-neutral-300: #7b81a3;
  --gesso-neutral-400: #999cb4;
  --gesso-neutral-500: #b8b9c6;
  --gesso-neutral-600: #d6d6d7;
  --gesso-neutral-700: #e4e3e4;
  --gesso-neutral-800: #f2f1f1;
  --gesso-neutral-900: #ffffff;
  --gesso-neutral-950: #ffffff;
  --gesso-success: #68c389;
  --gesso-warning: #e6a75d;
  --gesso-error: #ef9d9d;
  --gesso-data-1: #2733d9;
  --gesso-data-2: #3751f5;
  --gesso-data-3: #5174ff;
  --gesso-data-4: #7294ff;
  --gesso-data-5: #95b1ff;
  --gesso-data-6: #bacdff;

  /* Typography — Font Families */
  --gesso-font-display: 'Hanken Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --gesso-font-body: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --gesso-font-mono: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --gesso-text-4xl: 36px;
  --gesso-leading-4xl: 1.2;
  --gesso-text-3xl: 30px;
  --gesso-leading-3xl: 1.2;
  --gesso-text-2xl: 24px;
  --gesso-leading-2xl: 1.2;
  --gesso-text-base: 16px;
  --gesso-leading-base: 1.5;
  --gesso-text-xs: 12px;
  --gesso-leading-xs: 1.5;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --gesso-space-1: 4px;
  --gesso-space-2: 8px;
  --gesso-space-3: 12px;
  --gesso-space-4: 16px;
  --gesso-space-6: 24px;
  --gesso-space-8: 32px;
  --gesso-space-12: 48px;
  --gesso-space-16: 64px;
  --gesso-space-24: 96px;
  --gesso-space-32: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --container-max-width: 1280px;
  --grid-columns: 12;
  --grid-gutter: 24px;
  --outer-margin: 64px;
  --section-padding: 80px;
  --section-gap: 80px;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;

  /* Border Radius */
  --radius-none: 0px;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --gesso-shadow-sm: none;
  --gesso-shadow-md: none;
  --gesso-shadow-lg: 0 1px 2px rgba(0,0,0,0.04);

  /* Surfaces */
  --surface-page: #0a0a0a;
  --surface-raised: #3f4d80;
  --surface-sunken: #1C2438;
  --surface-overlay: #0a0a0a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --gesso-canvas: #0a0a0a;
  --gesso-surface-recessed: #080808;
  --gesso-surface: #3f4d80;
  --gesso-surface-elevated: #4e5b8a;
  --gesso-divider: rgba(255,255,255,0.04);
  --gesso-fg: #ffffff;
  --gesso-fg-muted: #d6d6d7;
  --gesso-primary: #3d5afe;
  --gesso-on-accent: #FFFFFF;
  --gesso-accent-text: #506bfe;
  --gesso-secondary: #7745f4;
  --gesso-accent-2-text: #8b61f6;
  --gesso-neutral-50: #0a0a0a;
  --gesso-neutral-100: #3f4d80;
  --gesso-neutral-200: #5d6792;
  --gesso-neutral-300: #7b81a3;
  --gesso-neutral-400: #999cb4;
  --gesso-neutral-500: #b8b9c6;
  --gesso-neutral-600: #d6d6d7;
  --gesso-neutral-700: #e4e3e4;
  --gesso-neutral-800: #f2f1f1;
  --gesso-neutral-900: #ffffff;
  --gesso-neutral-950: #ffffff;
  --gesso-success: #68c389;
  --gesso-warning: #e6a75d;
  --gesso-error: #ef9d9d;
  --gesso-data-1: #2733d9;
  --gesso-data-2: #3751f5;
  --gesso-data-3: #5174ff;
  --gesso-data-4: #7294ff;
  --gesso-data-5: #95b1ff;
  --gesso-data-6: #bacdff;

  /* Typography */
  --gesso-font-display: 'Hanken Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --gesso-font-body: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --gesso-font-mono: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --gesso-text-4xl: 36px;
  --gesso-leading-4xl: 1.2;
  --gesso-text-3xl: 30px;
  --gesso-leading-3xl: 1.2;
  --gesso-text-2xl: 24px;
  --gesso-leading-2xl: 1.2;
  --gesso-text-base: 16px;
  --gesso-leading-base: 1.5;
  --gesso-text-xs: 12px;
  --gesso-leading-xs: 1.5;

  /* Spacing */
  --gesso-space-1: 4px;
  --gesso-space-2: 8px;
  --gesso-space-3: 12px;
  --gesso-space-4: 16px;
  --gesso-space-6: 24px;
  --gesso-space-8: 32px;
  --gesso-space-12: 48px;
  --gesso-space-16: 64px;
  --gesso-space-24: 96px;
  --gesso-space-32: 128px;

  /* Border Radius */
  --radius-none: 0px;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --gesso-shadow-sm: none;
  --gesso-shadow-md: none;
  --gesso-shadow-lg: 0 1px 2px rgba(0,0,0,0.04);

  /* Layout */
  --container-max-width: 1280px;
  --grid-columns: 12;
  --grid-gutter: 24px;
  --outer-margin: 64px;
  --section-padding: 80px;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```


## Tokens (JSON)

```json
{
  "color": {
    "neutral": {
      "50": "#0a0a0a",
      "100": "#3f4d80",
      "200": "#1C2438",
      "300": "#2A3550",
      "400": "#3D4F6B",
      "500": "#6B7FA0",
      "600": "#8a8a8e",
      "700": "#B0BED8",
      "800": "#CDD6E8",
      "900": "#ffffff",
      "950": "#F4F7FC"
    },
    "primary": "#3d5afe",
    "semantic": {
      "error": "#F87171",
      "success": "#34D399",
      "warning": "#FBBF24"
    },
    "secondary": "#7745f4"
  },
  "motion": {
    "easing": {
      "default": "cubic-bezier(0.4, 0, 0.2, 1)",
      "emphasis": "cubic-bezier(0.0, 0, 0.2, 1)"
    },
    "duration": {
      "base": "180ms",
      "fast": "100ms",
      "slow": "300ms"
    }
  },
  "radius": {
    "lg": "24px",
    "md": "16px",
    "sm": "8px",
    "full": "9999px",
    "none": "0px"
  },
  "shadow": {
    "lg": "0 1px 2px rgba(0,0,0,0.04)",
    "md": "none",
    "sm": "none"
  },
  "spacing": {
    "unit": 8,
    "scale": {
      "1": "4px",
      "2": "8px",
      "3": "12px",
      "4": "16px",
      "6": "24px",
      "8": "32px",
      "12": "48px",
      "16": "64px",
      "24": "96px",
      "32": "128px"
    }
  },
  "approach": {
    "mood": "authoritative, precise, nocturnal, technical",
    "name": "Instrument Glass",
    "anchor": "NASA mission operations center, ground control workstation"
  },
  "extended": {
    "glow": {
      "color": "#00C2CC",
      "spread": "8px",
      "enabled": true
    },
    "border": {
      "color": "#2A3550",
      "style": "solid",
      "width": "1px"
    },
    "texture": {
      "type": "noise",
      "opacity": 0.03
    },
    "gradient": {
      "style": "",
      "enabled": false
    }
  },
  "typeface": {
    "body": "Geist",
    "mono": "Geist",
    "scale": {
      "lg": "1.125rem",
      "sm": "0.875rem",
      "xl": "1.25rem",
      "xs": "0.75rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "base": "1rem"
    },
    "display": "Hanken Grotesk",
    "weights": [
      300,
      400,
      600,
      700
    ],
    "bodyWeight": 400,
    "displayWeight": 600
  },
  "surfacePack": "web-cosmic-glow"
}
```

## Reference HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken%20Grotesk:wght@300;400;600;700&family=Geist:wght@300;400;600;700&display=swap">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<style id="gesso-foundation">*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}html,body{width: 100%;min-height: 100vh;overflow-x:clip;max-width:100%;}body{font-family:var(--gesso-font-body,system-ui),sans-serif;color:var(--gesso-fg,#0a0a0a);background:var(--gesso-canvas,#ffffff);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;line-height:1.4;}img,svg{display:block;max-width:100%;}button{font:inherit;color:inherit;background:none;border:none;cursor:pointer;}a{color:inherit;text-decoration:none;}</style>
<style id="gesso-text-wrap">h1,h2,h3{text-wrap:balance}p,li,figcaption,blockquote{text-wrap:pretty}</style>
<style id="gesso-font-smoothing">html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}</style>
<style id="gesso-image-outline">img:not([data-illustration]):not([data-icon]):not([aria-hidden="true"]){outline:1px solid rgba(255,255,255,0.05);outline-offset:-1px}</style>
<style>/* gesso-icon-base v1 */
.ic { display: inline-block; width: 16px; height: 16px; vertical-align: -0.125em; flex-shrink: 0; line-height: 0; }
.ic svg { width: 100%; height: 100%; display: block; }
svg.ic { width: 16px; height: 16px; display: inline-block; vertical-align: -0.125em; flex-shrink: 0; }
.ic[data-icon-style="line"] { stroke-width: var(--ic-stroke, 2); }
.ic[data-icon-style="line"] svg path, .ic[data-icon-style="line"] svg circle, .ic[data-icon-style="line"] svg rect, .ic[data-icon-style="line"] svg line, .ic[data-icon-style="line"] svg polyline, .ic[data-icon-style="line"] svg polygon { stroke-width: inherit; }
.ic-sm { --ic-stroke: 2.25; }
.ic-xs { --ic-stroke: 2.5; }
svg.ic-lg, .ic-lg svg { width: 24px; height: 24px; }
svg.ic-xl, .ic-xl svg { width: 32px; height: 32px; }
svg.ic-2xl, .ic-2xl svg { width: 32px; height: 32px; }
.ic-lg { --ic-stroke: 1.75; }
.ic-xl { --ic-stroke: 1.5; }
.ic-2xl { --ic-stroke: 1.5; }
button { border: 0; background: transparent; padding: 0; font: inherit; color: inherit; cursor: pointer; -webkit-appearance: none; appearance: none; }
</style>

<style id="gesso-responsive-shell">html,body{width:100%!important;max-width:100%!important;min-width:0;overflow-x:hidden}@media (max-width:1279.98px){*{min-width:0}h1,h2,h3,h4,h5,h6,p,td,th{min-width:min-content}}@media (min-width:1280px){*{min-width:auto}:where(nav,header){column-gap:24px}:where(nav a,header a){white-space:nowrap}}img,svg,video,canvas,iframe,table{max-width:100%}</style><style id="gesso-mobile-web-layer">.gesso-nav-check,.gesso-nav-burger{display:none}@media (max-width: 1024px){.inspector{display:none!important}}@media (max-width: 640px){.rail{display:none!important}}@media (max-width: 480px){nav,nav ul,header ul{flex-wrap:wrap}nav a,header ul a{display:inline-block}table{display:block;overflow-x:auto;min-width:0!important;max-width:100%}[data-gesso-flexwrap]{flex-wrap:wrap}h1,h2,h3{overflow-wrap:break-word}[data-gesso-pinned-height]{height:auto!important;min-height:0!important}.gesso-nav-check{display:block;position:absolute;width:1px;height:1px;margin:0;opacity:0;pointer-events:none}.gesso-nav-check:focus-visible+.gesso-nav-burger{outline:2px solid currentColor;outline-offset:2px}.gesso-nav-burger{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;cursor:pointer;flex-shrink:0;border-radius:8px}.gesso-nav-burger span{display:block;position:relative;width:18px;height:2px;border-radius:1px;background:currentColor}.gesso-nav-burger span::before,.gesso-nav-burger span::after{content:"";position:absolute;left:0;width:18px;height:2px;border-radius:1px;background:currentColor;transition:transform 150ms ease}.gesso-nav-burger span::before{top:-6px}.gesso-nav-burger span::after{top:6px}.gesso-nav-check:checked~.gesso-nav-burger span{background:transparent}.gesso-nav-check:checked~.gesso-nav-burger span::before{transform:translateY(6px) rotate(45deg)}.gesso-nav-check:checked~.gesso-nav-burger span::after{transform:translateY(-6px) rotate(-45deg)}[data-gesso-navlinks]{display:none!important}.gesso-nav-check:checked~[data-gesso-navlinks]{display:flex!important;flex-direction:column;align-items:stretch;flex-basis:100%;min-width:100%;order:99}.shell{width:100%!important;max-width:100%!important}.brand{flex-wrap:wrap}.brand-mark{flex-wrap:wrap}.navitem{flex-wrap:wrap}.topactions{flex-wrap:wrap}.icon-btn{flex-wrap:wrap}.avatar{flex-wrap:wrap}.btn{flex-wrap:wrap}.status-label{flex-wrap:wrap}.appgrid{grid-template-columns:1fr!important}.appgrid>*{grid-column:1/-1!important;grid-row:auto!important}.rail-item{flex-wrap:wrap}.chip{flex-wrap:wrap}.splitpane{grid-template-columns:1fr!important}.splitpane>*{grid-column:1/-1!important;grid-row:auto!important}.pane-label{flex-wrap:wrap}.kp-panel-head{flex-wrap:wrap}.kp-row{flex-wrap:wrap}.insp-row{flex-wrap:wrap}.insp-row-label{flex-wrap:wrap}.rmse-bars{flex-wrap:wrap}}@media (prefers-reduced-motion: reduce){.gesso-nav-burger span::before,.gesso-nav-burger span::after{transition:none}}</style><!--gesso-fonts:start--><style id="gesso-font-lock">:root{--gesso-font-display:"Hanken Grotesk", system-ui, -apple-system, sans-serif !important;--gesso-font-body:"Geist", system-ui, -apple-system, sans-serif !important;--gesso-font-mono:"Geist", ui-monospace, "JetBrains Mono", monospace !important;}</style><!--gesso-fonts:end-->
</head>
<body>
<meta name="x-visual-moves" content="Channeled the true-black canvas with navy/charcoal tile fills (no borders, no shadows) directly onto the split-panel inspector work surface. Took Memotron's side-by-side comparison scan path fused with Calendly's compact stat-row-above-chart hierarchy for the header band. Rendered outlier keypoints as bare capsule-style confidence bars in electric blue, reserving the accent strictly for numerals and match-quality marks per the anti-pattern list.">
<style>
:root{
  --gesso-canvas:#0A0A0A;
  --gesso-surface:#3f4d80;
  --gesso-surface-elevated:#4b5888;
  --gesso-surface-recessed:#0a0a0a;
  --gesso-fg:#FFFFFF;
  --gesso-fg-muted:#8A8A8E;
  --gesso-divider:rgba(255,255,255,0.04);
  --gesso-accent:#3D5AFE;
  --gesso-accent-2:#7745f4;
  --gesso-on-accent:#FFFFFF;
  --gesso-data-1:#2733d9; --gesso-data-2:#3751f5; --gesso-data-3:#5174ff;
  --gesso-data-4:#7294ff; --gesso-data-5:#95b1ff; --gesso-data-6:#bacdff;
  --gesso-success:#3D5AFE; --gesso-warning:#7745f4; --gesso-error:#ff5c6c;
  --gesso-primary:var(--gesso-accent); --gesso-secondary:var(--gesso-accent-2);
  --gesso-neutral-50:var(--gesso-canvas); --gesso-neutral-900:var(--gesso-fg);
  --gesso-radius-sm:8px; --gesso-radius-md:16px; --gesso-radius-lg:24px; --gesso-radius-full:9999px;
  --gesso-shadow-sm:none; --gesso-shadow-md:none; --gesso-shadow-lg:0 1px 2px rgba(0,0,0,0.04);
  --gesso-duration-fast:150ms; --gesso-easing-default:cubic-bezier(0.4,0,0.2,1);
  --gesso-font-display:"Hanken Grotesk", system-ui, -apple-system, sans-serif;
  --gesso-font-body:"Geist", system-ui, -apple-system, sans-serif;
  --gesso-charcoal:#1c1c1e;
}
html,body{width:100%;min-height:100%;overflow-x:hidden;}
*{min-width:0;}
body{
  background:var(--gesso-canvas); color:var(--gesso-fg);
  font-family:var(--gesso-font-body);
  padding-left:clamp(20px,4vw,48px); padding-right:clamp(20px,4vw,48px);
  padding-top:0; padding-bottom:24px;
}
img,video{max-width:100%;display:block;}
h1,h2,h3{font-family:var(--gesso-font-display); font-weight:700; margin:0; text-wrap:balance; overflow-wrap:break-word;}
p,span,div{overflow-wrap:break-word;}
.shell{display:flex; flex-direction:column; gap:0; max-width:1280px; margin-inline:auto;}

/* topbar */
.topbar{
  display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
  padding:20px 0; position:sticky; top:0; z-index:20;
  background:var(--gesso-canvas);
}
.brand{display:flex; align-items:center; gap:12px;}
.brand-mark{
  width:36px; height:36px; border-radius:var(--gesso-radius-full);
  background:var(--gesso-charcoal); display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.brand-mark svg{color:var(--gesso-accent);}
.brand-text{display:flex; flex-direction:column;}
.brand-title{font-family:var(--gesso-font-display); font-weight:700; font-size:16px; color:var(--gesso-fg); line-height:20px;}
.brand-tag{font-size:11px; color:var(--gesso-fg-muted); line-height:14px;}
.topnav{display:flex; align-items:center; gap:8px; flex-wrap:wrap;}
.navitem{
  display:inline-flex; align-items:center; gap:8px; padding:8px 16px; border-radius:var(--gesso-radius-full);
  background:transparent; color:var(--gesso-fg-muted); font-size:13px; font-weight:600; cursor:pointer;
  transition:background var(--gesso-duration-fast) var(--gesso-easing-default), color var(--gesso-duration-fast) var(--gesso-easing-default);
}
.navitem:hover{ background:rgba(255,255,255,0.05); color:var(--gesso-fg); }
.navitem:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }
.navitem[aria-current="page"]{ background:var(--gesso-charcoal); color:var(--gesso-fg); }
.topactions{display:flex; align-items:center; gap:12px;}
.icon-btn{
  width:36px; height:36px; border-radius:var(--gesso-radius-full); background:var(--gesso-charcoal);
  color:var(--gesso-fg-muted); display:flex; align-items:center; justify-content:center; cursor:pointer;
  transition:background var(--gesso-duration-fast) var(--gesso-easing-default), color var(--gesso-duration-fast) var(--gesso-easing-default);
}
.icon-btn:hover{ background:rgba(255,255,255,0.08); color:var(--gesso-fg); }
.icon-btn:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }
.avatar{
  width:36px; height:36px; border-radius:var(--gesso-radius-full); background:var(--gesso-accent);
  color:var(--gesso-on-accent); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;
}

/* header band */
.header{ display:flex; flex-direction:column; gap:16px; padding:20px 0 16px; }
.header-top{ display:flex; align-items:flex-start; justify-content:space-between; gap:24px; flex-wrap:wrap; }
.header-title{ font-size:clamp(22px,2.2vw,28px); line-height:32px; color:var(--gesso-fg); }
.header-sub{ font-size:13px; color:var(--gesso-fg-muted); margin-top:4px; }
.header-actions{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.btn{
  display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:var(--gesso-radius-full);
  font-size:13px; font-weight:700; cursor:pointer; white-space:nowrap;
  transition:background var(--gesso-duration-fast) var(--gesso-easing-default), transform 80ms var(--gesso-easing-default), filter var(--gesso-duration-fast) var(--gesso-easing-default);
}
.btn-primary{ background:var(--gesso-accent); color:var(--gesso-on-accent); }
.btn-primary:hover{ filter:brightness(1.08); }
.btn-primary:active{ transform:translateY(1px) scale(0.98); }
.btn-primary:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }
.btn-ghost{ background:var(--gesso-charcoal); color:var(--gesso-fg); }
.btn-ghost:hover{ background:rgba(255,255,255,0.08); }
.btn-ghost:active{ transform:translateY(1px) scale(0.98); }
.btn-ghost:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }

/* status row */
.status{ display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:24px; padding:4px 0 20px; max-height:96px; }
.status-item{ display:flex; flex-direction:column; gap:2px; }
.status-label{ display:flex; align-items:center; gap:8px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--gesso-fg-muted); }
.status-label svg{ width:14px; height:14px; flex-shrink:0; color:var(--gesso-fg-muted); }
.status-value{ font-family:var(--gesso-font-display); font-size:28px; font-weight:800; color:var(--gesso-accent); line-height:32px; }
.status-value.plain{ color:var(--gesso-fg); }

/* main grid: rail / work-surface / inspector */
.appgrid{ display:grid; grid-template-columns:220px minmax(0,1fr) 320px; gap:24px; align-items:start; }
@media (max-width:1024px){ .appgrid{ grid-template-columns:72px minmax(0,1fr); } .inspector{ display:none; } }
@media (max-width:640px){ .appgrid{ grid-template-columns:1fr; } .rail{ display:none; } }

.rail{
  display:flex; flex-direction:column; gap:4px; position:sticky; top:96px;
}
.rail-section{ font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--gesso-fg-muted); padding:12px 12px 8px; }
.rail-item{
  display:flex; align-items:center; gap:12px; padding:12px 12px; border-radius:var(--gesso-radius-md);
  color:var(--gesso-fg-muted); font-size:13px; font-weight:600; cursor:pointer;
  transition:background var(--gesso-duration-fast) var(--gesso-easing-default), color var(--gesso-duration-fast) var(--gesso-easing-default);
}
.rail-item svg{ width:18px; height:18px; flex-shrink:0; }
.rail-item:hover{ background:rgba(255,255,255,0.05); color:var(--gesso-fg); }
.rail-item:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }
.rail-item[aria-current="page"]{ background:var(--gesso-charcoal); color:var(--gesso-fg); }
.rail-item[aria-current="page"] svg{ color:var(--gesso-accent); }

/* work surface: split image inspector */
.worksurface{ display:flex; flex-direction:column; gap:16px; min-width:0; }
.toolbar{
  display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
  background:var(--gesso-charcoal); border-radius:var(--gesso-radius-lg); padding:12px 16px;
}
.toolbar-group{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.chip{
  display:inline-flex; align-items:center; gap:8px; padding:8px 16px; border-radius:var(--gesso-radius-full);
  font-size:12px; font-weight:600; color:var(--gesso-fg-muted); background:rgba(255,255,255,0.05); cursor:pointer;
  transition:background var(--gesso-duration-fast) var(--gesso-easing-default), color var(--gesso-duration-fast) var(--gesso-easing-default);
  white-space:nowrap;
}
.chip:hover{ background:rgba(255,255,255,0.09); color:var(--gesso-fg); }
.chip:focus-visible{ outline:2px solid var(--gesso-fg); outline-offset:2px; }
.chip[aria-selected="true"]{ background:var(--gesso-accent); color:var(--gesso-on-accent); }
.toolbar-meta{ font-size:12px; color:var(--gesso-fg-muted); }

.splitpane{
  display:grid; grid-template-columns:1fr 1fr; gap:16px; background:var(--gesso-charcoal);
  border-radius:var(--gesso-radius-lg); padding:16px; position:relative;
}
@media (max-width:640px){ .splitpane{ grid-template-columns:1fr; } }
.pane{ display:flex; flex-direction:column; gap:12px; min-width:0; }
.pane-label{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.pane-name{ font-size:12px; font-weight:700; color:var(--gesso-fg-muted); text-transform:uppercase; letter-spacing:0.05em; }
.pane-tag{ font-size:11px; font-weight:700; color:var(--gesso-accent-2); background:rgba(119,69,244,0.12); padding:3px 12px; border-radius:var(--gesso-radius-full); }
.pane-frame{
  position:relative; border-radius:var(--gesso-radius-md); overflow:hidden; background:var(--gesso-surface-recessed);
  aspect-ratio:4/3;
}
.pane-frame img{ width:100%; height:100%; object-fit:cover; }
.overlay-svg{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.kp{ transition:r var(--gesso-duration-fast) var(--gesso-easing-default), opacity var(--gesso-duration-fast) var(--gesso-easing-default); }
.pane-frame:hover .kp.good{ opacity:1; }
.kp.outlier{ opacity:0.85; }

.match-summary{
  display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;
  background:var(--gesso-charcoal); border-radius:var(--gesso-radius-lg); padding:16px 20px;
}
.ms-metrics{ display:flex; align-items:center; gap:32px; flex-wrap:wrap; }
.ms-metric{ display:flex; flex-direction:column; gap:2px; }
.ms-metric-label{ font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--gesso-fg-muted); }
.ms-metric-value{ font-family:var(--gesso-font-display); font-size:22px; font-weight:800; color:var(--gesso-fg); }
.ms-metric-value.accent{ color:var(--gesso-accent); }
.ms-actions{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }

/* keypoint list — data viz card */
.kp-panel{ background:var(--gesso-charcoal); border-radius:var(--gesso-radius-lg); padding:20px; display:flex; flex-direction:column; gap:16px; }
.kp-panel-head{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.kp-panel-title{ font-size:13px; font-weight:700; color:var(--gesso-fg); }
.kp-panel-count{ font-size:12px; color:var(--gesso-fg-muted); }
.kp-row{ display:flex; align-items:center; gap:12px; padding:8px 0; }
.kp-row + .kp-row{ border-top:1px solid var(--gesso-divider); }
.kp-id{ width:44px; flex-shrink:0; font-size:12px; color:var(--gesso-fg-muted); font-variant-numeric:tabular-nums; }
.kp-bar-track{ flex:1; height:8px; border-radius:var(--gesso-radius-full); background:rgba(255,255,255,0.05); overflow:hidden; }
.kp-bar-fill{ height:100%; border-radius:var(--gesso-radius-full); background:var(--gesso-accent); transition:opacity var(--gesso-duration-fast) var(--gesso-easing-default); }
.kp-row:hover .kp-bar-fill{ opacity:0.85; }
.kp-row.rejected .kp-bar-fill{ background:var(--gesso-fg-muted); }
.kp-val{ width:40px; flex-shrink:0; text-align:right; font-size:12px; font-weight:700; color:var(--gesso-fg); font-variant-numeric:tabular-nums; }

/* inspector */
.inspector{ display:flex; flex-direction:column; gap:16px; position:sticky; top:96px; }
.insp-card{ background:var(--gesso-charcoal); border-radius:var(--gesso-radius-lg); padding:20px; display:flex; flex-direction:column; gap:12px; }
.insp-hero{ background:var(--gesso-surface); border-radius:var(--gesso-radius-lg); padding:20px; display:flex; flex-direction:column; gap:8px; }
.insp-hero-label{ font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:rgba(255,255,255,0.7); }
.insp-hero-value{ font-family:var(--gesso-font-display); font-size:40px; line-height:44px; font-weight:800; color:var(--gesso-accent); }
.insp-hero-sub{ font-size:12px; color:rgba(255,255,255,0.65); }
.insp-title{ font-size:12px; font-weight:700; color:var(--gesso-fg-muted); text-transform:uppercase; letter-spacing:0.05em; }
.insp-row{ display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:13px; }
.insp-row + .insp-row{ border-top:1px solid var(--gesso-divider); padding-top:12px; margin-top:2px; }
.insp-row-label{ display:flex; align-items:center; gap:8px; color:var(--gesso-fg-muted); }
.insp-row-label svg{ width:16px; height:16px; flex-shrink:0; }
.insp-row-value{ color:var(--gesso-fg); font-weight:600; font-variant-numeric:tabular-nums; }
.rmse-bars{ display:flex; align-items:flex-end; gap:8px; height:56px; }
.rmse-bar{ flex:1; background:var(--gesso-accent); border-radius:var(--gesso-radius-full); }
</style>

<div class="shell" data-brief-id="screen-root" data-brief-role="screen">

  <header class="topbar" data-app-region="topbar" data-brief-id="topbar" data-brief-role="nav-top">
    <div class="brand">
      <div class="brand-mark"><svg data-icon="lucide/moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg></div>
      <div class="brand-text">
        <span class="brand-title">LunarMatch AI</span>
        <span class="brand-tag">AI-Powered Multi-Modal Lunar Image Registration</span>
      </div>
    </div>
    <nav class="topnav" aria-label="Primary">
      <div class="navitem" aria-current="page" role="button" tabindex="0"><svg data-icon="lucide/layout-grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></g></svg>Dashboard</div>
      <div class="navitem" role="button" tabindex="0"><svg data-icon="lucide/target" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></g></svg>Matching</div>
      <div class="navitem" role="button" tabindex="0"><svg data-icon="lucide/layers" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></g></svg>Registration</div>
      <div class="navitem" role="button" tabindex="0"><svg data-icon="lucide/bar-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 3v16a2 2 0 0 0 2 2h16m-3-4V9m-5 8V5M8 17v-3"/></svg>Analytics</div>
    </nav>
    <div class="topactions">
      <div class="icon-btn" role="button" tabindex="0"><svg data-icon="lucide/search" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21l-4.34-4.34"/><circle cx="11" cy="11" r="8"/></g></svg></div>
      <div class="icon-btn" role="button" tabindex="0"><svg data-icon="lucide/bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg></div>
      <div class="avatar">AK</div>
    </div>
  </header>

  <div class="header" data-app-region="header" data-brief-id="page-header" data-brief-role="header">
    <div class="header-top">
      <div>
        <h1 class="header-title">Live Correspondence Match Viewer</h1>
        <p class="header-sub">Field: Mare Serenitatis · Chandrayaan‑2 OHRC vs LRO‑NAC reference strip</p>
      </div>
      <div class="header-actions">
        <div class="btn btn-ghost" role="button" tabindex="0" data-brief-id="cta-rerun" data-brief-role="button"><svg data-icon="lucide/refresh-cw" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></g></svg>Re-run</div>
        <div class="btn btn-primary" role="button" tabindex="0" data-brief-id="cta-run-matching" data-brief-role="cta"><svg data-icon="lucide/zap" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>Run AI Matching</div>
      </div>
    </div>

    <div class="status" data-app-region="status" data-brief-id="status-row" data-brief-role="metrics-row">
      <div class="status-item" data-brief-id="metric-matches" data-brief-role="metric">
        <span class="status-label"><svg data-icon="lucide/git-merge" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></g></svg>Correspondences</span>
        <span class="status-value">248</span>
      </div>
      <div class="status-item" data-brief-id="metric-outliers" data-brief-role="metric">
        <span class="status-label"><svg data-icon="lucide/scan-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2m4-5h10"/></svg>Outliers Flagged</span>
        <span class="status-value">31</span>
      </div>
      <div class="status-item" data-brief-id="metric-confidence" data-brief-role="metric">
        <span class="status-label">Mean Confidence</span>
        <span class="status-value">92%</span>
      </div>
      <div class="status-item" data-brief-id="metric-rmse" data-brief-role="metric">
        <span class="status-label"><svg data-icon="lucide/ruler" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Zm-6.8-2.8l2-2m-5-1l2-2m-5-1l2-2m7 11l2-2"/></svg>Registration RMSE</span>
        <span class="status-value plain">0.8 px</span>
      </div>
    </div>
  </div>

  <div class="appgrid">
    <nav class="rail" data-app-region="rail" data-brief-id="rail-nav" data-brief-role="nav-bottom" aria-label="Sections">
      <span class="rail-section">Workspace</span>
      <div class="rail-item" aria-current="page" role="button" tabindex="0"><svg data-icon="lucide/scan" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/></svg>Correspondence</div>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/move-3d" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v16h16M5 19l6-6"/><path d="m2 6l3-3l3 3m10 10l3 3l-3 3"/></g></svg>Registration</div>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/gauge" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m12 14l4-4M3.34 19a10 10 0 1 1 17.32 0"/></svg>Accuracy Eval</div>
      <span class="rail-section">Datasets</span>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/satellite" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m13.5 6.5l-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5m7-3L19 5m-1.5 5.5l3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5M9 21a6 6 0 0 0-6-6"/><path d="M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z"/></g></svg>OHRC</div>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/aperture" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"/></g></svg>TMC‑2</div>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/waves" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2c2.5 0 2.5-2 5-2c1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1c2.5 0 2.5-2 5-2c2.6 0 2.4 2 5 2c2.5 0 2.5-2 5-2c1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1c2.5 0 2.5-2 5-2c2.6 0 2.4 2 5 2c2.5 0 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/></svg>IIRS</div>
      <div class="rail-item" role="button" tabindex="0"><svg data-icon="lucide/globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"/></g></svg>LRO‑NAC</div>
    </nav>

    <main class="worksurface" data-app-region="work-surface" data-brief-id="split-inspector" data-brief-role="section">
      <div class="toolbar">
        <div class="toolbar-group">
          <div class="chip" aria-selected="true" role="button" tabindex="0">All Matches</div>
          <div class="chip" role="button" tabindex="0">Inliers Only</div>
          <div class="chip" role="button" tabindex="0">Outliers Only</div>
          <div class="chip" role="button" tabindex="0"><svg data-icon="lucide/sliders-horizontal" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-xs" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10 5H3m9 14H3M14 3v4m2 10v4m5-9h-9m9 7h-5m5-14h-7m-6 5v4m0-2H3"/></svg>Threshold 0.7</div>
        </div>
        <span class="toolbar-meta">Tile 14/40 · OHRC 25cm/px</span>
      </div>

      <div class="splitpane" data-viz="dual-image-panel" data-brief-id="dual-image-panel" data-brief-role="viz">
        <div class="pane">
          <div class="pane-label"><span class="pane-name">Chandrayaan‑2 OHRC</span><span class="pane-tag">Source</span></div>
          <div class="pane-frame">
            <img src="https://rpreisbpsxrjwqsfeggf.supabase.co/storage/v1/object/public/direction-images/directions/cf3619e7-402e-4b68-84f6-a4ab18d23d25/5affd76797a8.jpg" alt="Chandrayaan-2 OHRC lunar surface tile" data-stock-provider="pexels" data-stock-page="https://www.pexels.com/photo/close-up-shot-of-moon-crater-10044707/" data-stock-photographer="Micotino" />
            <svg class="overlay-svg" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
              <circle class="kp good" cx="80" cy="70" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="160" cy="120" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="240" cy="90" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="300" cy="180" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="120" cy="220" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp outlier" cx="330" cy="60" r="5" fill="none" stroke="var(--gesso-error)" stroke-width="2"></circle>
              <circle class="kp outlier" cx="60" cy="240" r="5" fill="none" stroke="var(--gesso-error)" stroke-width="2"></circle>
            </svg>
          </div>
        </div>
        <div class="pane">
          <div class="pane-label"><span class="pane-name">LRO‑NAC Reference</span><span class="pane-tag">Target</span></div>
          <div class="pane-frame">
            <img src="https://rpreisbpsxrjwqsfeggf.supabase.co/storage/v1/object/public/direction-images/directions/cf3619e7-402e-4b68-84f6-a4ab18d23d25/5affd76797a8.jpg" alt="LRO-NAC reference lunar surface tile" data-stock-provider="pexels" data-stock-page="https://www.pexels.com/photo/close-up-shot-of-moon-crater-10044707/" data-stock-photographer="Micotino" />
            <svg class="overlay-svg" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
              <circle class="kp good" cx="90" cy="75" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="168" cy="126" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="246" cy="94" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="304" cy="184" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp good" cx="126" cy="224" r="4" fill="none" stroke="var(--gesso-accent)" stroke-width="2"></circle>
              <circle class="kp outlier" cx="200" cy="250" r="5" fill="none" stroke="var(--gesso-error)" stroke-width="2"></circle>
              <circle class="kp outlier" cx="350" cy="150" r="5" fill="none" stroke="var(--gesso-error)" stroke-width="2"></circle>
            </svg>
          </div>
        </div>
      </div>

      <div class="match-summary" data-brief-id="match-summary" data-brief-role="metrics-row">
        <div class="ms-metrics">
          <div class="ms-metric"><span class="ms-metric-label">Selected Match</span><span class="ms-metric-value">KP‑117</span></div>
          <div class="ms-metric"><span class="ms-metric-label">Confidence</span><span class="ms-metric-value accent">96%</span></div>
          <div class="ms-metric"><span class="ms-metric-label">Pixel Offset</span><span class="ms-metric-value">1.2 px</span></div>
        </div>
        <div class="ms-actions">
          <div class="btn btn-ghost" role="button" tabindex="0"><svg data-icon="lucide/x" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12"/></svg>Reject Outlier</div>
          <div class="btn btn-ghost" role="button" tabindex="0"><svg data-icon="lucide/check" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>Approve</div>
          <div class="btn btn-primary" role="button" tabindex="0"><svg data-icon="lucide/layers-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic ic-sm" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74zm7 .545l1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845"/></svg>Trigger Registration</div>
        </div>
      </div>

      <div class="kp-panel" data-viz="keypoint-list" data-brief-id="keypoint-list" data-brief-role="viz">
        <div class="kp-panel-head">
          <span class="kp-panel-title">Keypoint Confidence</span>
          <span class="kp-panel-count">Top 8 of 248</span>
        </div>
        <div class="kp-row"><span class="kp-id">KP‑101</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:98%"></div></div><span class="kp-val">98%</span></div>
        <div class="kp-row"><span class="kp-id">KP‑104</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:95%"></div></div><span class="kp-val">95%</span></div>
        <div class="kp-row"><span class="kp-id">KP‑109</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:93%"></div></div><span class="kp-val">93%</span></div>
        <div class="kp-row"><span class="kp-id">KP‑117</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:96%"></div></div><span class="kp-val">96%</span></div>
        <div class="kp-row"><span class="kp-id">KP‑122</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:88%"></div></div><span class="kp-val">88%</span></div>
        <div class="kp-row rejected"><span class="kp-id">KP‑135</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:41%"></div></div><span class="kp-val">41%</span></div>
        <div class="kp-row"><span class="kp-id">KP‑140</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:90%"></div></div><span class="kp-val">90%</span></div>
        <div class="kp-row rejected"><span class="kp-id">KP‑148</span><div class="kp-bar-track"><div class="kp-bar-fill" style="width:37%"></div></div><span class="kp-val">37%</span></div>
      </div>
    </main>

    <aside class="inspector" data-app-region="inspector" data-brief-id="inspector-panel" data-brief-role="section">
      <div class="insp-hero">
        <span class="insp-hero-label">Registration Accuracy</span>
        <span class="insp-hero-value">0.8 px</span>
        <span class="insp-hero-sub">RMSE vs LRO‑NAC control points</span>
      </div>

      <div class="insp-card">
        <span class="insp-title">Match Session</span>
        <div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/satellite" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m13.5 6.5l-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5m7-3L19 5m-1.5 5.5l3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5M9 21a6 6 0 0 0-6-6"/><path d="M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z"/></g></svg>Source</span><span class="insp-row-value">OHRC Tile 14</span></div>
        <section data-component="ListRow" data-brief-id="auto-listrow-7" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"/></g></svg>Reference</span><span class="insp-row-value">LRO‑NAC M182</span></div></section>
        <section data-component="ListRow" data-brief-id="auto-listrow-6" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/scan-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2m4-5h10"/></svg>Algorithm</span><span class="insp-row-value">SIFT + RANSAC</span></div></section>
        <section data-component="ListRow" data-brief-id="auto-listrow-5" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></g></svg>Runtime</span><span class="insp-row-value">4.2 s</span></div></section>
      </div>

      <section data-component="Card" data-brief-id="auto-card-4" data-brief-role="card" data-gesso-marker-wrap style="display: contents"><div class="insp-card">
        <span class="insp-title">RMSE by Tile Region</span>
        <div class="rmse-bars">
          <div class="rmse-bar" style="height:60%"></div>
          <div class="rmse-bar" style="height:40%"></div>
          <div class="rmse-bar" style="height:75%"></div>
          <div class="rmse-bar" style="height:30%"></div>
          <div class="rmse-bar" style="height:55%"></div>
          <div class="rmse-bar" style="height:20%"></div>
        </div>
      </div></section>

      <div class="insp-card">
        <span class="insp-title">Outlier Rejection</span>
        <section data-component="ListRow" data-brief-id="auto-listrow-3" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M22 3H2l8 9.46V19l4 2v-8.54z"/></svg>RANSAC Threshold</span><span class="insp-row-value">2.5 px</span></div></section>
        <section data-component="ListRow" data-brief-id="auto-listrow-2" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/trash-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>Removed</span><span class="insp-row-value">31</span></div></section>
        <section data-component="ListRow" data-brief-id="auto-listrow-1" data-brief-role="list-item" data-gesso-marker-wrap style="display: contents"><div class="insp-row"><span class="insp-row-label"><svg data-icon="lucide/check-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-icon-style="line" class="ic" style="max-width:32px;max-height:32px"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12l2 2l4-4"/></g></svg>Retained</span><span class="insp-row-value">217</span></div></section>
      </div>
    </aside>
  </div>
</div>
</body></html>
```

Use the tokens as CSS variables. Treat the reference HTML as the visual
source of truth; adapt structure to your framework, but do not deviate
from the visual system.
