# ویڈیو اسٹوڈیو — vidgen-saas-v2 (no login)

Open the link → Video Studio → paste script → Generate → download. No accounts, no auth.
Stack: Next.js 14 (Vercel) + Supabase (database + storage only) + FFmpeg worker (Render, Docker).

## Setup
1. **Supabase**: new project → SQL Editor → run `supabase/schema.sql`. Copy Project URL + `service_role` key.
2. **Pexels**: get a free key at pexels.com/api.
3. **GitHub**: create a PRIVATE repo and upload this folder's files (unzip first).
4. **Render** → New Web Service → your repo → Root Directory `worker`, Runtime Docker, Free.
   Env: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PEXELS_API_KEY`. Copy its URL.
5. **Vercel** → New Project → same repo (root). Env: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `WORKER_URL`. Deploy.

(Vercel's dashboard cannot take a raw ZIP; import from GitHub, or run `npx vercel` from the unzipped folder.)

## Notes
- Anyone with your link can use it. Built-in guard: one render at a time, 10 videos/hour per visitor, 2000-character scripts. Keep the link private.
- Optional music: add `music.mp3` (licensed) to `worker/assets/`.
- Render free tier is slow (4-10 min/video) and sleeps when idle.
- Delete old videos from Supabase Storage -> videos now and then (1 GB free).
- The old admin panel was removed with the login system.
