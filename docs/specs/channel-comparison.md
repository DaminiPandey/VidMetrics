# Channel Comparison Feature Spec

## Overview
Allow users to compare up to 3 YouTube channels side-by-side, showing key metrics and visual comparisons.

## User Flow
1. User analyzes a channel (existing flow)
2. A "Compare" button appears in the results section
3. Clicking opens a modal/inline input to add more channels (max 3 total)
4. Comparison dashboard renders below with all channels

## UI Layout

### Comparison Header
- 3 channel cards side-by-side (responsive: stack on mobile)
- Each tagged with a color: teal (A), amber (B), rose (C)
- Shows: avatar, name, handle, subscriber count

### Comparison Metrics
- Grouped bar chart comparing:
  - Average views per video
  - Average engagement rate
  - Total subscribers
  - Upload frequency (videos per month)
- Each channel's bar uses its assigned color

### Implementation
- New component: `CompareChannels.tsx`
- Reuse existing `/api/channel` route (call it per channel)
- Store comparison channels in page state
- Calculate aggregate metrics from video data

## Color Assignments
| Slot | Color   | Tailwind             |
|------|---------|----------------------|
| A    | Teal    | `#2dd4bf` (accent)   |
| B    | Amber   | `#f59e0b`            |
| C    | Rose    | `#f472b6`            |
