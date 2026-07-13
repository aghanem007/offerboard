# Plan

## Complete
- Forum-style home page with sidebar widgets, category stats, and FAQ ticker
- Signup page with real Supabase Auth registration
- Downloads page (member-gated via Supabase session)
- Guides page (getting started, calibration, troubleshooting)
- Support page (member-gated with ticket form)
- Store page (VIP upgrade pricing — $24.99 one-time, lifetime access)
- Forum category view with topic listing, sorting, and "Create New Topic" modal
- Topic thread view with posts, replies, and reply box
- Contact page
- Terms of Service page
- Privacy Policy page
- Refund Policy page
- Password recovery page with real Supabase password reset
- Supabase Auth integration (sign up, sign in, sign out, password recovery)
- Supabase database schema (sections, categories, topics, replies, profiles)
- Database triggers for denormalized counts (topic count, post count, reply count, last reply info)
- Database views (topics_with_authors, replies_with_authors, categories_with_latest)
- RLS policies (public read, authenticated insert, author update)
- Dynamic homepage loading forum categories from database
- Async forum/topic data loading with field name mapping
- Topic and reply creation persisted to database
- View count tracking via RPC function
- Profile system with auto-generated avatar letter and color
- Auth session persistence across page navigation (via localhost server)

## Bug Fixes Applied
- Auth race condition — uses `INITIAL_SESSION` event as primary auth source
- Topbar blank after sign-out — `updateAuthUI()` restores original sign-in/sign-up buttons
- Cross-tab sign-out — `signOut()` uses `{ scope: 'local' }`
- Double alert on "Start new topic" — removed duplicate handler
- Misleading placeholder messages — updated to accurate status text

## Known Limitations
- **Auth UI flash** — Brief flash of signed-out state on page navigation (inherent to client-side auth on static HTML)
- **Requires localhost** — Must run via local web server for auth to persist across pages

## Next
1. Gate downloads and support by role (member/VIP/admin)
2. Add payment integration + VIP role assignment
3. Implement real search functionality
4. Replace placeholders with final copy and real product assets
5. Deploy to live domain
