# 🌌 NebulaTasks

### *"Where every task becomes a cosmic achievement, and productivity meets the stars - collaborate, conquer, and celebrate in the nebula realm."*

---

## Project Overview

NebulaTasks is a revolutionary gamified task management platform that transforms mundane productivity into an interstellar journey. Users can manage personal and professional tasks, form collaborative clusters (private groups), earn cosmic rewards, and experience celebration effects - all within a stunning nebula-themed universe.

**Take a look:** [Coming Soon]   
**Status:**  Under Active Development

---

##  Key Features

###  Passwordless Authentication
- Email-based login with environmental salt mixing
- No passwords, no OTP - just your email
- JWT-based session management (30-day expiry)
- Secure HTTP-only cookies

###  Dual Reality Registry
- **Personal Realm:** Individual task management (warm purple/pink tones)
- **Professional Realm:** Work-focused tasks (cool blue/cyan tones)
- Seamless toggle with orbiting planets animation

###  Private Clusters (Groups)
- Create private clusters with unique 5-character alphanumeric codes
- Join via code only - no public discovery
- Max 50 members per cluster
- Real-time presence tracking
- Collaborative quests and shared tasks

###  Gamification Engine
- **XP System:** Level up from Nova Seed (L1) to Galaxy Sovereign (L20)
- **Nebula Coins (₦):** Earn through tasks, redeem for real-life rewards
- **Achievements:** Constellation badges with unlock conditions
- **Leaderboards:** Global, Cluster, and Friends rankings

###  Real-Life Rewards
- Track and redeem coins for real activities:
  - 500₦ = Coffee Break
  - 1,000₦ = Episode Night
  - 2,000₦ = Food Freedom
  - 5,000₦ = Movie Marathon
  - 10,000₦ = Experience Day

###  Feature Unlocks
- Level 1: Basic Tasks & Personal Realm
- Level 5: Habits Tracker
- Level 6: Join Clusters
- Level 10: Advanced Analytics
- Level 15: Goal Tracking
- Level 20: Mentor Mode

###  Visual Experience
- Animated nebula background (Three.js)
- Glass-morphism card design
- Celebration poppers on task completion
- Shooting star effects for cluster achievements
- Constellation progress visualization

---

##  Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (App Router) | React framework with SSR |
| **Styling** | Tailwind CSS + Framer Motion | Utility-first CSS + animations |
| **Backend** | Supabase | PostgreSQL + Auth + Realtime |
| **Database** | PostgreSQL (Supabase) | Primary data store |
| **Real-time** | Supabase Realtime | WebSocket connections |
| **Deployment** | Vercel | Edge-optimized hosting |
| **Monitoring** | Sentry + Logtail | Error tracking + logging |

### Database Schema (PostgreSQL)

```sql
-- Core tables structure
users: id, email_hash, username, total_xp, nebula_coins, current_level
tasks: id, assigned_to, cluster_id, realm_type, title, difficulty, status, xp_reward
clusters: id, name, unique_code (5-char), created_by, member_count
cluster_members: cluster_id, user_id, role, contribution_points
achievements: id, name, requirement_type, reward
user_achievements: user_id, achievement_id, earned_at
task_dependencies: task_id, depends_on_task_id
task_assignees: task_id, user_id, is_completed
api_keys: id, user_id, key_hash, permissions

```
## Project Structure
```code

nebulatasks/
├── src/
│   ├── app/
│   │   ├── layout.jsx              # Root layout with metadata
│   │   ├── page.jsx                # Landing page (completed)
│   │   ├── dashboard/
│   │   │   └── page.jsx            # Main dashboard (WIP)
│   │   ├── auth/
│   │   │   ├── login/page.jsx      # Login screen
│   │   │   └── register/page.jsx   # Registration
│   │   └── cluster/
│   │       ├── [id]/page.jsx       # Cluster detail view
│   │       └── create/page.jsx     # Create cluster flow
│   ├── component/
│   │   ├── landing/                # ✅ Completed
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Pricing.jsx
│   │   │   └── Footer.jsx
│   │   ├── dashboard/              # 🚧 In Progress
│   │   │   ├── TaskCard.jsx
│   │   │   ├── RealmToggle.jsx
│   │   │   ├── ClusterWidget.jsx
│   │   │   └── RewardsPanel.jsx
│   │   ├── ui/                     # Reusable component
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Celebration.jsx
│   │   │   └── NebulaBackground.jsx
│   │   └── cluster/
│   │       ├── JoinModal.jsx
│   │       ├── CreateModal.jsx
│   │       └── MemberList.jsx
│   ├── lib/
│   │   ├── supabase.js             # Supabase client config
│   │   ├── auth.js                 # Passwordless auth logic
│   │   ├── gamification.js         # XP, levels, rewards
│   │   └── constants.js            # Game constants
│   ├── hooks/
│   │   ├── useAuth.js              # Auth state hook
│   │   ├── useRealtime.js          # Real-time subscriptions
│   │   └── useCluster.js           # Cluster operations
│   ├── utils/
│   │   ├── helpers.js              # Utility functions
│   │   └── validation.js           # Input validation
│   └── styles/
│       └── globals.css             # Tailwind + custom styles
├── public/
│   ├── images/                     # Static assets
│   └── fonts/                      # Custom fonts (Orbitron, Inter)
├── supabase/
│   └── migrations/                 # Database migrations
├── .env.local                      # Environment variables
├── tailwind.config.js
├── next.config.js
└── package.json

```


## Entry Flow 
1. User enters email
2. System adds SALT from .env to email
3. Creates SHA-256 hash
4. Stores { email_hash, email_original } in DB
5. Returns JWT token (limited time access)
6. Redirects to dashboard

## Design Inspiration
 - NASA astronomy pictures for nebula backgrounds
 -  Destiny 2 UI for orbital elements
 -   Apple design for glass-morphism
 -  Habitica for gamification patterns


## License

This project is proprietary and confidential.
© 2026 NebulaTasks. All rights reserved.
