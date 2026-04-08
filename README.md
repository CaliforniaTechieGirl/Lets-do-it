# Let's Do It 🎉
### A collaborative list of fun things to do

A personal date-planning app for a couple in Palo Alto, CA.

## Features

- **List** — expandable cards with Where, When, Cost, Good to Know, View Website, Map, Add to Calendar, Like, Mark as Done, Archive
- **Calendar** — dated events on a monthly calendar; undated ideas in an "Anytime" section below
- **Map** — all locations plotted on a Bay Area map with pin-tap detail cards
- **Suggest** — AI-powered suggestions via the Claude API, tailored to your existing list
- **Archive** — dated events can be archived once they've passed, with a Restore option
- **Likes** — shared across users (stored in shared storage); each person picks a name on first visit
- **Add to Calendar** — one-click `.ics` download for any idea

## Tech Stack

- React 18 + Vite
- No CSS framework — plain inline styles
- Storage: `window.storage` (Claude artifacts) with automatic fallback to `localStorage` (Vercel / local dev)
- AI suggestions: Anthropic `/v1/messages` API (Claude Sonnet)

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework preset: **Vite** (auto-detected)
4. Before clicking Deploy, go to **Environment Variables** and add:
   ```
   ANTHROPIC_API_KEY = your-key-here
   ```
   Get a key at [console.anthropic.com](https://console.anthropic.com)
5. Click Deploy — done ✓

The API key lives only on Vercel's servers — it is never sent to the browser.

## Adding New Ideas

Edit `src/data.js` — add a new object to `DEFAULT_IDEAS` following the existing schema:

```js
{
  id: 12,                          // unique integer
  title: "My New Idea",
  emoji: "🎭",
  location: "Full address, City, CA",
  lat: 37.4419,                    // accurate coordinates
  lng: -122.1430,
  when: "Saturdays 2–5 PM",
  eventDate: null,                 // or "YYYY-MM-DD" for fixed dates
  cost: "$20/person",
  costBadge: "$40 for 2",          // short badge text
  description: "...",
  notes: ["tip 1", "tip 2"],
  tags: ["Outdoor", "Active"],     // see TAG_COLORS in data.js for all options
  link: "https://...",
}
```

## Project Structure

```
date-ideas/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component, all state + tabs
    ├── data.js               # Ideas data + tag colours + storage keys
    ├── storage.js            # Claude / localStorage adapter
    ├── utils.js              # ICS generator, Google Maps URL
    └── components/
        ├── IdeaCard.jsx      # Expandable idea card
        ├── CalendarView.jsx  # Monthly calendar + Anytime section
        ├── MapView.jsx       # Bay Area pin map
        ├── SuggestionsPanel.jsx  # AI suggestions via Claude API
        └── ArchiveView.jsx   # Archived ideas
```
