# Marathon Report

A premium gaming analytics product for Marathon, inspired by Destiny's Trials Report. Built with intentional, handcrafted design that prioritizes information density and visual restraint over generic dashboard aesthetics.

## Design Philosophy

This is not a generic SaaS dashboard. It's a tool for serious players, designed with:

- **Dark, cinematic aesthetic** - Grounded sci-fi inspired by tactical HUDs and terminal UIs
- **High information density** - Every pixel serves the data, no wasted space
- **Restrained color usage** - Dark surfaces with surgical accent application
- **Strong typography** - Type hierarchy does the heavy lifting
- **Minimal animations** - Subtle, purposeful interactions only

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom configuration)
- **React 18**

## Setup Instructions

### 1. Install Dependencies

```bash
cd marathon-report
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
marathon-report/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with global nav
│   │   ├── page.tsx           # Home page
│   │   ├── player/[id]/       # Player profile pages
│   │   └── match/[id]/        # Match detail pages
│   ├── components/
│   │   ├── layout/            # Global navigation, search
│   │   ├── player/            # Player-specific components
│   │   ├── match/             # Match-specific components
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── mock-data.ts       # Mock data for development
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── tailwind.config.ts         # Custom Tailwind theme
├── tsconfig.json
└── package.json
```

## Key Pages

### Home Page (`/`)
- Landing page with search functionality
- Quick stats overview
- Link to sample player profile

### Player Profile (`/player/[id]`)
- Player header with rank, level, platform
- Stats grid with filterable views (Overall, Last 10, Last 50, This Week, Season)
- Recent matches list
- Recently played with players
- Weapon usage statistics

### Match Detail (`/match/[id]`)
- Match header with map, mode, duration
- Two-column team breakdown
- Individual player statistics
- Top performer highlighting

## Design System

### Typography

- **Display Font**: Inter (geometric, precise)
- **Monospace**: JetBrains Mono (for stats/numbers)

### Color Palette

```
Background:
- Base: #0a0a0a
- Elevated: #111111
- Surface: #181818

Text:
- Primary: #e5e5e5
- Secondary: #a1a1a1
- Tertiary: #6b6b6b

Accents:
- Primary (Success): #00ff88
- Danger: #ff4444
- Warning: #ffaa00
- Info: #4488ff
```

### Spacing Scale
4px, 8px, 12px, 16px, 24px, 32px, 48px

### Border Radius
Minimal - 0px, 2px, 4px, 6px

## Mock Data

The application includes comprehensive mock data in `src/lib/mock-data.ts`:
- Player profiles with multi-timeframe stats
- Match history with detailed player performance
- Recently played with data
- Weapon usage statistics

## Next Steps (Future Development)

1. **Backend Integration**
   - Replace mock data with real API calls
   - Add data fetching with React Server Components
   - Implement caching strategy

2. **Additional Features**
   - Player search with autocomplete
   - Leaderboards
   - Seasonal rankings
   - Detailed weapon analytics
   - Clan/team statistics

3. **Performance Optimizations**
   - Image optimization
   - Code splitting
   - Progressive loading of match history

4. **Real-time Updates**
   - WebSocket integration for live data
   - Auto-refresh on data updates

## Contributing

This is a demonstration project showcasing premium product design for gaming analytics.

## License

MIT
