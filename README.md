# Pixel Forum

A forum-style website for Pixel, built with vanilla HTML, CSS, and JavaScript, backed by Supabase for authentication and data persistence.

## Overview

Pixel Forum is a community website featuring forum categories, topic threads, user guides, a download hub, a store page, and support — all styled with a modern dark theme. Forum data, user accounts, and posts are stored in Supabase (PostgreSQL).

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Homepage with dynamically loaded forum categories, sidebar widgets, and scrolling FAQ ticker |
| Forum | `forum.html` | Category view — lists topics from database, sorting, and a "Create New Topic" modal |
| Topic | `topic.html` | Topic thread view — posts, replies, author info, and reply box (persisted to DB) |
| Guides | `guides.html` | User guides for getting started, calibration, and troubleshooting |
| Downloads | `downloads.html` | Member download hub (requires sign-in) |
| Store | `store.html` | VIP upgrade ($24.99 one-time, lifetime access) |
| Support | `support.html` | Support request submission (member-gated) |
| Sign Up | `signup.html` | Account registration via Supabase Auth |
| Recovery | `recovery.html` | Password recovery via Supabase Auth |
| Contact | `contact.html` | Contact information |
| Terms | `terms.html` | Terms of Service |
| Privacy | `privacy.html` | Privacy Policy |
| Refund | `refund.html` | Refund Policy |

## Features

- **Forum browsing** — Browse forum categories on the homepage with live stats, last-post info, and category icons loaded from the database
- **Topic threads** — View topics with full post content, author details (avatar, join date, post count), timestamps, and threaded replies
- **Sorting & filtering** — Sort topics by newest, most replies, most views, or recently updated (handled server-side)
- **Topic creation** — Create new topics via a modal with a text editor toolbar; topics are persisted to the database
- **Reply system** — Post replies to topics; reply counts, last reply info, and post counts update automatically via database triggers
- **Real authentication** — Sign up, sign in, sign out, and password recovery via Supabase Auth
- **Profile system** — Auto-generated avatar letter and color on signup, post count tracking
- **Member-gated content** — Downloads and support pages require sign-in to access
- **View tracking** — Topic view counts increment automatically on page load
- **User guides** — Getting started, calibration, and troubleshooting documentation
- **Store / VIP** — VIP upgrade with one-time pricing
- **Support tickets** — Submit support requests (gated behind authentication)
- **Legal pages** — Terms of Service, Privacy Policy, and Refund Policy

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, flexbox, grid, animations
- **Vanilla JavaScript** — no frameworks or dependencies
- **Supabase** — PostgreSQL database, Auth, Row Level Security, database triggers
- **Google Fonts** — IBM Plex Sans, Space Grotesk

## Project Structure

```
├── index.html              # Homepage (dynamic forum sections)
├── forum.html              # Forum category view
├── topic.html              # Topic thread view
├── guides.html             # User guides
├── downloads.html          # Member download hub
├── store.html              # Store / VIP page
├── support.html            # Support request page
├── signup.html             # Registration form (Supabase Auth)
├── recovery.html           # Password recovery (Supabase Auth)
├── contact.html            # Contact info
├── terms.html              # Terms of Service
├── privacy.html            # Privacy Policy
├── refund.html             # Refund Policy
├── styles.css              # Global stylesheet
├── main.js                 # Core JavaScript (auth, UI interactions)
├── forum.js                # Forum/topic page logic (async, Supabase-backed)
├── supabase-config.js      # Supabase client init + auth state management
├── supabase-schema.sql     # Database schema migration (tables, triggers, views, seed data)
├── data/
│   └── forum-api.js        # Async data layer (Supabase queries)
├── assets/
│   └── logo_no_bg_best.png # Site logo
└── docs/
    ├── PLAN.md             # Development roadmap
    ├── STATUS.md           # Project status tracker
    └── SITEMAP.md          # Site map and navigation
```

## Run Locally

**Important:** Must run via local web server for authentication to work properly.

```bash
# Python
python -m http.server 3000

# Then open
http://localhost:3000/index.html
```

Do **not** open files directly via `file://` — browsers treat each file as a separate origin, breaking auth session persistence.

## Authentication

The site uses Supabase Auth for real user accounts:

1. **Sign Up** — `signup.html` creates a real account via `supabase.auth.signUp()` with email verification
2. **Sign In** — Click "Existing user? Sign In" in the top bar, enter email and password
3. **Sign Out** — Click "Sign Out" button (replaces sign-in link when authenticated)
4. **Password Recovery** — `recovery.html` sends a real password reset email via `supabase.auth.resetPasswordForEmail()`

Sessions persist across pages via Supabase's built-in session management.

## Database

The Supabase database includes:

- **`sections`** — Forum sections (Pixel, Guides, Safety & Policy, Community, Development, Management)
- **`categories`** — Forum categories with denormalized topic/post counts
- **`topics`** — User-created topics with title, content, view count, reply tracking
- **`replies`** — Threaded replies linked to topics
- **`profiles`** — Extended user profiles with avatar letter, color, and post count

Database triggers automatically maintain denormalized counts (topic count, post count, reply count, last reply info) on insert/delete.

Three database views simplify queries:
- `topics_with_authors` — topics joined with author and last replier profiles
- `replies_with_authors` — replies joined with author profiles
- `categories_with_latest` — categories with section info and latest topic details

## Supabase Setup

1. Create a Supabase project
2. Run `supabase-schema.sql` in the SQL Editor to create tables, triggers, views, and seed data
3. Set **Site URL** to `http://localhost:3000` in Authentication > URL Configuration
4. Update the credentials in `supabase-config.js` with your project URL and anon key

## Status

### Completed
- All page layouts and styling (13 pages)
- Forum category browsing with sidebar widgets
- Topic thread view with replies
- Topic creation modal with rich text editor
- Supabase Auth integration (sign up, sign in, sign out, password recovery)
- Supabase database (tables, triggers, views, RLS policies, seed data)
- Dynamic homepage loading categories from database
- Async forum/topic data loading from database
- Topic and reply creation persisted to database
- View count tracking
- Profile system with auto-generated avatars
- Member-gated downloads and support
- User guides documentation
- Store/VIP page
- Legal pages (terms, privacy, refund)

### Planned
- Role-based access (member/VIP/admin permissions)
- Payment integration for VIP upgrades
- Real search functionality
- Deployment to live domain
