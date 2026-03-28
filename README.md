# VidMetrics — YouTube Competitor Analysis Tool

Paste a YouTube channel URL and instantly see which videos are crushing it. Built for the VidMetrics Vibe Coder Product Developer challenge.

**Live Demo:** [vidmetrics-ten.vercel.app](https://vidmetrics-ten.vercel.app)

---

## Features

- **Channel Analysis** — Paste any YouTube channel URL, @handle, or name to fetch video performance data
- **Video Metrics Table** — Views, likes, comments, engagement rate with sortable columns
- **Date Filtering** — Filter videos by 7 days, 30 days, 3 months, or all time
- **Search** — Search within fetched videos by title
- **Performance Charts** — Top videos bar chart (configurable Top 5/10/20 with log scale) and engagement trend area chart (7D/14D/30D/All)
- **Channel Comparison** — Compare up to 3 channels side-by-side with grouped bar chart, head-to-head metrics table, and overall winner detection
- **Trending Badges** — Top 3 videos flagged as trending
- **CSV Export** — Download video data as CSV
- **Dark/Light Theme** — Toggle with persisted preference
- **Mobile Responsive** — Card-based video layout on mobile, full table on desktop
- **Pagination** — 10 videos per page with Previous/Next controls

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Fonts:** Geist Sans + Geist Mono
- **API:** YouTube Data API v3
- **Testing:** Jest + ts-jest
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- YouTube Data API v3 key ([get one here](https://console.cloud.google.com/apis/library/youtube.googleapis.com))

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/DaminiPandey/VidMetrics.git
cd VidMetrics
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root:

```
YOUTUBE_API_KEY=your_youtube_api_key_here
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

## Project Structure

```
src/
├── app/
│   ├── api/channel/     # YouTube API route handler
│   ├── globals.css       # Design system tokens + theme variables
│   ├── layout.tsx        # Root layout with Geist fonts
│   └── page.tsx          # Main page component
├── components/
│   ├── ChannelCard.tsx    # Channel info display with stats
│   ├── CompareChannels.tsx # Channel comparison feature
│   ├── PerformanceChart.tsx # Bar + area charts with filters
│   ├── ThemeToggle.tsx    # Dark/light theme switcher
│   └── VideoTable.tsx     # Video list with sort/filter/pagination
├── lib/
│   ├── useTheme.ts        # Theme-aware colors hook for charts
│   ├── utils.ts           # Formatting utilities
│   └── youtube.ts         # YouTube API helpers
├── __tests__/
│   ├── api-channel.test.ts # API route tests
│   ├── utils.test.ts       # Utility function tests
│   └── youtube.test.ts     # Channel resolution tests
docs/
├── specs/
│   ├── channel-comparison.md  # Comparison feature spec
│   └── design-system.md       # Complete design system guide
└── CHALLENGE_BRIEF.md         # Original challenge requirements
```

## Design Decisions

- **YouTube-inspired dark theme** with teal accent — connects to the platform while feeling like a premium analytics tool
- **Geist + Geist Mono** fonts — clean UI text with monospace numbers for data readability
- **Server-side API route** — protects the YouTube API key, never exposed to the client
- **Mobile card layout** — tables don't work on small screens, so videos display as compact cards on mobile
- **Color-coded engagement** — blue (high), amber (medium), rose (low) for quick visual scanning

## AI Tools Used

- **Claude Code (Anthropic)** — AI pair programming for rapid development, code generation, and iterative UI refinement

---

Built with Next.js, Tailwind CSS & YouTube Data API
