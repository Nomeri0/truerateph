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
  - **6 ranked providers** (real standard rates): Ria, Instarem, MoneyGram, Sendwave, Wise, Remitly. Ranked by how many pesos the family receives. #1 is highlighted.
  - **4 unranked providers** shown separately: Xoom, WorldRemit, Western Union show their **first-transfer promo** rate (gold badge, big white number); Panda Remit shows "not yet verified" (no rate found).
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

- [ ] Get a real **standard rate** for Xoom, WorldRemit, and Western Union (currently only their promo rates are known/shown).
- [ ] Find any usable rate for **Panda Remit** (currently nothing found).
- [ ] Apply to each provider's **affiliate program**, then swap the plain provider links for **affiliate links** (one-line edit per provider in `providers.json`'s `url` field).
- [ ] Talk to a **lawyer/accountant** once affiliate income starts, re: business registration and tax on commission income.
- [ ] _(Optional)_ **Create a share image** (`og:image`) — a 1200×630 picture that shows when the link is shared on social media.
- [ ] _(Optional)_ **Add a personal story** to `about.html` — there's a clearly marked, currently-empty spot for it.
- [ ] _(Optional)_ Add privacy-friendly visitor analytics, submit the sitemap to Google Search Console, add more providers over time.

A slightly more detailed version of this list, plus the story of how the site was built, lives in the [project journal](C:\Users\Nomerio\Desktop\ClaudeProjects\Journal\TrueRatePH.md).

---

## 3. Keys, config, and settings to remember 🔑

- **No API keys or passwords are needed anywhere.** Both live data sources are free and keyless:
  - **Mid-market exchange rate:** `open.er-api.com` (free, no sign-up).
  - **Provider rates (5 of them):** the **Wise comparison API** (free, no key) — `https://api.wise.com/v4/comparisons/?sourceCurrency=USD&targetCurrency=PHP&sendAmount=500`.
- **No environment variables, no secret values, no backend/server** to configure.
- **GitHub account:** username `Nomeri0`. **Git identity** used for commits: name `Nomeri0`, email is a GitHub-provided "no-reply" address (keeps the real email private) — already set locally, nothing to redo.
- **Reference amount** used for the standard comparison: **$500 USD**.
- **No local preview server is set up** (there's no `.claude/launch.json` in this folder). Since the site is already live at truerateph.com, that's the easiest way to check it — a local preview isn't necessary unless you specifically want to test unpushed changes before they go live.

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
  - **Panda Remit** — no rate found anywhere; shows as "not yet verified." (Covered by the weekly check going forward.)
  - **Xoom, WorldRemit, Western Union** — only promo rates available; shown unranked. No verified standard rate yet. (WorldRemit/Western Union covered by the weekly check; Xoom is on the daily auto-updater and will unlock itself automatically if its real rate ever drops below mid-market.)
  - **Share image (`og:image`)** — not created yet (optional).
  - **About page personal story** — spot is empty (optional).
  - **Affiliate links** — currently plain provider links; swap after joining affiliate programs.

---

## How to resume in a new chat
1. Open a new chat in this same project folder (`TrueRatePH`). Your saved memory loads automatically.
2. Say: **"Read HANDOFF.md and let's continue working on TrueRate PH."**
3. Check the [project journal](C:\Users\Nomerio\Desktop\ClaudeProjects\Journal\TrueRatePH.md) too if you want the fuller story of how it was built, or just tell the new chat what you want to work on next (e.g. "let's find WorldRemit's real rate" or "let's set up affiliate links").
