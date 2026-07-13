# Sitemap

## Main Pages
- **Home** — `index.html` — Dynamically loaded forum categories from Supabase, sidebar widgets, FAQ ticker
- **Forum** — `forum.html?id=<category>` — Category view with async topic listing, sorting, and topic creation
- **Topic** — `topic.html?id=<topic>` — Thread view with posts, replies, reply box, view tracking
- **Guides** — `guides.html` — Getting started, calibration, and troubleshooting guides
- **Downloads** — `downloads.html` — Member download hub (requires Supabase session)
- **Store** — `store.html` — VIP upgrade ($24.99 one-time, lifetime access)
- **Support** — `support.html` — Support ticket submission (requires Supabase session)
- **Contact** — `contact.html` — Contact information

## Auth Pages
- **Sign Up** — `signup.html` — Account registration via Supabase Auth (with email verification)
- **Recovery** — `recovery.html` — Password recovery via Supabase Auth

## Legal Pages
- **Terms** — `terms.html` — Terms of Service
- **Privacy** — `privacy.html` — Privacy Policy
- **Refund** — `refund.html` — Refund Policy

## Global Nav
Browse · Download · Store · Guides · Support · Upgrade to VIP

## Key JS Files
- `supabase-config.js` — Supabase client init + auth state management (`onAuthReady` pattern)
- `data/forum-api.js` — Async data layer (all database queries)
- `main.js` — Auth UI, sign in/out, global interactions
- `forum.js` — Forum and topic page rendering

## Database Schema
- `supabase-schema.sql` — Full migration file (tables, triggers, views, RLS, seed data)

## Development
```bash
# Run local server (required for auth persistence)
python -m http.server 3000

# Then open
http://localhost:3000/index.html
```

## Supabase Dashboard
- **Site URL:** `http://localhost:3000` (dev) or production domain
- **Tables:** sections, categories, topics, replies, profiles
- **Views:** topics_with_authors, replies_with_authors, categories_with_latest
- **RLS:** Public read, authenticated write
