# Offerboard

A community forum for CS students chasing their first offer — interview war stories, real salary numbers, resume roasts, and the leetcode grind.

Built with vanilla HTML/CSS/JS on Supabase (Postgres, Auth, RLS). No frameworks, no build step.

> **Status: under active development.** Full documentation, screenshots, and setup instructions are coming once the board is live.

## Quick start

```bash
# Any static server works; auth needs a real origin (not file://)
python -m http.server 3000
# open http://localhost:3000
```

Database schema lives in `db/schema.sql` — run it against a fresh Supabase project via the SQL Editor.
