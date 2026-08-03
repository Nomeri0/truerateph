# TrueRate PH — Project Handoff

_A plain-language summary to resume the project in a fresh chat. Written for a non-developer._

**Project folder:** `C:\Users\Nomerio\Desktop\ClaudeProjects\TrueRatePH\`
**Live at:** https://truerateph.com
**What it is:** A website that helps people sending money from the US to the Philippines see which provider gives their family the most pesos. It's an information/comparison site — it never touches money.

---

## 1. Current state — what's built and working ✅

- [x] **Live and hosted.** Real domain `truerateph.com`, HTTPS on, hosted free via GitHub Pages from the repo at `https://github.com/Nomeri0/truerateph`.
- [x] **Three pages**: `index.html` (landing), `results.html` (the comparison list), `about.html` ("Why we built this").
- [x] **Live mid-market rate** on the landing page — pulls the real USD→PHP rate on each visit (free source, no key), with a fallback number if offline.
- [x] **"You send" amount box** with up/down arrow buttons (each click = $15) and typing. The amount carries into the results page.
- [x] **Results page** builds itself from a single data file (`providers.json`):
  - **7 ranked providers** (real standard rates): Ria, Instarem, MoneyGram, Sendwave, Wise, Remitly, Panda Remit. Ranked by how many pesos the family receives. #1 is highlighted.
  - **3 unranked providers** shown separately: Xoom, WorldRemit, and Western Union all show a **promo rate** (gold badge, big white number) — none has a confirmed standard rate yet.
  - Recalculates and re-sorts **live with a slide animation** as the amount changes.
  - **"Your family gets ₱X more"** savings callout (best vs. worst).
  - **"Send with…" buttons** open each provider's real website in a new tab.
- [x] **Honesty features**: "rates last verified" date, standard-vs-promo note, a disclaimer (rates are estimates; we're not a money transfer provider), and a commission disclosure.
- [x] **SEO**: search titles + descriptions, Facebook/Messenger share tags, a favicon (₱ icon), `robots.txt`, `sitemap.xml`, canonical URLs — all pointing at the real `truerateph.com` domain now.
- [x] **Two auto-refresh systems** (see section 4):
  - Daily script for the 5 providers with a free data feed.
  - Weekly scheduled Claude task for the 5 providers without one (browses each site by hand, updates data, pushes live, and sends a push notification only when a rate actually changes).
- [x] **Everything saved in Git** (version control), pushed to GitHub, nothing unsaved.

**Nothing is currently broken.** (A display bug where a pending provider card showed the word "undefined" was found and fixed after launch.)

---

## 2. What's left / ideas for later 🚀

Nothing here is blocking — the site works fully as-is.

**Scope decision (2026-07-28): this project is a portfolio exhibit, not a business.** The goal is a polished, live product to point to when showing off what's been built with AI, plus maybe a little passive affiliate income — not competing with the big remittance-comparison apps. This reshuffled the backlog below: things that only matter if you're trying to be a complete/authoritative comparison tool got dropped; things that make it look and feel like a real, finished product got promoted.

**Active backlog — parked until there's time, pull this list out whenever asked "what's next":**
- [x] **Brand identity — colors.** Applied 2026-08-02, from `content/TrueRatePH Brand Strategy.pdf` (local-only, gitignored — see section 3 for the hex values now baked into `styles.css`). Fonts and logo are still open — the strategy doc only specifies "a clean, confident geometric sans" (no named font) and a wordmark treatment, not an actual logo mark. Pull this back out when ready to pick a font and/or commission a logo.
- [ ] **Add a personal story** to `about.html` — there's a clearly marked, currently-empty spot for it. Matters more now since the site doubles as a portfolio piece with a story behind it.
- [x] **Submit the sitemap to Google Search Console.** Done 2026-08-02 — site verified (verification meta tag lives in `index.html`) and `sitemap.xml` submitted. Search/traffic data will start showing up in Search Console over the following days/weeks.
- [x] **Add privacy-friendly visitor analytics.** Done 2026-08-02 — GoatCounter tracking snippet added to all 3 pages, pushed live. Dashboard: `truerateph.goatcounter.com` (sign in there to see visit stats; no cookie-consent banner needed since it's cookieless/privacy-friendly).

**On hold (2026-08-02) — revisit once the site has real traffic/traction:**
- **Affiliate links.** Research already done 2026-08-02 — see `content/affiliate-programs-research.md` for the full breakdown, don't redo it. Short version: 8 of 10 providers route through 3 affiliate networks (Impact → Ria/WorldRemit/Panda Remit; Partnerize → Wise/Instarem; FlexOffers → Remitly/MoneyGram/Western Union), 5 of those are high-confidence/branded programs, 3 are network-listed-only. Xoom and Sendwave don't have a usable program. Deliberately paused because several of these programs weigh site traffic in approval, and a pre-traction site is likely to get rejected — better to apply once there's something to point to. When resumed: sign up for the 3 networks and apply to each program (account creation + likely tax/payout info, which Claude can't do on the user's behalf) — then it's a quick one-line-per-provider edit in `providers.json`'s `url` field once approved.

**Deliberately dropped, given the scope decision above — do not resurface these unless the scope changes again:**
- Finding real standard rates for Xoom, WorldRemit, Western Union, and Panda Remit (only matters for being a complete/authoritative comparison tool, not an exhibit). Panda Remit was briefly (and incorrectly) marked as ranked on 2026-08-01 — see section 6 for the correction made 2026-08-02.
- Any deeper SEO investment beyond what's already done (content strategy, backlinks, keyword targeting) — growth-business work, not exhibit polish.
- Talking to a lawyer/accountant re: business registration — revisit only if/when real affiliate income actually starts flowing.
- Share image (`og:image`), adding more providers over time — nice-to-haves, low priority, only if it comes up naturally.

A slightly more detailed version of this list, plus the story of how the site was built, lives in the [project journal](C:\Users\Nomerio\Desktop\ClaudeProjects\Journal\TrueRatePH.md).

---

## 3. Keys, config, and settings to remember 🔑

- **No API keys or passwords are needed anywhere.** Both live data sources are free and keyless:
  - **Mid-market exchange rate:** `open.er-api.com` (free, no sign-up).
  - **Provider rates (5 of them):** the **Wise comparison API** (free, no key) — `https://api.wise.com/v4/comparisons/?sourceCurrency=USD&targetCurrency=PHP&sendAmount=500`.
- **No environment variables, no secret values, no backend/server** to configure.
- **GitHub account:** username `Nomeri0`. **Git identity** used for commits: name `Nomeri0`, email is a GitHub-provided "no-reply" address (keeps the real email private) — already set locally, nothing to redo.
- **Reference amount** used for the standard comparison: **$500 USD**.
- **Brand color palette** (from `content/TrueRatePH Brand Strategy.pdf`, applied 2026-08-02): Base `#0E0F1A`, Peso Green `#2FBF71` (primary accent — gains/highlights), Warm Gold `#E8B93F` (promo badge), Alert/Loss `#E2694B` (reserved — not yet used anywhere on the site, only for illustrating an actual loss if that need comes up), Text Primary `#F4F5F7`, Text Muted `#9298A8`. Live in `styles.css`'s `:root` block.
- **Local preview:** a `truerate` config exists in the root `.claude/launch.json` (one level up, shared across all projects in this workspace) serving this folder on port 5500 — use it to check unpushed changes before they go live. Since the site is also always live at truerateph.com, that works too for anything already pushed.
- **Visitor analytics:** GoatCounter, dashboard at `truerateph.goatcounter.com` (sign in with the account created 2026-08-02 to view stats). Free, cookieless — no consent banner needed. Tracking snippet lives at the bottom of all 3 HTML pages.

---

## 4. How rates stay up to date 🔄

**Daily (automatic, no oversight needed):**
- `update_rates.py` = the "engine." Refreshes Wise, Remitly, MoneyGram, Instarem, and Xoom from the free Wise feed + live mid-market rate.
- `.github/workflows/update-rates.yml` = the "timer." Runs the engine automatically every day on GitHub's servers and pushes any changes.

**Weekly (automatic, notifies on real changes):**
- A Claude scheduled task (`truerateph-weekly-manual-rate-check`, runs Fridays 3pm) checks the 5 providers with no public data feed — Ria, Sendwave, WorldRemit, Western Union, Panda Remit — by visiting each site directly, and updates/pushes `providers.json` if a rate changed. A push notification is sent only on runs where something actually changed. Manage/reschedule it from the Scheduled section of the app sidebar.

---

## 5. Tricky decisions & things not obvious from the code 🧠

- **Standard rates only (big one):** We rank by each provider's **normal everyday rate**, NOT their flashy one-time "first-transfer promo." Promos mislead repeat senders (most of the audience) and are shown separately, clearly labeled. This is the site's core trust principle.
- **The `verified` flag in `providers.json`** controls where a provider shows up: `true` = ranked (real standard rate); `false` + a rate = promo shown in the unranked section (gold badge); `false` + empty rate = "pending / not yet verified."
- **Automatic promo guardrail:** The daily updater flags any auto rate that comes back *above* the mid-market rate as a promo (you can't legitimately beat the true rate), so it drops to the unranked tier by itself. That's why **Xoom** is unranked.
- **Delivery speeds were removed on purpose:** the old "Minutes / 1 day" labels were guesses, not real data, and they clashed with the fees. Cards now show only **"Bank deposit"** (the honest comparison basis). Fees shown are for bank deposit; faster options cost more (there's a note saying so).
- **Only 5 providers have a free data source** (via the Wise feed). The other 5 are checked weekly by hand (see section 4). Getting their *standard* rate is hard because their sites hide it behind promos/logins — the long-term fix is affiliate data feeds, not scraping.
- **Do NOT add money-handling or automated logins.** Staying a pure info/referral site keeps you out of heavy financial regulation. Automated login-scraping is fragile, often against terms, and Claude won't handle your passwords.
- **Cache-busting version numbers:** links like `styles.css?v=8` and `script.js?v=6` have a number that gets bumped whenever that file changes, so browsers load the new version instead of an old cached one. `providers.json` is fetched with "never cache" so rates are always fresh.
- **DNS/HTTPS notes:** the domain was bought through Namecheap; 4 A records point the bare domain at GitHub Pages' IPs, and a CNAME points `www` at the GitHub Pages address. GitHub auto-issues the HTTPS certificate once DNS checks out (took under an hour here) — nothing to renew manually.
- **Windows line-ending warnings** (LF/CRLF) appear on every git commit — harmless, ignore them.

---

## 6. Broken / half-finished ⚠️

- **Nothing is broken.**
- **Pending by design (not bugs):**
  - **Xoom, WorldRemit, Western Union, Panda Remit** — only promo rates available; shown unranked. No verified standard rate yet. (WorldRemit/Western Union/Panda Remit covered by the weekly check; Xoom is on the daily auto-updater and will unlock itself automatically if its real rate ever drops below mid-market.) Panda Remit was briefly marked ranked on 2026-08-01 after the weekly check misread its rate table — the "$2.99 struck through to $0" is a fee discount *inside* a table explicitly labeled "new customers only," not a standard-vs-promo split; the rate itself (62.4748, above mid-market) only ever appears as part of that new-customer package. Caught and reverted to unranked 2026-08-02 (also above the live mid-market rate, the same tell that already flags Xoom). The weekly-check task's instructions were updated with this specific case so it isn't misread again.
  - **Share image (`og:image`)** — not created yet (optional).
  - **About page personal story** — spot is empty (optional).
  - **Affiliate links** — currently plain provider links; swap after joining affiliate programs.

---

## How to resume in a new chat
1. Open a new chat in this same project folder (`TrueRatePH`). Your saved memory loads automatically.
2. Say: **"Read HANDOFF.md and let's continue working on TrueRate PH."**
3. Check the [project journal](C:\Users\Nomerio\Desktop\ClaudeProjects\Journal\TrueRatePH.md) too if you want the fuller story of how it was built, or just tell the new chat what you want to work on next (e.g. "let's find WorldRemit's real rate" or "let's set up affiliate links").
