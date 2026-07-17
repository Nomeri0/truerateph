/* ============================================================
   TrueRate PH — shared JavaScript for both pages.

   This one file is loaded by BOTH index.html and results.html.
   It checks which page it's on by looking for elements that only
   exist on that page, so the right code runs in the right place.
   ============================================================ */

// How much the up/down arrow buttons change the amount each click.
var STEP = 15;

/* Keep an amount sensible: never blank, never below 1. */
function clampAmount(value) {
  if (!value || value < 1) {
    return 1;
  }
  return value;
}

/* Format pesos like "₱28,723" (whole peso, comma between thousands). */
function formatPesos(value) {
  return "₱" + Math.round(value).toLocaleString("en-US");
}


/* ------------------------------------------------------------
   Wire up an amount box: the up/down arrow buttons AND typing.
     input    = the <input> element
     onChange = a function to run with the new amount (or null)
   The arrow buttons update the input; typing just reports the value.
   ------------------------------------------------------------ */
function setupAmountControls(input, onChange) {
  if (!input) {
    return;
  }

  var box = input.closest(".amount-box");
  if (box) {
    box.querySelectorAll(".step-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var current = parseFloat(input.value) || 0;

        if (btn.getAttribute("data-step") === "up") {
          current = current + STEP;
        } else {
          current = current - STEP;
        }

        current = clampAmount(current);
        input.value = current;

        if (onChange) {
          onChange(current);
        }
      });
    });
  }

  // React while the visitor types — but wait for a valid number first,
  // so clearing the field mid-edit doesn't cause a jump.
  input.addEventListener("input", function () {
    var raw = input.value.trim();
    if (raw === "") {
      return;
    }
    var value = parseFloat(raw);
    if (isNaN(value) || value < 1) {
      return;
    }
    if (onChange) {
      onChange(value);
    }
  });
}


/* ============================================================
   LIVE MID-MARKET RATE (landing page badge)
   Fetches the real USD->PHP rate on load and swaps it into the badge.
   If the request fails (offline, etc.), the fallback already in the
   HTML stays put, so the badge never looks broken.
   ============================================================ */
var midMarketEl = document.getElementById("midMarketRate");
if (midMarketEl) {
  fetch("https://open.er-api.com/v6/latest/USD")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.result === "success" && data.rates && data.rates.PHP) {
        midMarketEl.textContent = data.rates.PHP.toFixed(2);
      }
    })
    .catch(function () {
      /* Keep the fallback number that's already shown. */
    });
}


/* ============================================================
   LANDING PAGE behaviour
   Runs only if the "Compare" button exists on this page.
   ============================================================ */
var compareBtn = document.getElementById("compareBtn");
if (compareBtn) {
  var sendInput = document.getElementById("sendAmount");

  // Wire up the arrow buttons (no live recalculation needed here).
  setupAmountControls(sendInput, null);

  compareBtn.addEventListener("click", function (event) {
    event.preventDefault(); // stop the plain link; we'll navigate ourselves

    var amount = clampAmount(parseFloat(sendInput.value));

    // Go to the results page, carrying the amount in the web address.
    window.location.href = "results.html?amount=" + amount;
  });
}


/* ============================================================
   RESULTS PAGE behaviour
   Runs only if the provider list exists on this page.
   ============================================================ */
var resultsList = document.getElementById("results-list");
if (resultsList) {

  /* Recalculate every card for a given amount, then sort + re-number.
     For each provider:
       received = (amount you send − their fee) × their rate

     When the order changes we animate each card sliding from its old
     position to its new one, using the "FLIP" technique:
       1. First  — note where every card is right now.
       2. Last   — reorder the cards into their new positions.
       3. Invert — instantly shift each card back to where it started.
       4. Play   — release the shift so it glides to the new spot.  */
  function renderResults(amount) {
    amount = clampAmount(amount);

    var cards = resultsList.querySelectorAll(".provider-card");
    var items = [];

    cards.forEach(function (card) {
      var rate = parseFloat(card.getAttribute("data-rate"));
      var fee = parseFloat(card.getAttribute("data-fee")); // in US dollars

      var received = (amount - fee) * rate;
      if (received < 0) {
        received = 0;
      }

      card.querySelector(".provider-amount").textContent = formatPesos(received);
      items.push({ card: card, received: received });
    });

    // 1. First — record each card's current vertical position.
    var oldTops = new Map();
    items.forEach(function (item) {
      oldTops.set(item.card, item.card.getBoundingClientRect().top);
    });

    // Biggest payout first.
    items.sort(function (a, b) {
      return b.received - a.received;
    });

    // 2. Last — re-number, re-highlight the winner, and re-order on the page.
    items.forEach(function (item, index) {
      item.card.querySelector(".provider-rank").textContent = "#" + (index + 1);

      if (index === 0) {
        item.card.classList.add("top");
      } else {
        item.card.classList.remove("top");
      }

      resultsList.appendChild(item.card);
    });

    // Update the savings highlight: best option minus the worst option.
    var callout = document.getElementById("savingsCallout");
    if (callout && items.length > 1) {
      var best = items[0].received;
      var worst = items[items.length - 1].received;
      var savings = best - worst;

      if (savings >= 1) {
        document.getElementById("savingsAmount").textContent = formatPesos(savings);
        document.getElementById("savingsBest").textContent =
          items[0].card.querySelector(".provider-name").textContent;
        callout.hidden = false;
      } else {
        // If every option is basically the same, hide the highlight.
        callout.hidden = true;
      }
    }

    // 3 & 4. Invert then Play — slide each moved card into its new spot.
    items.forEach(function (item) {
      var newTop = item.card.getBoundingClientRect().top;
      var delta = oldTops.get(item.card) - newTop;

      if (delta) {
        // Jump back to the old position with no animation...
        item.card.style.transition = "none";
        item.card.style.transform = "translateY(" + delta + "px)";

        // ...force the browser to apply that, then animate to the new spot.
        item.card.getBoundingClientRect(); // read = force a reflow
        item.card.style.transition = "transform 0.35s ease";
        item.card.style.transform = "";
      }
    });
  }

  // Build the HTML for one verified provider card. It includes the hidden
  // data-rate / data-fee that renderResults() reads to do the math.
  function buildCard(p) {
    var feeText = (p.fee && p.fee > 0) ? ("$" + p.fee.toFixed(2) + " fee") : "No fee";
    return "" +
      '<div class="provider-card" data-rate="' + p.rate + '" data-fee="' + (p.fee || 0) + '">' +
        '<div class="provider-head">' +
          '<span class="provider-logo">' + p.initials + "</span>" +
          '<span class="provider-name">' + p.name + "</span>" +
          '<span class="provider-rank"></span>' +
        "</div>" +
        '<div class="provider-amount"></div>' +
        '<div class="provider-rate">1 USD = ₱' + p.rate.toFixed(2) + " · " + feeText + "</div>" +
        '<div class="provider-method">' + p.method + " · " + p.speed + "</div>" +
        sendButton(p) +
      "</div>";
  }

  // The "Send with X" button. Opens the provider's site in a new tab so the
  // visitor doesn't lose TrueRate PH. rel="noopener" is a safety best-practice.
  function sendButton(p) {
    var href = p.url || "#";
    return '<a class="btn-send" href="' + href + '" target="_blank" ' +
      'rel="noopener noreferrer">Send with ' + p.name + " →</a>";
  }

  // Build a card for a provider whose standard rate isn't verified yet.
  // If we DO have its promo rate, show it — clearly labeled as a
  // first-transfer promo — so the card isn't empty. These cards are
  // never ranked either way.
  function buildPendingCard(p) {
    var badge = "";
    var body = "";
    var extraClass = " pending-empty";

    if (p.rate != null) {
      var feeText = (p.fee && p.fee > 0) ? ("$" + p.fee.toFixed(2) + " fee") : "No fee";
      badge = '<span class="promo-badge">First-transfer promo</span>';
      extraClass = " promo";
      body =
        '<div class="promo-rate">₱' + p.rate.toFixed(2) +
          ' <span class="promo-rate-unit">per $1</span></div>' +
        '<div class="provider-method">' + feeText + " · " + p.method + " · " + p.speed + "</div>" +
        sendButton(p);
    } else {
      body =
        '<div class="provider-rate">Standard rate not yet verified</div>' +
        '<div class="provider-method">' + p.method + " · " + p.speed + "</div>";
    }

    return "" +
      '<div class="provider-card unverified' + extraClass + '">' +
        '<div class="provider-head">' +
          '<span class="provider-logo">' + p.initials + "</span>" +
          '<span class="provider-name">' + p.name + "</span>" +
          badge +
        "</div>" +
        body +
      "</div>";
  }

  // Turn "2026-07-15" into "Jul 15, 2026".
  function formatDate(iso) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = new Date(iso + "T00:00:00");
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  // Load the data store, build the cards from it, then show the results.
  // "no-store" tells the browser to always fetch fresh data, never a
  // cached copy — important for a site whose whole point is fresh rates.
  fetch("providers.json", { cache: "no-store" })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      // A provider is rank-able only if it's verified AND has a rate.
      var verified = data.providers.filter(function (p) {
        return p.verified && p.rate != null;
      });
      var pending = data.providers.filter(function (p) {
        return !(p.verified && p.rate != null);
      });

      // Verified providers become the ranked cards.
      resultsList.innerHTML = verified.map(buildCard).join("");

      // Pending providers go in a separate, unranked section.
      var pendingList = document.getElementById("unverified-list");
      if (pending.length && pendingList) {
        pendingList.innerHTML = pending.map(buildPendingCard).join("");
        document.getElementById("unverified-section").hidden = false;
      }

      // Honest "rates last verified" date, straight from the store.
      if (data.meta && data.meta.lastUpdated) {
        var vd = document.getElementById("verifiedDate");
        if (vd) { vd.textContent = formatDate(data.meta.lastUpdated); }
      }

      // Starting amount from the web address (default 500), then render.
      var params = new URLSearchParams(window.location.search);
      var startAmount = clampAmount(parseFloat(params.get("amount")) || 500);
      var resultsInput = document.getElementById("resultsAmount");
      if (resultsInput) { resultsInput.value = startAmount; }
      renderResults(startAmount);

      // Live recalculation when the amount changes here.
      setupAmountControls(resultsInput, function (newAmount) {
        renderResults(newAmount);
        history.replaceState(null, "", "results.html?amount=" + newAmount);
      });
    })
    .catch(function () {
      resultsList.innerHTML =
        '<p class="results-note">Sorry &mdash; could not load provider data.</p>';
    });
}
