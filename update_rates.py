#!/usr/bin/env python3
"""
update_rates.py - TrueRate PH auto-updater (the "daily updater" engine).

What it does:
  - Fetches the live mid-market USD->PHP rate (free FX source).
  - Fetches the 5 'auto' providers' rates+fees from Wise's free comparison
    feed and writes them into providers.json.
  - Leaves the 'manual' providers completely untouched.

Guardrail (the standard-rates-only policy, automated):
  A provider can never legitimately give MORE pesos than the true
  mid-market rate, so any 'auto' rate that comes back above mid-market is
  almost certainly a first-transfer promo. Those are marked verified=false
  and automatically drop to the unranked "pending" tier.

Safety:
  - Fetches everything FIRST; if any request fails, it exits WITHOUT
    touching providers.json (so a bad run never corrupts your data).
  - Uses only the Python standard library, so it runs anywhere (including
    a scheduled GitHub Action) with no 'pip install'.

Run it by hand with:  python update_rates.py
"""

import json
import sys
import urllib.request
from datetime import date

STORE_PATH = "providers.json"
REFERENCE_AMOUNT = 500
WISE_URL = (
    "https://api.wise.com/v4/comparisons/"
    "?sourceCurrency=USD&targetCurrency=PHP&sendAmount={}"
).format(REFERENCE_AMOUNT)
FX_URL = "https://open.er-api.com/v6/latest/USD"
# Providers give at best the mid-market rate; anything above it is a promo.
PROMO_TOLERANCE = 0.01


def fetch_json(url):
    """Fetch a URL and parse it as JSON."""
    req = urllib.request.Request(url, headers={"User-Agent": "TrueRatePH-updater"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_mid_market():
    """Return the live mid-market USD->PHP rate as a float."""
    data = fetch_json(FX_URL)
    if data.get("result") != "success":
        raise RuntimeError("FX source did not return success")
    return float(data["rates"]["PHP"])


def get_wise_rates():
    """Return {provider_name_lower: (rate, fee)} from Wise's comparison feed."""
    data = fetch_json(WISE_URL)
    out = {}
    for provider in data.get("providers", []):
        name = provider.get("name", "")
        quotes = provider.get("quotes", [])
        if not name or not quotes:
            continue
        quote = quotes[0]
        rate = quote.get("rate")
        if rate is None:
            continue
        fee = quote.get("fee") or 0
        out[name.strip().lower()] = (float(rate), float(fee))
    return out


def main():
    # 1. Load the current store.
    with open(STORE_PATH, encoding="utf-8") as f:
        store = json.load(f)

    # 2. Fetch fresh data FIRST. If anything fails, leave the file alone.
    try:
        mid = get_mid_market()
        wise = get_wise_rates()
    except Exception as err:
        print("ERROR: could not fetch rates -", err)
        return 1

    today = date.today().isoformat()
    ranked, flagged, missing = [], [], []

    # 3. Update ONLY the 'auto' providers.
    for provider in store["providers"]:
        if provider.get("source") != "auto":
            continue
        key = provider["name"].strip().lower()
        if key not in wise:
            missing.append(provider["name"])
            continue
        rate, fee = wise[key]
        provider["rate"] = round(rate, 4)
        provider["fee"] = round(fee, 2)
        provider["lastUpdated"] = today
        # Guardrail: a rate above mid-market means it's a promo -> unranked.
        is_promo = rate > (mid + PROMO_TOLERANCE)
        provider["verified"] = not is_promo
        (flagged if is_promo else ranked).append(provider["name"])

    # 4. Refresh the shared meta values.
    store["meta"]["midMarketFallback"] = round(mid, 2)
    store["meta"]["lastUpdated"] = today

    # 5. Write the store back, nicely formatted.
    with open(STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # 6. Report what happened.
    print("Mid-market USD->PHP:", round(mid, 4))
    print("Ranked (standard rate):", ", ".join(ranked) or "none")
    print("Flagged as promo (unranked):", ", ".join(flagged) or "none")
    if missing:
        print("Not found in feed (left unchanged):", ", ".join(missing))
    return 0


if __name__ == "__main__":
    sys.exit(main())
