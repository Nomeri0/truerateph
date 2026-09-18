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
  - **4 ranked providers** as of 2026-09-18 (real standard rates): Ria, Instarem, Sendwave, Wise (was 6 until Remitly and MoneyGram were pulled for stale data — they should return once the weekly check confirms fresh rates). Ranked by how many pesos the family receives. #1 is highlighted.
  - **Unranked providers** shown separately: WorldRemit, Western Union, and Panda Remit show a **promo rate** (gold badge, big white number); Remitly and MoneyGram show "Standard rate not yet verified"; Xoom likewise.
  - Recalculates and re-sorts **live with a slide animation** as the amount changes.
  - **"Your family gets ₱X more"** savings callout (best vs. worst).
  - **"Send with…" buttons** open each provider's real website in a new tab.
- [x] **Honesty features**: "rates last verified" date, standard-vs-promo note, a disclaimer (rates are estimates; we're not a money transfer provider), and a commission disclosure.
- [x] **SEO**: search titles + descriptions, Facebook/Messenger share tags, a favicon (₱ icon), `robots.txt`, `sitemap.xml`, canonical URLs — all pointing at the real `truerateph.com` domain now.
- [x] **Two auto-refresh systems** (see section 4):
  - Daily script for the providers still in the free data feed (Wise, Instarem, Xoom — Xoom is currently missing from the feed, see section 6).
  - Weekly scheduled Claude task for the 7 providers without one (Ria, Sendwave, WorldRemit, Western Union, Panda Remit, plus Remitly and MoneyGram as of 2026-09-18; browses each site by hand, updates data, pushes live, and sends a push notification only when a rate actually changes).
- [x] **Everything saved in Git** (version control), pushed to GitHub, nothing unsaved.

**Nothing is currently broken.** (A display bug where a pending provider card showed the word "undefined" was found and fixed after launch.)

---

## 2. What's left / ideas for later 🚀

Nothing here is blocking — the site works fully as-is.

**Scope decision (2026-08-03, supersedes the 2026-07-28 one below): this is now a real growth attempt, not just a portfolio exhibit.** New strategy: pair the site with a YouTube channel, and try to make TrueRatePH one of the top information sites for OFWs (Overseas Filipino Workers) worldwide. Phase 1 (first ~6 months from 2026-08-03): US market only — the corridor the user knows and can speak to confidently. At the 6-month mark, recalibrate: go deeper (more corridors/countries) or let it go, based on real traction. Blog/article content on the site will mostly be **repurposed from YouTube videos** (video/script first, article second), not written from scratch — see `content/` for how writing collaboration works (outline-then-draft or draft-then-polish, user's choice, never an unprompted full rewrite).

Practical effect on the backlog: things dropped below on 2026-07-28 specifically *because* this was "just an exhibit, not a business" no longer have that reasoning holding them back — see the reopened items just below. Items dropped for other reasons (legal/registration, low-priority nice-to-haves) are unaffected by this pivot and stay dropped.

*(Original 2026-07-28 framing, kept for history: "this project is a portfolio exhibit, not a business... not competing with the big remittance-comparison apps." That framing is what's now changed.)*

**Active backlog — parked until there's time, pull this list out whenever asked "what's next":**
- [x] **Brand identity — colors.** Applied 2026-08-02, from `content/TrueRatePH Brand Strategy.pdf` (local-only, gitignored — see section 3 for the hex values now baked into `styles.css`). Fonts and logo are still open — the strategy doc only specifies "a clean, confident geometric sans" (no named font) and a wordmark treatment, not an actual logo mark. Pull this back out when ready to pick a font and/or commission a logo.
- [ ] **Add a personal story** to `about.html` — there's a clearly marked, currently-empty spot for it. Matters more now since the site doubles as a portfolio piece with a story behind it.
- [x] **Submit the sitemap to Google Search Console.** Done 2026-08-02 — site verified (verification meta tag lives in `index.html`) and `sitemap.xml` submitted. Search/traffic data will start showing up in Search Console over the following days/weeks.
- [x] **Add privacy-friendly visitor analytics.** Done 2026-08-02 — GoatCounter tracking snippet added to all 3 pages, pushed live. Dashboard: `truerateph.goatcounter.com` (sign in there to see visit stats; no cookie-consent banner needed since it's cookieless/privacy-friendly).

**Reopened 2026-08-03 given the new growth strategy (previously dropped as exhibit-only, see history below) — not yet prioritized/sequenced, surface next time "what's next" is asked:**
- **Finding real standard rates for Xoom, WorldRemit, Western Union, and Panda Remit.** Now matters for real — being a complete/authoritative comparison tool is the whole point of the new strategy, not just nice-to-have. (Panda Remit was briefly, incorrectly, marked ranked on 2026-08-01 on bad data — corrected 2026-08-02, see section 6. That correction stands regardless of this reopening — don't re-rank it without a genuinely verified standard rate.)

**Channel pivot (2026-09-16): SEO/blog is now the primary growth lever, YouTube is paused, not dropped.** Status check going into this decision: ~6 weeks into the Aug 2026 growth push, zero commits since 2026-08-15 that weren't bot rate-refreshes, GoatCounter/Search Console traffic near-zero or unchecked, and four fully-written pieces of content sitting unpublished in `content/` since 2026-07-26 (YouTube build-story script, LinkedIn post, X thread, TikTok script) plus a locked 9-section outline for the "Pinoy Field Notes" channel's first video from 2026-08-04 — none of it ever went out. User's realistic bandwidth going forward: **2-4 hrs/week**. Given that, and given the YouTube-channel plan was the more time-intensive, lower-leverage path (filming/editing vs. writing), the user chose to focus on **SEO/written content on the site itself** instead. Pinoy Field Notes and the unpublished scripts aren't deleted or ruled out — just not the active plan; revisit if the SEO push stalls or bandwidth increases.
- [x] **Blog infrastructure — built 2026-09-16.** `blog/index.html` (listing page) plus the pattern for individual posts (`blog/<slug>.html`, copy `about.html`'s `<head>` boilerplate, article body reuses `.about-h2`/`.about-body`/`.about-list` — no new typography system). Linked from the footer of `index.html`, `results.html`, and `about.html`; added to `sitemap.xml`. `styles.css` bumped to `?v=12` (added `.post-card`/`.post-title`/`.post-date`/`.post-excerpt`/`.post-list-empty`/`.article-meta`). Verified in the browser: all nav links resolve, no console errors.
- [x] **Article #1 published — 2026-09-16.** [`blog/why-your-rate-drops-after-first-transfer.html`](blog/why-your-rate-drops-after-first-transfer.html) — "Why Your Money Transfer Rate Gets Worse After the First Send," the standard-vs-promo differentiator angle. Linked from `blog/index.html` and `sitemap.xml`. Reuses the $500/61.9-vs-58.2/₱2,000 numbers already established in `content/x-post.md`/`content/youtube-script.md` for brand consistency. Committed and pushed (`24d13be`); confirmed live at truerateph.com (HTTP 200) on 2026-09-18.
- **10-article backlog planned 2026-09-16 — write in this exact order whenever "post an article" is asked, don't reshuffle without the user explicitly asking to:**
  1. [ ] "Wise vs. Remitly: Which Actually Gives You More Pesos in 2026?" — head-to-head using `providers.json` data.
  2. [ ] "MoneyGram vs. Ria vs. Instarem: Which One Should You Actually Use?" — second head-to-head, same pattern.
  3. [ ] "What Is the Mid-Market Rate, and Why It's the Only Number That Matters?" — foundational explainer, links to the site's live rate ticker.
  4. [~] **DRAFTED 2026-09-18, not yet published** — "7 Signs a Money Transfer App Is Hiding Its Real Rate From You" — [`blog/signs-app-is-hiding-its-real-rate.html`](blog/signs-app-is-hiding-its-real-rate.html). Direct sequel to article #1's angle, generic (no provider names), ~1,100 words, example numbers are clearly hypothetical so it won't go stale. Pulled ahead of #1-#3 on 2026-09-18 because #1/#2 are blocked on fresh Remitly/MoneyGram rates (see section 6). **Still to do to publish:** user review (optional spot for a personal anecdote in the intro is marked with an HTML comment), then add to `blog/index.html` + `sitemap.xml`, commit, push. **Later:** once article #3 exists, link its "mid-market rate" definition to it (TODO comment at the top of the file).
  5. [ ] "Bank Deposit vs. Cash Pickup vs. GCash: Which Gets Your Family Paid Fastest?" — delivery-method guide (a dimension deliberately dropped from the results page itself, see section 5 — the article can cover it in prose even though the site doesn't rank by it).
  6. [ ] "How Much Does It Really Cost to Send Money to the Philippines?" — fees vs. exchange-rate markup explainer.
  7. [ ] "Sending Money to the Philippines for the First Time? Here's What Nobody Tells You" — top-of-funnel/beginner piece.
  8. [ ] "The Cheapest Way to Send $500 to the Philippines Right Now" — reuses the site's own $500 reference amount; designed as a living page to refresh periodically rather than rewrite.
  9. [ ] "Sending Money Home for Christmas: Don't Let the Holiday Rush Cost You" — seasonal; publish by early November 2026 so it's indexed in time.
  10. [ ] "Does Timing Actually Matter? Best Day and Time to Send Money to the Philippines" — myth-busting mechanism piece, closes out the series.
- **Content angle:** lead with TrueRatePH's actual differentiator — the standard-vs-promo-rate distinction — rather than competing head-on for generic high-competition terms like "send money to Philippines" (already dominated by WorldRemit, CompareRemit, SendMoneyCompare, Monito, and the providers' own blogs). Long-tail, specific comparison content (e.g. provider-vs-provider, "why your rate gets worse after the first transfer") is the realistic wedge at zero domain authority.
- **Cadence sized to the 2-4 hrs/week budget:** roughly one article every 1-2 weeks is the realistic pace, not a content calendar that assumes more time than exists.

**On hold — revisit once the site has real traffic/traction (timeline now roughly = the 6-month Phase 1 checkpoint above):**
- **Affiliate links.** Research already done 2026-08-02 — see `content/affiliate-programs-research.md` for the full breakdown, don't redo it. Short version: 8 of 10 providers route through 3 affiliate networks (Impact → Ria/WorldRemit/Panda Remit; Partnerize → Wise/Instarem; FlexOffers → Remitly/MoneyGram/Western Union), 5 of those are high-confidence/branded programs, 3 are network-listed-only. Xoom and Sendwave don't have a usable program. Deliberately paused because several of these programs weigh site traffic in approval, and a pre-traction site is likely to get rejected — better to apply once there's something to point to. When resumed: sign up for the 3 networks and apply to each program (account creation + likely tax/payout info, which Claude can't do on the user's behalf) — then it's a quick one-line-per-provider edit in `providers.json`'s `url` field once approved.

**Deliberately dropped — unaffected by the 2026-08-03 pivot, do not resurface unless something else changes:**
- Talking to a lawyer/accountant re: business registration — revisit only if/when real affiliate income actually starts flowing.
- Share image (`og:image`) — nice-to-have, low priority, only if it comes up naturally.

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
- `update_rates.py` = the "engine." Refreshes Wise, Instarem, and Xoom from the free Wise feed + live mid-market rate. **Staleness guard (added 2026-09-18):** if an auto provider drops out of the feed for more than 3 days, its rate is cleared (old value kept in `lastKnownRate`/`lastKnownFee`), it shows as "Standard rate not yet verified," and the Actions log prints a `::warning::`. It heals itself if the provider reappears in the feed.
- `.github/workflows/update-rates.yml` = the "timer." Runs the engine automatically every day on GitHub's servers and pushes any changes.

**Weekly (automatic, notifies on real changes):**
- A Claude scheduled task (`truerateph-weekly-manual-rate-check`, runs Fridays 3pm) checks the 7 providers with no public data feed — Ria, Sendwave, WorldRemit, Western Union, Panda Remit, Remitly, MoneyGram — by visiting each site directly, and updates/pushes `providers.json` if a rate changed. A push notification is sent only on runs where something actually changed. Manage/reschedule it from the Scheduled section of the app sidebar.

---

## 5. Tricky decisions & things not obvious from the code 🧠

- **Standard rates only (big one):** We rank by each provider's **normal everyday rate**, NOT their flashy one-time "first-transfer promo." Promos mislead repeat senders (most of the audience) and are shown separately, clearly labeled. This is the site's core trust principle.
- **The `verified` flag in `providers.json`** controls where a provider shows up: `true` = ranked (real standard rate); `false` + a rate = promo shown in the unranked section (gold badge); `false` + empty rate = "pending / not yet verified."
- **Automatic promo guardrail:** The daily updater flags any auto rate that comes back *above* the mid-market rate as a promo (you can't legitimately beat the true rate), so it drops to the unranked tier by itself. That's why **Xoom** is unranked.
- **Delivery speeds were removed on purpose:** the old "Minutes / 1 day" labels were guesses, not real data, and they clashed with the fees. Cards now show only **"Bank deposit"** (the honest comparison basis). Fees shown are for bank deposit; faster options cost more (there's a note saying so).
- **Only 3 providers still have a free data source** (via the Wise feed: Wise, Instarem, Xoom). The feed used to cover Remitly and MoneyGram too but silently dropped them (last seen 2026-07-15) — the updater left their old rates sitting there looking fresh for 2+ months while the page's single "Rates last verified" banner kept updating. Found and fixed 2026-09-18 (staleness guard, both moved to the weekly manual check). The other 7 are checked weekly by hand (see section 4). Getting their *standard* rate is hard because their sites hide it behind promos/logins — the long-term fix is affiliate data feeds, not scraping.
- **Do NOT add money-handling or automated logins.** Staying a pure info/referral site keeps you out of heavy financial regulation. Automated login-scraping is fragile, often against terms, and Claude won't handle your passwords.
- **Cache-busting version numbers:** links like `styles.css?v=8` and `script.js?v=6` have a number that gets bumped whenever that file changes, so browsers load the new version instead of an old cached one. `providers.json` is fetched with "never cache" so rates are always fresh.
- **DNS/HTTPS notes:** the domain was bought through Namecheap; 4 A records point the bare domain at GitHub Pages' IPs, and a CNAME points `www` at the GitHub Pages address. GitHub auto-issues the HTTPS certificate once DNS checks out (took under an hour here) — nothing to renew manually.
- **Windows line-ending warnings** (LF/CRLF) appear on every git commit — harmless, ignore them.

---

## 6. Broken / half-finished ⚠️

- **Nothing is broken.**
- **Pending after the 2026-09-18 stale-data fix (expected to resolve on its own):**
  - **Remitly and MoneyGram** — now `source: manual`, `rate: null`, showing "Standard rate not yet verified" until the weekly task finds a confirmed standard rate. Their old values (59.775 / 61.2106 + $1.99) are kept in `lastKnownRate`/`lastKnownFee`.
  - **Xoom** — still `auto` but gone from the feed since 2026-09-05; demoted to unverified by hand on 2026-09-18 (same thing the staleness guard does), old value in `lastKnownRate`. Decide whether to move it to the weekly manual check too.
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
