# AndroSky

AndroSky is a gamified task management platform wrapped in a cosmic-themed experience. It combines personal and professional productivity with real-time collaboration, role-based access, and an admin-managed content system — all built on Next.js and Supabase.

---

## What It Does

- **Landing experience** — animated, theme-rich public pages introducing the platform.
- **Authentication** — email + phone-based login/register with role routing (user, leader, admin).
- **Dashboard** — protected workspace for task management, clusters, achievements, leaderboard, rewards, and settings.
- **Admin board** — full admin panel for managing users, posts, analytics, messages, logs, and rewards.
- **Transmission Hub** — public blog/news system backed by Supabase with categories, read-time estimates, and view tracking.
- **Public pages** — Missions, Galaxy Map, Command Center, Clusters, Academy, Terms, Privacy.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Database & Auth | Supabase (PostgreSQL + Realtime) |
| Styling | Tailwind CSS 4 |
| Icons | Material Symbols Outlined |
| Language | JavaScript |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)
- A Supabase project

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the project root with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database

Run the SQL in `sql.md` against your Supabase database to create tables, triggers, and seed default roles.

### Run

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.js                        # Root layout with metadata & star background
│   ├── page.js                          # Landing page
│   ├── globals.css                      # Global styles
│   ├── (auth)/
│   │   ├── login/page.jsx               # Login page
│   │   └── register/page.jsx            # Registration page
│   ├── dashboard/
│   │   ├── layout.js                    # Dashboard layout with sidebar
│   │   ├── page.jsx                     # Dashboard home
│   │   ├── tasks/page.jsx               # Task management
│   │   ├── cluster/page.jsx             # Cluster overview
│   │   ├── cluster/[id]/page.jsx        # Cluster detail
│   │   ├── leaderboard/page.jsx         # Leaderboard
│   │   ├── achievements/page.jsx        # Achievements
│   │   ├── rewards/page.jsx             # Rewards center
│   │   └── settings/page.jsx            # User settings
│   ├── adminboard/
│   │   ├── layout.js                    # Admin layout
│   │   ├── page.jsx                     # Admin home
│   │   ├── analytics/page.jsx           # Admin analytics
│   │   ├── logs/page.jsx                # System logs
│   │   ├── messages/page.jsx            # Admin messages
│   │   ├── posts/page.jsx               # Posts management
│   │   ├── posts/new/page.jsx           # Create post
│   │   ├── rewards/page.jsx             # Manage rewards
│   │   └── users/page.jsx               # User management
│   ├── (public)/
│   │   ├── transmission-hub/            # Blog / news listing
│   │   │   ├── page.jsx
│   │   │   ├── [slug]/page.jsx
│   │   │   └── [slug]/not-found.jsx
│   │   ├── terms/page.jsx               # Terms of service
│   │   ├── privacy/page.jsx             # Privacy policy
│   │   ├── missions/page.jsx            # Missions page
│   │   ├── galaxymap/page.jsx           # Galaxy map
│   │   ├── command-center/page.jsx      # Command center
│   │   ├── clusters/page.jsx            # Clusters discovery
│   │   └── academy/page.jsx             # Academy / learning
│   └── api/
│       └── posts/
│           ├── route.js                 # GET posts list
│           └── [slug]/route.js          # GET single post + increment views
├── component/
│   ├── landing/                         # Public landing components
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── StandoutFeatures.jsx
│   │   ├── USPSection.jsx
│   │   ├── CTASection.jsx
│   │   ├── ContactSection.jsx
│   │   ├── ContactForm.jsx
│   │   └── Footer.jsx
│   ├── dashboard/                       # Dashboard shared UI
│   │   ├── Sidebar.jsx
│   │   ├── SidebarContent.jsx
│   │   ├── MobileSidebar.jsx
│   │   └── TaskModal.jsx
│   └── adminboard/                      # Admin shared UI
│       └── Sidebar.jsx
└── lib/
    └── supabase.js                      # Supabase client initialization
```

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | User profiles, roles, XP, coins, levels |
| `clusters` | Groups with leader, join codes, member counts |
| `user_clusters` | Membership and contribution tracking |
| `posts` | Blog content with categories, read time, view counts |

Key constraints and triggers enforce phone uniqueness (max 2 accounts per number), role validation, automatic timestamps, and cluster member count synchronization.

---

## Authentication Flow

1. User submits email + phone on login/register pages.
2. App queries or inserts the user in the `users` table.
3. Session state is stored in `localStorage` under `nebula_session`.
4. Dashboard layout validates the session; missing or invalid sessions redirect to login.
5. Admin routes (`/adminboard`) are accessible to users with the `admin` role.

---

## Visual Design

- Dark-mode cosmic theme with animated star fields, shooting stars, and nebula glow effects.
- Color palette built around deep space backgrounds, purple/pink/cyan accents.
- Typography: Space Grotesk (headings), Inter (body), JetBrains Mono (code/labels).
- Glass-morphism cards with backdrop blur and subtle borders.

---

## License

Proprietary and confidential.
© 2026 AndroSky. All rights reserved.
