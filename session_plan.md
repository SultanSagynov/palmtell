# PalmSight — Plan: How to Feed the TZ to Claude

## Core principles

1. **Always paste the full TZ at the start of every session.** It's ~2,500 tokens — cheap. Claude has no memory between sessions.
2. **One session = one module.** Don't ask Claude to build everything at once.
3. **Always ask for working, runnable code** — not pseudocode or stubs.
4. **End each session by asking Claude to output a "state summary"** — what was built, what files exist, what env vars are set. Paste this summary at the start of the next session.
5. **Use Claude.ai Projects** (if available) or Claude Code in terminal for best results. Projects keep context across sessions.

---

## Recommended tool: Claude Code

```bash
npm install -g @anthropic-ai/claude-code
cd your-project
claude
```

Claude Code works directly in your terminal, reads your actual files, runs commands, and keeps context within a working session. Far better than copy-pasting code from the chat UI.

---

## Session sequence

### SESSION 0 — Scaffold (do this once)

**Prompt:**
```
Here is the full TZ for a project called PalmSight:

[PASTE FULL palmsight_tz.md HERE]

Task: Scaffold the project. Do the following:
1. Create a Next.js 14 app with App Router (TypeScript, Tailwind CSS, shadcn/ui)
2. Install and configure Prisma with the exact schema from the TZ
3. Set up the folder structure:
   /app          - Next.js pages
   /app/api      - API routes
   /components   - UI components
   /lib          - shared utilities (db.ts, auth.ts, openai.ts, r2.ts, stripe.ts)
   /prisma       - schema.prisma
4. Create .env.local with all variables from the TZ (empty values, just the keys)
5. Configure Clerk middleware (clerkMiddleware in middleware.ts)
6. Do NOT build any UI yet — just the skeleton

Output: all files with full content, ready to run.
```

**Expected output:** project scaffold, prisma schema, .env.local template, middleware.ts

---

### SESSION 1 — Auth + User sync

**Prompt:**
```
[PASTE FULL TZ]

Project state: Next.js scaffold is done. Clerk is installed. Prisma schema matches the TZ exactly.

Task: Implement auth and user sync:
1. Clerk webhook handler at POST /api/webhooks/clerk
   - On user.created event: create users row + default Profile ("Me") in DB
   - Verify Clerk webhook signature (svix)
2. GET /api/me — returns current user + default profile + subscription status
3. Protect all /dashboard/* and /api/* routes via clerkMiddleware (already scaffolded)
4. /app/(auth)/sign-in and /app/(auth)/sign-up pages using Clerk components

All code must be complete and runnable. Use the Prisma client from /lib/db.ts.
```

---

### SESSION 2 — Palm photo upload + GPT-4o analysis

**Prompt:**
```
[PASTE FULL TZ]

Project state: Auth works. User sync works. DB has users + profiles tables.

Task: Build the palm reading pipeline (backend only, no UI yet):

1. POST /api/readings
   - Auth required (Clerk)
   - Accept multipart/form-data: { profile_id, image }
   - Upload image to Cloudflare R2 (use @aws-sdk/client-s3 with R2 endpoint)
   - Enqueue analysis job via Upstash QStash → POST /api/jobs/analyze-palm
   - Return { reading_id, status: 'processing' }

2. POST /api/jobs/analyze-palm (QStash worker, verify QStash signature)
   - Step 1: call GPT-4o (gpt-4o-mini ok) with validation prompt from TZ
     → if no_palm_detected: mark reading failed, do NOT deduct credit, return
   - Step 2: call GPT-4o with full analysis prompt, temperature: 0.3, seed: 42
   - Save analysis_json to readings table
   - Set trial_started_at + trial_expires_at on user if first reading

3. GET /api/readings/:id — return reading + status

Use exact prompts from the TZ. Return structured JSON exactly as specified.
```

---

### SESSION 3 — Access gate + section locking

**Prompt:**
```
[PASTE FULL TZ]

Project state: Readings pipeline works. DB has readings with analysis_json.

Task: Implement the access control system from the TZ:

1. Create /lib/access.ts with getAccessTier(user, subscription) function
   Returns: 'trial' | 'pro' | 'ultimate' | 'expired'
   Logic: exactly as defined in the TZ Access Gate Logic section

2. Create /lib/gate.ts with checkReadingQuota(userId, tier) function
   - trial: max 1 reading ever
   - pro: max 10/month
   - ultimate: unlimited
   - expired: block

3. Apply gate in POST /api/readings before processing

4. In GET /api/readings/:id response:
   - Return full analysis_json
   - Add a "locked_sections" array based on access tier
   - trial → [] (nothing locked)
   - expired → ['relationships','health','lucky','line_overlay','natal','horoscope','compatibility','pdf']
   - pro → ['line_overlay','natal']
   - ultimate → []

Frontend will use locked_sections to render blur overlays. Never strip data server-side.
```

---

### SESSION 4 — Stripe billing

**Prompt:**
```
[PASTE FULL TZ]

Project state: Access gate works. Readings pipeline works.

Task: Implement Stripe billing:

1. POST /api/billing/checkout
   - Auth required
   - Body: { plan: 'pro'|'ultimate', interval: 'month'|'year' }
   - Create or retrieve Stripe Customer for user
   - Create Stripe Checkout Session with correct price ID from env
   - Return { url } for redirect

2. GET /api/billing/portal
   - Return Stripe Customer Portal session URL for self-service management

3. POST /api/webhooks/stripe (verify Stripe-Signature)
   Handle these events:
   - customer.subscription.created → upsert subscriptions row, status: active
   - customer.subscription.updated → update plan + status + current_period_end
   - customer.subscription.deleted → status: canceled
   - invoice.payment_failed → status: past_due

4. Plan transitions:
   - Upgrade: proration_behavior: 'create_prorations' (immediate)
   - Downgrade: store pending_plan, apply at period end via schedule
   - On cancellation: access continues until current_period_end

Use price IDs from env vars as defined in TZ.
```

---

### SESSION 5 — Onboarding funnel (pre-auth upload)

**Prompt:**
```
[PASTE FULL TZ]

Project state: Auth, readings pipeline, access gate, and Stripe all work.

Task: Build the pre-auth onboarding funnel exactly as described in the TZ:

1. Landing page / — public, SSR, SEO metadata
   - Hero section with "Read My Palm Free" CTA
   - CTA opens palm upload flow WITHOUT requiring login

2. /try page — public upload page
   - MediaPipe Hands integration (via @mediapipe/tasks-vision CDN)
   - Camera capture (getUserMedia) OR file upload
   - Client-side hand detection before allowing submit
   - On submit: upload photo to a temp endpoint POST /api/readings/temp
     → store in R2 with temp_ prefix + session token (store token in cookie)
     → return { temp_reading_token }
   - Show preview: "Analyzing..." animation → blurred preview of Personality section
   - Show: "Create account to unlock your full reading →"

3. After Clerk registration + email verification:
   - Clerk redirects to /dashboard/reading/new?resume=true
   - This page checks for temp_reading_token cookie
   - If found: calls POST /api/readings with temp image → runs full pipeline
   - User lands on their result immediately

No re-upload required. Seamless experience.
```

---

### SESSION 6 — Dashboard + reading result UI

**Prompt:**
```
[PASTE FULL TZ]

Project state: Full backend works. Onboarding funnel works.

Task: Build the main UI — dashboard and reading result page.

Design spec from TZ:
- Dark-mode first. bg: #0F0E1A, primary: #5B4FCF, accent: #F59B0B
- Fonts: Inter (UI), Playfair Display (reading headings)
- Framer Motion stagger animations on section reveal
- Locked sections: blurred content + upgrade CTA overlay (NOT hidden)

1. /dashboard — protected
   - Profile switcher: [Me] [Anna] [+ Add] (respects profile limits by plan)
   - Reading history list per active profile
   - Trial countdown banner if in trial period: "X days of full access remaining"
   - Subscription badge (Trial / Pro / Ultimate)

2. /dashboard/reading/[id] — reading result page
   - Animated reveal of each section (Framer Motion stagger)
   - Sections: Personality, Life Path, Career (always visible)
   - Relationships, Health, Lucky Numbers, etc — blurred if locked
   - Blur overlay has: lock icon + "Unlock with Pro" button → /pricing
   - "Living palm" copy under heading: "This reading captured Feb 11, 2026"

3. /dashboard/reading/new — new reading page
   - Profile selector
   - Camera/upload UI with MediaPipe validation
   - Processing state with animation
```

---

### SESSION 7 — Emails (2 only)

**Prompt:**
```
[PASTE FULL TZ]

Project state: Full app works end-to-end.

Task: Implement the exactly 2 transactional emails from the TZ Email Rules section.
Use Resend SDK (@resend/node).

1. Welcome email — triggered from POST /api/webhooks/clerk on user.created
   - Subject: "Your palm reading is ready ✋"
   - Body: warm welcome, link to /dashboard
   - Send only after email is verified (use Clerk user.updated webhook, check email_verified)

2. Trial expiry warning — triggered by a scheduled job
   - Run daily via Upstash QStash CRON: POST /api/jobs/trial-expiry-check
   - Find all users where trial_expires_at = tomorrow (DATE trunc)
   - Send one email per user: "Tomorrow your full access changes"
   - Body: what they'll lose, upgrade CTA → /pricing

STRICT RULE from TZ: these are the ONLY 2 emails ever sent.
No promotional emails. No horoscope digests. No re-engagement.
```

---

### SESSION 8 — Horoscope module

**Prompt:**
```
[PASTE FULL TZ]

Project state: Full app works. Emails work.

Task: Build the horoscope module. In-app only — no emails sent.

1. GET /api/horoscope/daily?profile_id=
   - Get profile DOB → calculate sun sign
   - Check Redis cache key: horoscope:{sign}:{date}
   - If cached: return cached
   - If not: call Aztro API (RapidAPI) → cache in Redis (TTL: end of day)
   - Access gate: requires trial or paid plan

2. GET /api/horoscope/monthly?profile_id=
   - Pro+ only (check access tier)
   - Check Redis: horoscope:monthly:{profile_id}:{YYYY-MM}
   - If not cached: call GPT-4o with prompt:
     "Generate a personal monthly horoscope for someone born {dob}, for {month} {year}.
      Focus on: love, career, energy. Return JSON: { love, career, energy, summary }"
   - Cache in Redis (TTL: 30 days)

3. /dashboard/horoscope page
   - Profile selector
   - Daily card with sign illustration (SVG or emoji-based)
   - Monthly accordion (Pro+) — locked/blurred if expired

4. GET /api/public/horoscope/:sign — no auth, SSR, for SEO
   Returns today's horoscope for a sun sign. Used on /horoscope/[sign] pages.
```

---

### SESSION 9 — Profiles + Compatibility

**Prompt:**
```
[PASTE FULL TZ]

Project state: All core features work.

Task: Build the multi-profile system and compatibility reading.

1. Profile CRUD:
   GET /api/profiles — list all profiles for current user
   POST /api/profiles — create new profile (check plan limit: free=1, pro=3, ultimate=∞)
   PUT /api/profiles/:id — update name, dob, avatar_emoji
   DELETE /api/profiles/:id — delete non-default profile only

2. On downgrade to expired:
   Extra profiles → read-only (history visible, no new readings)
   Show banner: "You have {n} saved profiles. Upgrade to Pro to add readings for them."

3. POST /api/readings/compatibility (Pro+)
   Body: { profile_id_a, profile_id_b }
   - Both profiles must belong to the current user
   - Both must have at least 1 reading each
   - Call GPT-4o with both palm analysis_json + both DOBs:
     "Compare these two palms and birth charts. Generate a compatibility report.
      Return JSON: { overall_score: int, love, career, friendship, summary }"
   - Store result in readings table with type: 'compatibility'

4. /dashboard/compatibility page
   - Select 2 profiles → show compatibility result
   - Upgrade gate if expired/free
```

---

### SESSION 10 — SEO pages + Pricing

**Prompt:**
```
[PASTE FULL TZ]

Project state: Full app complete.

Task: Build public SEO pages and pricing.

1. / — homepage (SSR)
   generateMetadata: title "AI Palm Reading — Know Your Future | PalmSight"
   JSON-LD: WebApplication schema
   Sections: Hero (upload CTA), How it works, Features, Social proof, FAQ, CTA

2. /pricing — static
   Plan cards: Pro $9.99/mo vs Ultimate $19.99/mo
   Annual toggle (20% off)
   Feature comparison table from TZ
   CTA buttons → POST /api/billing/checkout

3. /horoscope/[sign] — SSG (generateStaticParams for all 12 signs)
   generateMetadata: "[Sign] Horoscope 2026 — Daily Reading | PalmSight"
   Fetch from /api/public/horoscope/:sign (server-side)
   JSON-LD: FAQPage

4. /learn/palmistry and /learn/palm-lines — static MDX pages
   Long-form SEO content, internal links to /free-reading

5. next-sitemap.config.js — auto-generate sitemap.xml + robots.txt
   Disallow: /dashboard, /api

All pages: Next.js generateMetadata(), canonical URLs, og:image.
```

---

## State summary template

Ask Claude to output this at the end of every session. Paste it at the start of the next one.

```
## State after Session N

### What was built:
- [list of files created/modified]

### API routes working:
- [list]

### DB tables populated:
- [list]

### Env vars needed (not yet set):
- [list of any new ones]

### What to build next:
- Session N+1: [topic]

### Known issues / decisions deferred:
- [list]
```

---

## Tips for best results with Claude

**Do:**
- Paste the full TZ every session — don't assume Claude remembers
- Ask for complete file contents, not snippets
- Say "working, runnable code — no pseudocode, no TODO comments"
- If Claude gives you broken code, paste the error back in the same session: "Running this gives: [error]. Fix it."
- Use Claude Code in terminal — it reads/writes files directly, far fewer copy-paste errors

**Don't:**
- Don't ask for everything in one session — context window fills up and quality drops
- Don't say "continue from last time" without pasting the state summary
- Don't let Claude invent new architecture — if it deviates from the TZ, say "follow the TZ exactly"
- Don't skip sessions — each session builds on the previous one's working code

**If Claude goes off-track:**
```
Stop. Refer back to the TZ. The architecture is already decided.
Follow it exactly. Don't add complexity that isn't in the spec.
```
