/* Page controller: pricing-table.html. Loaded once with defer. */
(function () {
      "use strict";

      const selected = new Map();
      let initialized = false;

      function escapeHTML(value) {
        const div = document.createElement("div");
        div.textContent = String(value ?? "");
        return div.innerHTML;
      }

      function getEngine() {
        return window.CreativeStudioPricing || null;
      }

      function groupCatalog(catalog) {
        const groups = new Map();

        catalog.forEach(item => {
          if (!groups.has(item.category)) {
            groups.set(item.category, []);
          }
          groups.get(item.category).push(item);
        });

        return groups;
      }

      function renderSelectors() {
        const engine = getEngine();
        const container = document.getElementById("pricingSelectorGroups");

        if (!engine || !container) {
          container.innerHTML =
            '<div class="preview-notice">The pricing engine could not be loaded. Confirm that JS/pricing-engine.js exists.</div>';
          return;
        }

        const groups = groupCatalog(engine.catalog);
        const category = document.getElementById("pricingCategory");

        category.innerHTML =
          '<option value="">All categories</option>' +
          [...groups.keys()]
            .map(value => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`)
            .join("");

        container.innerHTML = [...groups.entries()].map(([groupName, items]) => `
          <section class="pricing-selector-group" data-category="${escapeHTML(groupName)}">
            <h3>${escapeHTML(groupName)}</h3>
            <div class="pricing-selector-grid">
              ${items.map(item => `
                <label class="pricing-selector-card" data-service-card="${escapeHTML(item.id)}">
                  <input data-service-check="${escapeHTML(item.id)}" type="checkbox">
                  <span>
                    <strong>${escapeHTML(item.name)}</strong>
                    <span class="selector-price">${escapeHTML(item.priceLabel)}</span>
                    ${item.starting ? '<small>Final quote required.</small>' : '<small>Published base price.</small>'}
                  </span>
                  <span class="selector-controls">
                    <input
                      aria-label="${escapeHTML(item.quantityLabel || "Quantity")} for ${escapeHTML(item.name)}"
                      data-service-quantity="${escapeHTML(item.id)}"
                      min="1"
                      type="number"
                      value="1"
                      ${item.quantityMode === "none" ? "disabled" : ""}>
                    <input
                      aria-label="Notes for ${escapeHTML(item.name)}"
                      data-service-notes="${escapeHTML(item.id)}"
                      placeholder="Size, finish, option, or notes"
                      type="text"
                      disabled>
                  </span>
                </label>
              `).join("")}
            </div>
          </section>
        `).join("");

        container.querySelectorAll("[data-service-check]").forEach(check => {
          check.addEventListener("change", () => {
            const id = check.dataset.serviceCheck;
            if (check.checked) {
              selected.set(id, { id, quantity: 1, notes: "" });
            }
            else {
              selected.delete(id);
            }
            syncCard(id);
            updateEstimate();
          });
        });

        container.querySelectorAll("[data-service-quantity]").forEach(input => {
          input.addEventListener("input", () => {
            const current = selected.get(input.dataset.serviceQuantity);
            if (!current) return;
            current.quantity = Math.max(1, Number(input.value || 1));
            updateEstimate();
          });
        });

        container.querySelectorAll("[data-service-notes]").forEach(input => {
          input.addEventListener("input", () => {
            const current = selected.get(input.dataset.serviceNotes);
            if (!current) return;
            current.notes = input.value;
            updateEstimate();
          });
        });

        restoreDraft();
        initialized = true;
        updateEstimate();
      }

      function syncCard(id) {
        const current = selected.get(id);
        const card = document.querySelector(`[data-service-card="${CSS.escape(id)}"]`);
        if (!card) return;

        const check = card.querySelector("[data-service-check]");
        const quantity = card.querySelector("[data-service-quantity]");
        const notes = card.querySelector("[data-service-notes]");

        if (check) check.checked = Boolean(current);
        if (quantity) quantity.value = current?.quantity || 1;
        if (notes) {
          notes.disabled = !current;
          notes.value = current?.notes || "";
        }
      }

      function restoreDraft() {
        const engine = getEngine();
        const draft = engine?.loadPricingDraft?.();

        if (!draft) {
          const requested = new URLSearchParams(location.search).get("service");
          const alias = {
            website: "website_basic",
            logo: "logo_standard",
            businesscards: "business_cards_design",
            magnets: "magnets_design",
            yardsigns: "yard_signs_design",
            yardbanners: "yard_banners_design",
            greetingcards: "greeting_design",
            postcards: "postcards_design",
            social: "social_single",
            email: "email_banner",
            flyers: "flyers_design"
          }[String(requested || "").toLowerCase()];

          if (alias) {
            selected.set(alias, { id: alias, quantity: 1, notes: "" });
            syncCard(alias);
          }
          return;
        }

        (draft.items || []).forEach(item => {
          if (!engine.byId.has(item.id)) return;
          selected.set(item.id, {
            id: item.id,
            quantity: Math.max(1, Number(item.quantity || 1)),
            notes: String(item.notes || "")
          });
          syncCard(item.id);
        });

        document.getElementById("pricingRush").value = draft.rush || "standard";
        document.getElementById("pricingDiscount").value = draft.discount || "none";
        document.getElementById("pricingDelivery").value = draft.delivery || "digital";
        document.getElementById("pricingShipping").value = String((draft.shippingCents || 0) / 100);
        document.getElementById("pricingTax").value = String(draft.taxRate || 0);
        document.getElementById("pricingPayMode").value = draft.payMode || "deposit";
      }

      function requestPayload() {
        return {
          items: [...selected.values()],
          rush: document.getElementById("pricingRush").value,
          discount: document.getElementById("pricingDiscount").value,
          delivery: document.getElementById("pricingDelivery").value,
          shippingCents: Math.round(Number(document.getElementById("pricingShipping").value || 0) * 100),
          taxRate: Number(document.getElementById("pricingTax").value || 0),
          payMode: document.getElementById("pricingPayMode").value
        };
      }

      function updateEstimate() {
        const engine = getEngine();
        if (!engine || !initialized) return;

        const payload = requestPayload();
        const result = engine.calculate(payload);

        document.getElementById("pricingLineItems").innerHTML =
          result.lineItems.length
            ? result.lineItems.map(line => `
                <div class="preview-line-item">
                  <strong>${escapeHTML(line.name)}</strong>
                  <small>${escapeHTML(line.category)} · ${engine.money(line.amountCents)}${line.billing === "monthly" ? "/month" : ""}</small>
                </div>
              `).join("")
            : "<p>No services selected.</p>";

        document.getElementById("pricingSummary").innerHTML = `
          <div class="preview-summary-line"><span>One-time services</span><strong>${engine.money(result.oneTimeSubtotalCents)}</strong></div>
          <div class="preview-summary-line"><span>Recurring monthly</span><strong>${engine.money(result.recurringMonthlyCents)}</strong></div>
          <div class="preview-summary-line"><span>Discount</span><strong>−${engine.money(result.discountCents)}</strong></div>
          <div class="preview-summary-line"><span>Rush fee</span><strong>${engine.money(result.rushFeeCents)}</strong></div>
          <div class="preview-summary-line"><span>Shipping / delivery</span><strong>${engine.money(result.shippingCents)}</strong></div>
          <div class="preview-summary-line"><span>Sales tax</span><strong>${engine.money(result.taxCents)}</strong></div>
          <div class="preview-summary-line total"><span>Estimated first invoice</span><strong>${engine.money(result.totalCents)}</strong></div>
          <div class="preview-summary-line"><span>${escapeHTML(result.depositLabel)}</span><strong>${engine.money(result.dueNowCents)}</strong></div>
        `;

        const notices = [
          ...result.manualQuoteReasons,
          ...result.warnings
        ];

        document.getElementById("pricingNotices").innerHTML =
          notices.length
            ? [...new Set(notices)]
                .map(message => `<div class="preview-notice">${escapeHTML(message)}</div>`)
                .join("")
            : result.lineItems.length
              ? '<div class="preview-notice success">Exact published prices selected. The full project form can use this estimate.</div>'
              : "";

        engine.savePricingDraft(payload);
      }

      function filterCatalog() {
        const search = document.getElementById("pricingSearch").value.trim().toLowerCase();
        const category = document.getElementById("pricingCategory").value;

        document.querySelectorAll("[data-category]").forEach(group => {
          let visible = 0;

          group.querySelectorAll("[data-service-card]").forEach(card => {
            const item = getEngine().byId.get(card.dataset.serviceCard);
            const matches =
              (!category || item.category === category) &&
              (!search || `${item.category} ${item.name} ${item.priceLabel}`.toLowerCase().includes(search));

            card.hidden = !matches;
            if (matches) visible += 1;
          });

          group.hidden = visible === 0;
        });
      }

      function initialize() {
        const engine = getEngine();
        const discount = document.getElementById("pricingDiscount");

        if (!engine) {
          renderSelectors();
          return;
        }

        discount.innerHTML = Object.entries(engine.data.discounts)
          .map(([value, rule]) => `<option value="${escapeHTML(value)}">${escapeHTML(rule.label)}</option>`)
          .join("");

        renderSelectors();

        [
          "pricingRush",
          "pricingDiscount",
          "pricingDelivery",
          "pricingShipping",
          "pricingTax",
          "pricingPayMode"
        ].forEach(id => {
          const control = document.getElementById(id);
          control.addEventListener("input", updateEstimate);
          control.addEventListener("change", updateEstimate);
        });

        document.getElementById("pricingSearch").addEventListener("input", filterCatalog);
        document.getElementById("pricingCategory").addEventListener("change", filterCatalog);

        document.getElementById("buildFullProject").addEventListener("click", () => {
          const payload = requestPayload();

          if (!payload.items.length) {
            alert("Select at least one service before building the full project request.");
            return;
          }

          engine.savePricingDraft(payload);
          location.href = "order.html";
        });

        document.getElementById("clearPricing").addEventListener("click", () => {
          selected.clear();
          document.querySelectorAll("[data-service-check]").forEach(check => {
            check.checked = false;
            syncCard(check.dataset.serviceCheck);
          });
          document.getElementById("pricingRush").value = "standard";
          document.getElementById("pricingDiscount").value = "none";
          document.getElementById("pricingDelivery").value = "digital";
          document.getElementById("pricingShipping").value = "0";
          document.getElementById("pricingTax").value = "0";
          document.getElementById("pricingPayMode").value = "deposit";
          updateEstimate();
        });
      }

      document.addEventListener("DOMContentLoaded", initialize, { once: true });
    })();
