# VidMetrics Design System

## 1. Brand Identity

**Product:** VidMetrics — YouTube Competitor Analysis Tool
**Personality:** Professional, data-driven, modern, YouTube-connected
**Design Philosophy:** Dark analytics dashboard inspired by YouTube's aesthetic, elevated with teal accents and premium data presentation.

---

## 2. Color Palette

### Base Colors
| Token              | Hex         | CSS Variable            | Usage                            |
|--------------------|-------------|-------------------------|----------------------------------|
| Background         | `#0f0f0f`   | `--color-bg-base`       | Page background                  |
| Surface            | `#1a1a2e`   | `--color-bg-surface`    | Cards, panels, elevated areas    |
| Surface Hover      | `#222240`   | `--color-bg-surface-hover` | Card/row hover state          |
| Surface Active     | `#2a2a50`   | `--color-bg-surface-active` | Active/selected state         |
| Overlay            | `#0f0f0fcc` | `--color-bg-overlay`    | Modal overlays, backdrops        |

### Border Colors
| Token              | Hex         | CSS Variable            | Usage                            |
|--------------------|-------------|-------------------------|----------------------------------|
| Border Default     | `#2a2a4a`   | `--color-border`        | Card borders, dividers           |
| Border Hover       | `#3a3a5a`   | `--color-border-hover`  | Hover state borders              |
| Border Focus       | `#2dd4bf`   | `--color-border-focus`  | Input focus rings                |

### Text Colors
| Token              | Hex         | CSS Variable            | Usage                            |
|--------------------|-------------|-------------------------|----------------------------------|
| Primary            | `#ffffff`   | `--color-text-primary`  | Headings, key metrics, bold text |
| Secondary          | `#a1a1aa`   | `--color-text-secondary`| Labels, descriptions, body text  |
| Muted              | `#6b7280`   | `--color-text-muted`    | Timestamps, placeholders, hints  |
| Inverse            | `#0f0f0f`   | `--color-text-inverse`  | Text on light/accent backgrounds |

### Accent Colors
| Token              | Hex         | CSS Variable            | Usage                            |
|--------------------|-------------|-------------------------|----------------------------------|
| Teal               | `#2dd4bf`   | `--color-accent`        | Primary CTAs, active states      |
| Teal Hover         | `#14b8a6`   | `--color-accent-hover`  | Button/link hover                |
| Teal Dim           | `#2dd4bf15` | `--color-accent-dim`    | Teal tinted backgrounds          |
| Teal Glow          | `#2dd4bf30` | `--color-accent-glow`   | Focus rings, subtle glows        |

### Semantic Colors
| Token              | Hex         | CSS Variable            | Usage                            |
|--------------------|-------------|-------------------------|----------------------------------|
| YouTube Red        | `#ff0000`   | `--color-yt-red`        | YouTube icon, brand moments      |
| YouTube Red Dim    | `#ff000020` | `--color-yt-red-dim`    | Trending badge background        |
| Success            | `#22c55e`   | `--color-success`       | High engagement (>5%)            |
| Success Dim        | `#22c55e15` | `--color-success-dim`   | Success badge background         |
| Warning            | `#eab308`   | `--color-warning`       | Medium engagement (2-5%)         |
| Warning Dim        | `#eab30815` | `--color-warning-dim`   | Warning badge background         |
| Danger             | `#ef4444`   | `--color-danger`        | Low engagement (<2%)             |
| Danger Dim         | `#ef444415` | `--color-danger-dim`    | Danger badge background          |

---

## 3. Typography

### Font Families
| Usage              | Font           | Weight Range | Fallback                    |
|--------------------|----------------|-------------|------------------------------|
| UI / Body          | Geist          | 400–700     | system-ui, sans-serif        |
| Metrics / Numbers  | Geist Mono     | 400–700     | ui-monospace, monospace      |

### Type Scale
| Name       | Size     | Weight   | Line Height | Letter Spacing | Usage                        |
|------------|----------|----------|-------------|----------------|------------------------------|
| Display    | 36px     | 700      | 1.1         | -0.02em        | Hero heading                 |
| H1         | 28px     | 700      | 1.2         | -0.02em        | Page/section titles          |
| H2         | 22px     | 600      | 1.3         | -0.01em        | Card titles, chart headings  |
| H3         | 18px     | 600      | 1.4         | 0              | Sub-section headers          |
| Body       | 14px     | 400      | 1.5         | 0              | General body text            |
| Body Bold  | 14px     | 600      | 1.5         | 0              | Emphasized body text         |
| Small      | 12px     | 400      | 1.4         | 0              | Captions, timestamps         |
| Tiny       | 10px     | 600      | 1.3         | 0.02em         | Badges, duration overlays    |
| Metric LG  | 24px     | 700      | 1.1         | -0.01em        | Large stat numbers (mono)    |
| Metric MD  | 16px     | 600      | 1.2         | 0              | Table metric numbers (mono)  |
| Metric SM  | 13px     | 500      | 1.2         | 0              | Inline metric numbers (mono) |

---

## 4. Spacing System

Based on 4px grid:
| Token  | Value | Usage                              |
|--------|-------|------------------------------------|
| xs     | 4px   | Icon gaps, tight padding           |
| sm     | 8px   | Inline element spacing             |
| md     | 12px  | Input padding, small card padding  |
| base   | 16px  | Standard padding and gaps          |
| lg     | 20px  | Card padding                       |
| xl     | 24px  | Section padding                    |
| 2xl    | 32px  | Between sections                   |
| 3xl    | 48px  | Major section gaps                 |
| 4xl    | 64px  | Page top/bottom padding            |

---

## 5. Border Radius

| Token    | Value | Usage                              |
|----------|-------|------------------------------------|
| sm       | 6px   | Small buttons, badges, pills       |
| md       | 8px   | Inputs, small cards                |
| lg       | 12px  | Cards, panels                      |
| xl       | 16px  | Large cards, chart containers      |
| full     | 9999px| Pill buttons, avatars, tags        |

---

## 6. Component Patterns

### Pill Buttons (Filters)
```
Active:   bg-accent text-inverse rounded-full px-4 py-1.5 font-semibold text-sm
Inactive: bg-transparent border border-border text-secondary rounded-full px-4 py-1.5 text-sm
Hover:    border-border-hover text-primary
```

### Cards
```
Default:  bg-surface border border-border rounded-xl p-5
Hover:    bg-surface-hover border-border-hover (transition 200ms)
```

### Input Fields
```
Default:  bg-surface border border-border rounded-lg px-4 py-3 text-primary placeholder:text-muted
Focus:    border-accent ring-1 ring-accent-glow outline-none
```

### Primary Button
```
Default:  bg-accent text-inverse rounded-lg px-6 py-3 font-semibold
Hover:    bg-accent-hover
Disabled: opacity-50 cursor-not-allowed
```

### Metric Display
```
Number:   font-mono font-bold text-primary (Metric LG/MD/SM scale)
Label:    font-sans text-secondary text-sm
Icon:     text-muted w-4 h-4, inline before label
```

### Trending Badge
```
Container: bg-yt-red-dim rounded-full px-2.5 py-0.5
Text:      text-[#ff6b6b] font-semibold text-tiny uppercase tracking-wide
```

### Engagement Rate Badge
```
High (>5%):    bg-success-dim text-success
Medium (2-5%): bg-warning-dim text-warning
Low (<2%):     bg-danger-dim text-danger
All:           rounded-full px-2 py-0.5 font-mono text-sm font-medium
```

### Table Rows
```
Default:  border-b border-border
Hover:    bg-surface-hover (transition 150ms)
Header:   bg-surface text-secondary font-medium text-sm uppercase tracking-wider
```

---

## 7. Icon System

Use inline SVG icons for key metrics. Keep icons at consistent sizes:
| Context          | Size   |
|------------------|--------|
| Inline metrics   | 16x16  |
| Navigation       | 20x20  |
| Hero/feature     | 24x24  |

Key icons needed:
- Eye (views)
- Thumbs up (likes)
- Message circle (comments)
- Clock (duration/time)
- Trending up (trending indicator)
- Download (export)
- Search (search input)
- External link (YouTube link)
- Bar chart (analytics)

---

## 8. Charts

| Property        | Value                     |
|-----------------|---------------------------|
| Line color      | `#2dd4bf` (accent teal)   |
| Grid lines      | `#2a2a4a` (border)        |
| Axis labels     | `#6b7280` (text-muted)    |
| Tooltip bg      | `#1a1a2e` (surface)       |
| Tooltip border  | `#2a2a4a` (border)        |
| Bar fill        | `#2dd4bf` (accent teal)   |
| Bar secondary   | `#2dd4bf40` (accent dim)  |
| Area fill       | `#2dd4bf10` (subtle fill) |

---

## 9. Shadows & Effects

| Token           | Value                                   | Usage                 |
|-----------------|-----------------------------------------|-----------------------|
| Card shadow     | `0 0 0 1px var(--color-border)`         | Default card border   |
| Glow            | `0 0 20px var(--color-accent-glow)`     | Focus state emphasis  |
| Overlay shadow  | `0 8px 32px rgba(0,0,0,0.5)`           | Modals, dropdowns     |

---

## 10. Transitions

| Property        | Duration | Easing              |
|-----------------|----------|----------------------|
| Colors/bg       | 150ms    | ease-in-out          |
| Transform       | 200ms    | ease-out             |
| Opacity         | 150ms    | ease-in-out          |
| Layout          | 300ms    | ease-in-out          |

---

## 11. Responsive Breakpoints

| Name   | Min Width | Usage                                    |
|--------|-----------|------------------------------------------|
| sm     | 640px     | Stack to single column below this        |
| md     | 768px     | Tablet — adjust card grid                |
| lg     | 1024px    | Desktop — full layout                    |
| xl     | 1280px    | Wide desktop — max content width         |

### Responsive Rules
- Max content width: `1280px` (centered)
- Mobile: single column, full-width cards, horizontal scroll for tables
- Tablet: 2-column grid where applicable
- Desktop: full layout as designed
