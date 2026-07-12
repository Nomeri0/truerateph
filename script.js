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
        callout.style.display = "";
      } else {
        // If every option is basically the same, hide the highlight.
        callout.style.display = "none";
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

  // 1) Read the starting amount from the web address (default 500).
  var params = new URLSearchParams(window.location.search);
  var startAmount = clampAmount(parseFloat(params.get("amount")) || 500);

  // 2) Show it in the editable box and calculate the list once.
  var resultsInput = document.getElementById("resultsAmount");
  if (resultsInput) {
    resultsInput.value = startAmount;
  }
  renderResults(startAmount);

  // 3) When the visitor changes the amount here, recalculate live and
  //    keep the web address in sync (so a refresh remembers the amount).
  setupAmountControls(resultsInput, function (newAmount) {
    renderResults(newAmount);
    history.replaceState(null, "", "results.html?amount=" + newAmount);
  });
}
