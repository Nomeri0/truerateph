# TrueRate PH — Project Handoff

_A plain-language summary to resume the project in a fresh chat. Written for a non-developer._

**Project folder:** `C:\Users\Nomerio\Desktop\ClaudeProjects\TrueRatePH\`
**What it is:** A website that helps people sending money from the US to the Philippines see which provider gives their family the most pesos. It's an information/comparison site — it never touches money.
**How to view it locally:** Ask the new chat to "start the TrueRate PH site" (it runs a small local server at http://localhost:5500). It shuts down between sessions — that's normal.

---

## 1. Current state — what's built and working ✅

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
- [x] **SEO**: search titles + descriptions, Facebook/Messenger share tags, a favicon (₱ icon), `robots.txt`, `sitemap.xml`, and structured data.
- [x] **Auto-updater built** (see section 4).
- [x] **Everything saved in Git** (version control) — ~15 saved snapshots, all committed, nothing unsaved.

**Nothing is currently broken.**

---

## 2. What's left to do before launch 🚀

- [ ] **Host the site online** (recommended: GitHub Pages — free). This is the main remaining step. See section 4.
- [ ] **Replace the placeholder web address**: the code currently uses `truerate-ph.example.com` as a stand-in. After hosting, swap it for your real address in these spots (all marked with `TODO(hosting)` comments): the `canonical` and `og:url` lines in `index.html`, `results.html`, and `about.html`; plus `sitemap.xml` and `robots.txt`.
- [ ] **Turn on the auto-updater** — it activates automatically once the project is on GitHub (nothing to install).
- [ ] _(Optional)_ **Create a share image** (`og:image`) — a 1200×630 picture that shows when the link is shared on Facebook. Without it, shares still work (just no picture).
- [ ] _(Optional)_ **Add your personal story** to `about.html` — there's a clearly marked spot (`▼▼▼ ADD YOUR PERSONAL STORY HERE ▼▼▼`).

**After launch (not blockers):**
- [ ] Apply to each provider's **affiliate program** (they usually need a live site to approve you).
- [ ] Swap the plain provider links for **affiliate links** — a one-line edit per provider in `providers.json` (the `url` field).
- [ ] Talk to a **lawyer** about the cross-border/affiliate setup before earning; handle **business registration + tax** on commission income.

---

## 3. Keys, config, and settings to remember 🔑

- **No API keys or passwords are needed anywhere.** Both live data sources are free and keyless:
  - **Mid-market exchange rate:** `open.er-api.com` (free, no sign-up).
  - **Provider rates (5 of them):** the **Wise comparison API** (free, no key) — `https://api.wise.com/v4/comparisons/?sourceCurrency=USD&targetCurrency=PHP&sendAmount=500`.
- **No environment variables, no secret values, no backend/server** to configure.
- **Git identity** (local placeholder, safe to change): name `Nomerio Maralit`, email `nomerio@truerate.local`. We'll set up a real GitHub "no-reply" email during hosting so your personal email stays private.
- **Reference amount** used for the standard comparison: **$500 USD**.
- **Local preview:** a Python web server on **port 5500** (config named `truerate` in `.claude/launch.json`).

---

## 4. Deployment / launch process (was about to start) 🛠️

We had **not started** hosting yet. The planned steps (GitHub Pages, free):

- [ ] Create a **GitHub account** (if you don't have one).
- [ ] Set up your **git identity + GitHub no-reply email** (keeps your real email private).
- [ ] Create a **GitHub repository** and upload the `TrueRatePH` folder to it.
- [ ] Turn on **GitHub Pages** (serve the site from the main branch).
- [ ] Get your **live web address**.
- [ ] Do the **placeholder swap** from section 2 (replace `example.com` with your real address).
- [ ] Confirm the **auto-updater** turned on (check the repo's "Actions" tab).
- [ ] **Test the live site** end to end.

**The auto-updater, explained:**
- `update_rates.py` = the "engine." It refreshes the 5 auto providers from the free Wise feed and the live mid-market rate, and leaves the manual providers alone. You can run it by hand any time with `python update_rates.py`.
- `.github/workflows/update-rates.yml` = the "timer." Once the site is on GitHub, this runs the engine automatically (daily) so rates stay fresh with no effort. It's dormant until then.

---

## 5. Tricky decisions & things not obvious from the code 🧠

- **Standard rates only (big one):** We rank by each provider's **normal everyday rate**, NOT their flashy one-time "first-transfer promo." Promos mislead repeat senders (most of the audience) and are shown separately, clearly labeled. This is the site's core trust principle.
- **The `verified` flag in `providers.json`** controls where a provider shows up: `true` = ranked (real standard rate); `false` + a rate = promo shown in the unranked section (gold badge); `false` + empty rate = "pending / not yet verified."
- **Automatic promo guardrail:** The updater flags any auto rate that comes back *above* the mid-market rate as a promo (you can't legitimately beat the true rate), so it drops to the unranked tier by itself. That's why **Xoom** is unranked.
- **Delivery speeds were removed on purpose:** the old "Minutes / 1 day" labels were guesses, not real data, and they clashed with the fees (e.g., Remitly's "No fee" is the slow economy option, not the instant one). Cards now show only **"Bank deposit"** (the honest comparison basis). Fees shown are for bank deposit; faster options cost more (there's a note saying so).
- **Only 5 providers have a free data source** (via the Wise feed). The other 5 have no public API and are updated by hand. Getting their *standard* rate is hard because their sites hide it behind promos/logins — the long-term fix is affiliate data feeds, not scraping.
- **Do NOT add money-handling or automated logins.** Staying a pure info/referral site keeps you out of heavy financial regulation. Automated login-scraping is fragile, often against terms, and Claude won't handle your passwords.
- **Cache-busting version numbers:** links like `styles.css?v=8` and `script.js?v=5` have a number that we bump whenever the file changes, so browsers load the new version instead of an old cached one. `providers.json` is fetched with "never cache" so rates are always fresh.
- **Known tool quirk (not a site bug):** the browser preview's *screenshot* tool often times out in this environment. Everything was verified by inspecting the page directly instead. The site itself is fine.
- **Windows line-ending warnings** (LF/CRLF) appear on every git commit — harmless, ignore them.

---

## 6. Broken / half-finished ⚠️

- **Nothing is broken.**
- **Pending by design (not bugs):**
  - **Panda Remit** — no rate found anywhere; shows as "not yet verified."
  - **Xoom, WorldRemit, Western Union** — only promo rates available; shown unranked. No verified standard rate yet.
  - **Share image (`og:image`)** — not created yet (optional).
  - **Real web address** — still the `example.com` placeholder (waiting for hosting).
  - **About page personal story** — spot is empty (optional).
  - **Affiliate links** — currently plain provider links; swap after joining programs.
  - **Auto-updater timer** — dormant until hosted.

---

## How to resume in a new chat
1. Open a new chat in this same project folder (`TrueRatePH`). Your saved memory loads automatically.
2. Say: **"Read HANDOFF.md and let's continue — I want to host the site."**
3. The new chat can start the local preview and pick up from section 4.
