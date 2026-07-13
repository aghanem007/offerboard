# Status

## Complete
- Home page layout and styling with dynamically loaded forum categories from Supabase
- Logo integrated
- Forum category view (`forum.html`) — async topic listing, sorting via database queries
- Topic thread view (`topic.html`) — posts, replies, author info, reply box with database persistence
- Topic creation modal with rich text editor toolbar — creates topics in database
- Reply system — creates replies in database, auto-updates counts via triggers
- Guides page (getting started, calibration, troubleshooting)
- Support page (member-gated via Supabase session)
- Store page (VIP upgrade pricing — $24.99 one-time, lifetime access)
- Downloads page (member-gated via Supabase session)
- Signup page — real account creation via Supabase Auth with email verification
- Password recovery page — real password reset via Supabase Auth
- Contact page
- Terms of Service page
- Privacy Policy page
- Refund Policy page
- Supabase Auth across all pages (sign in, sign out, session persistence)
- Global dark theme with consistent styling
- Database schema deployed (sections, categories, topics, replies, profiles)
- Database triggers for denormalized counts
- Database views for joined queries
- RLS policies for public read, authenticated write
- View count tracking on topic pages
- Profile system with auto-generated avatar letter/color and post count

## Architecture
- `supabase-config.js` — Supabase client init, auth state management (`onAuthReady` callback pattern)
- `data/forum-api.js` — Async data layer replacing static `data/forums.js`
- `main.js` — Auth UI (sign in via `supabase.auth.signInWithPassword`, sign out, session check)
- `forum.js` — Async forum/topic rendering using database views
- `supabase-schema.sql` — Full database migration (tables, triggers, views, RLS, seed data)

## Development Setup
**Important:** Must run via local web server, not `file://` protocol.

```bash
# Option 1: Python
python -m http.server 3000

# Option 2: Node (don't use clean URLs)
npx serve . -S
```

Then open `http://localhost:3000/index.html`

**Why?** Browsers treat each `file://` page as a separate origin, so localStorage (auth sessions) isn't shared between pages.

## Supabase Configuration
- Site URL must be set to `http://localhost:3000` for local development
- For production, update to the live domain

## Testing
- Sign up creates a real account in Supabase Auth with profile auto-created via trigger
- Sign in uses real email/password authentication
- Member-gated pages (downloads, support) check Supabase session via `onAuthReady`
- Forum/topic pages query Supabase views (`topics_with_authors`, `replies_with_authors`)
- Homepage queries `categories_with_latest` view for live category data

## Known Limitations
- **Auth UI flash** — Brief flash of "Sign In" buttons before showing "Welcome, username" on page navigation. This is inherent to client-side auth on static HTML. Solutions would require server-side rendering or converting to a Single Page App.

## Pending
- Role-based access control (member/VIP/admin)
- Payment integration for VIP upgrades
- Real search functionality
- Final copy and product assets
- Deployment to live domain
