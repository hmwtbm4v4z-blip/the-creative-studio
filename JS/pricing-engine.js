(function (global) {
  "use strict";

  const DATA = {"version":"2026-07-13","currency":"USD","catalog":[{"id":"website_landing","category":"Website Design","name":"One Page Landing Page","priceCents":30000,"priceLabel":"$300","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"website_basic","category":"Website Design","name":"Basic Business Website (Up to 5 Pages)","priceCents":75000,"priceLabel":"$750","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"website_standard","category":"Website Design","name":"Standard Business Website (6\u201310 Pages)","priceCents":125000,"priceLabel":"$1,250","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"website_premium","category":"Website Design","name":"Premium Business Website","priceCents":200000,"priceLabel":"$2,000","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"website_ecommerce","category":"Website Design","name":"eCommerce Website","priceCents":250000,"priceLabel":"Starting at $2,500","billing":"one-time","quantityMode":"none","starting":true,"quoteRequired":true},{"id":"website_redesign","category":"Website Design","name":"Website Redesign","priceCents":60000,"priceLabel":"Starting at $600","billing":"one-time","quantityMode":"none","starting":true,"quoteRequired":true},{"id":"website_additional_page","category":"Website Design","name":"Additional Page","priceCents":7500,"priceLabel":"$75 each","billing":"one-time","quantityMode":"multiplier","quantityLabel":"Pages","starting":false,"quoteRequired":false},{"id":"website_maintenance","category":"Website Design","name":"Website Maintenance","priceCents":7500,"priceLabel":"Starting at $75/month","billing":"monthly","quantityMode":"none","starting":true,"quoteRequired":true},{"id":"logo_basic","category":"Logo Design","name":"Basic Logo","priceCents":7500,"priceLabel":"$75","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"logo_standard","category":"Logo Design","name":"Standard Logo","priceCents":15000,"priceLabel":"$150","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"logo_premium","category":"Logo Design","name":"Premium Logo Package","priceCents":30000,"priceLabel":"$300","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"brand_identity","category":"Logo Design","name":"Brand Identity Package","priceCents":50000,"priceLabel":"$500","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"business_cards_design","category":"Business Cards","name":"Design Only","priceCents":4000,"priceLabel":"$40","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"business_cards_print","category":"Business Cards","name":"Design + Printing","priceCents":7500,"priceLabel":"Starting at $75","billing":"one-time","quantityMode":"tier","quantityLabel":"Printed quantity","tiers":{"1000":9500},"starting":true,"quoteRequired":true},{"id":"business_cards_employee","category":"Business Cards","name":"Additional Employee Cards","priceCents":1000,"priceLabel":"$10 each","billing":"one-time","quantityMode":"multiplier","quantityLabel":"Employees","starting":false,"quoteRequired":false},{"id":"business_cards_qr","category":"Business Cards","name":"QR Code Integration","priceCents":0,"priceLabel":"Included","billing":"included","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"magnets_design","category":"Magnets","name":"Design Only","priceCents":3500,"priceLabel":"$35","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"magnets_print","category":"Magnets","name":"Design + Print","priceCents":6000,"priceLabel":"Starting at $60","billing":"one-time","quantityMode":"metadata","quantityLabel":"Printed quantity","starting":true,"quoteRequired":true},{"id":"yard_signs_design","category":"Yard Signs","name":"Design Only","priceCents":5000,"priceLabel":"$50","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"yard_signs_print","category":"Yard Signs","name":"Design + Print","priceCents":9000,"priceLabel":"Starting at $90","billing":"one-time","quantityMode":"metadata","quantityLabel":"Printed quantity","starting":true,"quoteRequired":true},{"id":"yard_banners_design","category":"Yard Banners","name":"Design Only","priceCents":6500,"priceLabel":"$65","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"yard_banners_print","category":"Yard Banners","name":"Design + Print","priceCents":12000,"priceLabel":"Starting at $120","billing":"one-time","quantityMode":"tier","quantityLabel":"Banner quantity","tiers":{"2":16000},"starting":true,"quoteRequired":true},{"id":"postcards_design","category":"Postcards","name":"Design Only","priceCents":4500,"priceLabel":"$45","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"postcards_print","category":"Postcards","name":"Design + Print","priceCents":8000,"priceLabel":"Starting at $80","billing":"one-time","quantityMode":"tier","quantityLabel":"Printed quantity","tiers":{"500":8500},"starting":true,"quoteRequired":true},{"id":"greeting_design","category":"Greeting Cards","name":"Design Only","priceCents":4500,"priceLabel":"$45","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"greeting_photo","category":"Greeting Cards","name":"Custom Photo Greeting Card","priceCents":6000,"priceLabel":"Starting at $60","billing":"one-time","quantityMode":"none","starting":true,"quoteRequired":true},{"id":"greeting_print","category":"Greeting Cards","name":"Design + Print","priceCents":8500,"priceLabel":"Starting at $85","billing":"one-time","quantityMode":"metadata","quantityLabel":"Printed quantity","starting":true,"quoteRequired":true},{"id":"flyers_design","category":"Flyers","name":"Design Only","priceCents":4500,"priceLabel":"$45","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"flyers_print","category":"Flyers","name":"Design + Print","priceCents":7500,"priceLabel":"Starting at $75","billing":"one-time","quantityMode":"metadata","quantityLabel":"Printed quantity","starting":true,"quoteRequired":true},{"id":"social_single","category":"Social Media","name":"Single Post","priceCents":1500,"priceLabel":"$15","billing":"one-time","quantityMode":"multiplier","quantityLabel":"Posts","starting":false,"quoteRequired":false},{"id":"social_5","category":"Social Media","name":"5 Posts","priceCents":6500,"priceLabel":"$65","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"social_10","category":"Social Media","name":"10 Posts","priceCents":12000,"priceLabel":"$120","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"social_25","category":"Social Media","name":"25 Posts","priceCents":27500,"priceLabel":"$275","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"social_monthly","category":"Social Media","name":"Monthly Content Package","priceCents":30000,"priceLabel":"Starting at $300/month","billing":"monthly","quantityMode":"none","starting":true,"quoteRequired":true},{"id":"social_profile","category":"Social Media Branding","name":"Profile Picture","priceCents":3000,"priceLabel":"$30","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"social_cover","category":"Social Media Branding","name":"Cover Photo","priceCents":4000,"priceLabel":"$40","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"social_brand_kit","category":"Social Media Branding","name":"Complete Branding Kit","priceCents":10000,"priceLabel":"$100","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"email_banner","category":"Email Graphics","name":"Email Banner","priceCents":3500,"priceLabel":"$35","billing":"one-time","quantityMode":"multiplier","quantityLabel":"Banners","starting":false,"quoteRequired":false},{"id":"email_signature","category":"Email Graphics","name":"Email Signature","priceCents":3000,"priceLabel":"$30","billing":"one-time","quantityMode":"multiplier","quantityLabel":"Signatures","starting":false,"quoteRequired":false},{"id":"email_complete","category":"Email Graphics","name":"Complete Email Branding","priceCents":6000,"priceLabel":"$60","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"rack_cards","category":"Other Marketing Materials","name":"Rack Cards","priceCents":6000,"priceLabel":"Starting at $60","billing":"one-time","quantityMode":"metadata","quantityLabel":"Printed quantity","starting":true,"quoteRequired":true},{"id":"brochures","category":"Other Marketing Materials","name":"Brochures","priceCents":8500,"priceLabel":"Starting at $85","billing":"one-time","quantityMode":"metadata","quantityLabel":"Printed quantity","starting":true,"quoteRequired":true},{"id":"posters","category":"Other Marketing Materials","name":"Posters","priceCents":5000,"priceLabel":"Starting at $50","billing":"one-time","quantityMode":"metadata","quantityLabel":"Printed quantity","starting":true,"quoteRequired":true},{"id":"menus","category":"Other Marketing Materials","name":"Menus","priceCents":7500,"priceLabel":"Starting at $75","billing":"one-time","quantityMode":"metadata","quantityLabel":"Printed quantity","starting":true,"quoteRequired":true},{"id":"stickers","category":"Other Marketing Materials","name":"Stickers","priceCents":4500,"priceLabel":"Starting at $45","billing":"one-time","quantityMode":"metadata","quantityLabel":"Printed quantity","starting":true,"quoteRequired":true},{"id":"custom_design_hourly","category":"Other Marketing Materials","name":"Custom Design Work","priceCents":6000,"priceLabel":"$60/hour","billing":"hourly","quantityMode":"multiplier","quantityLabel":"Hours","starting":false,"quoteRequired":false},{"id":"addon_contact_form","category":"Website Add-ons","name":"Contact Form","priceCents":0,"priceLabel":"Included","billing":"included","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"addon_booking","category":"Website Add-ons","name":"Appointment Booking","priceCents":10000,"priceLabel":"$100","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"addon_quote_system","category":"Website Add-ons","name":"Quote Request System","priceCents":10000,"priceLabel":"$100","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"addon_gallery","category":"Website Add-ons","name":"Image Gallery","priceCents":5000,"priceLabel":"$50","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"addon_blog","category":"Website Add-ons","name":"Blog Setup","priceCents":15000,"priceLabel":"$150","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"addon_portal","category":"Website Add-ons","name":"Customer Portal","priceCents":50000,"priceLabel":"Starting at $500","billing":"one-time","quantityMode":"none","starting":true,"quoteRequired":true},{"id":"addon_cart","category":"Website Add-ons","name":"Shopping Cart","priceCents":50000,"priceLabel":"Starting at $500","billing":"one-time","quantityMode":"none","starting":true,"quoteRequired":true},{"id":"addon_payments","category":"Website Add-ons","name":"Online Payments","priceCents":15000,"priceLabel":"Starting at $150","billing":"one-time","quantityMode":"none","starting":true,"quoteRequired":true},{"id":"addon_chat","category":"Website Add-ons","name":"Live Chat","priceCents":7500,"priceLabel":"$75","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"addon_newsletter","category":"Website Add-ons","name":"Newsletter Integration","priceCents":7500,"priceLabel":"$75","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"addon_seo","category":"Website Add-ons","name":"SEO Setup","priceCents":25000,"priceLabel":"Starting at $250","billing":"one-time","quantityMode":"none","starting":true,"quoteRequired":true},{"id":"addon_google_business","category":"Website Add-ons","name":"Google Business Profile Integration","priceCents":10000,"priceLabel":"$100","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false},{"id":"plan_starter","category":"Ongoing Design Plans","name":"Starter","priceCents":15000,"priceLabel":"$150/month","billing":"monthly","quantityMode":"none","starting":false,"quoteRequired":true},{"id":"plan_business","category":"Ongoing Design Plans","name":"Business","priceCents":35000,"priceLabel":"$350/month","billing":"monthly","quantityMode":"none","starting":false,"quoteRequired":true},{"id":"plan_professional","category":"Ongoing Design Plans","name":"Professional","priceCents":70000,"priceLabel":"$700/month","billing":"monthly","quantityMode":"none","starting":false,"quoteRequired":true},{"id":"plan_unlimited","category":"Ongoing Design Plans","name":"Unlimited Design Retainer","priceCents":0,"priceLabel":"Custom Quote","billing":"custom","quantityMode":"none","starting":true,"quoteRequired":true},{"id":"bundle_new_business","category":"Bundle & Save","name":"New Business Starter","priceCents":85000,"priceLabel":"$850","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false,"includes":["Logo Design","Business Cards","Social Media Profile Picture","Facebook Cover","Basic Website (Up to 5 Pages)"]},{"id":"bundle_professional_branding","category":"Bundle & Save","name":"Professional Branding","priceCents":125000,"priceLabel":"$1,250","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false,"includes":["Premium Logo","Brand Guide","Business Cards","Email Signature","Social Media Branding","Yard Sign","Website"]},{"id":"bundle_complete_launch","category":"Bundle & Save","name":"Complete Business Launch","priceCents":250000,"priceLabel":"$2,500","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false,"includes":["Premium Website","Premium Logo","Full Brand Identity","Business Cards","Magnets","Yard Banner","Yard Signs","Flyers","Social Media Package","Email Branding","30 Days of Website Maintenance"]},{"id":"bundle_marketing_essentials","category":"Bundle & Save","name":"Marketing Essentials","priceCents":60000,"priceLabel":"$600","billing":"one-time","quantityMode":"none","starting":false,"quoteRequired":false}],"rushRates":{"standard":0,"priority":0.15,"rush":0.25,"emergency":0.4},"discounts":{"none":{"label":"No discount","rate":0,"verificationRequired":false},"military":{"label":"Military \u2014 10%","rate":0.1,"verificationRequired":true},"first_responder":{"label":"First Responder \u2014 10%","rate":0.1,"verificationRequired":true},"teacher":{"label":"Teacher \u2014 10%","rate":0.1,"verificationRequired":true},"nonprofit":{"label":"Nonprofit Organization \u2014 10%","rate":0.1,"verificationRequired":true},"repeat_customer":{"label":"Repeat Customer \u2014 loyalty review","rate":0,"verificationRequired":true},"bundle_review":{"label":"Bundle discount review","rate":0,"verificationRequired":true}},"depositRules":[{"maxExclusiveCents":25000,"rate":1.0,"label":"Full payment required"},{"maxExclusiveCents":100000,"rate":0.5,"label":"50% deposit"},{"maxExclusiveCents":null,"rate":0.25,"label":"25% deposit"}]};
  const byId = new Map(DATA.catalog.map(item => [item.id, item]));
  const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: DATA.currency
  });

  function cents(value) {
    const number = Number(value || 0);
    return Number.isFinite(number) ? Math.max(0, Math.round(number)) : 0;
  }

  function quantity(value) {
    const number = Number(value || 1);
    return Number.isFinite(number)
      ? Math.min(10000, Math.max(1, Math.round(number)))
      : 1;
  }

  function itemAmount(item, selected) {
    const qty = quantity(selected.quantity);

    if (item.quantityMode === "multiplier") {
      return item.priceCents * qty;
    }

    if (item.quantityMode === "tier") {
      const tier = item.tiers && item.tiers[String(qty)];
      return Number.isFinite(Number(tier))
        ? Number(tier)
        : item.priceCents;
    }

    return item.priceCents;
  }

  function calculate(request) {
    const selectedItems = Array.isArray(request?.items) ? request.items : [];
    const lineItems = [];
    const manualQuoteReasons = [];
    const warnings = [];
    let oneTimeSubtotalCents = 0;
    let recurringMonthlyCents = 0;

    selectedItems.slice(0, 100).forEach(selected => {
      const item = byId.get(String(selected.id || ""));
      if (!item) return;

      const qty = quantity(selected.quantity);
      const amountCents = itemAmount(item, selected);
      const line = {
        id: item.id,
        category: item.category,
        name: item.name,
        priceLabel: item.priceLabel,
        billing: item.billing,
        quantity: qty,
        quantityMode: item.quantityMode,
        quantityLabel: item.quantityLabel || "Quantity",
        amountCents,
        starting: Boolean(item.starting),
        quoteRequired: Boolean(item.quoteRequired),
        notes: String(selected.notes || "").slice(0, 1000)
      };

      lineItems.push(line);

      if (item.billing === "monthly") {
        recurringMonthlyCents += amountCents;
        manualQuoteReasons.push(`${item.name} uses recurring billing and requires plan approval.`);
      } else if (item.billing !== "included" && item.billing !== "custom") {
        oneTimeSubtotalCents += amountCents;
      }

      if (item.starting || item.quoteRequired || item.billing === "custom") {
        manualQuoteReasons.push(`${item.name} is a starting-price or custom-quote service.`);
      }

      if (item.quantityMode === "metadata" || item.quantityMode === "tier") {
        warnings.push(`${item.name} production pricing depends on quantity, material, finish, and provider.`);
      }
    });

    const discountKey = DATA.discounts[request?.discount] ? request.discount : "none";
    const discountRule = DATA.discounts[discountKey];
    const serviceSubtotalCents = oneTimeSubtotalCents + recurringMonthlyCents;
    const discountCents = Math.round(serviceSubtotalCents * discountRule.rate);
    const oneTimeDiscountCents = Math.round(oneTimeSubtotalCents * discountRule.rate);
    const discountedOneTimeCents = Math.max(0, oneTimeSubtotalCents - oneTimeDiscountCents);
    const discountedServiceSubtotalCents = Math.max(0, serviceSubtotalCents - discountCents);

    if (discountRule.verificationRequired) {
      manualQuoteReasons.push(`${discountRule.label} requires eligibility or loyalty verification.`);
    }

    const rushKey = Object.prototype.hasOwnProperty.call(DATA.rushRates, request?.rush)
      ? request.rush
      : "standard";
    const rushRate = DATA.rushRates[rushKey];
    const rushFeeCents = Math.round(discountedOneTimeCents * rushRate);

    const delivery = String(request?.delivery || "digital");
    const shippingCents = cents(request?.shippingCents);
    if (["shipping", "local_delivery", "installation"].includes(delivery)) {
      manualQuoteReasons.push("Shipping, local delivery, or installation requires a final fulfillment quote.");
    }

    const taxRate = Math.min(0.25, Math.max(0, Number(request?.taxRate || 0) / 100));
    const preTaxTotalCents = discountedServiceSubtotalCents + rushFeeCents + shippingCents;
    const taxCents = Math.round(preTaxTotalCents * taxRate);
    const totalCents = preTaxTotalCents + taxCents;

    let depositRate = 1;
    let depositLabel = "Full payment required";
    for (const rule of DATA.depositRules) {
      if (rule.maxExclusiveCents === null || totalCents < rule.maxExclusiveCents) {
        depositRate = rule.rate;
        depositLabel = rule.label;
        break;
      }
    }

    const payMode = request?.payMode === "full" ? "full" : "deposit";
    const dueNowCents = payMode === "full"
      ? totalCents
      : Math.round(totalCents * depositRate);

    const uniqueReasons = [...new Set(manualQuoteReasons)];
    const uniqueWarnings = [...new Set(warnings)];
    const directCheckoutAllowed =
      totalCents > 0 &&
      uniqueReasons.length === 0 &&
      recurringMonthlyCents === 0;

    return {
      catalogVersion: DATA.version,
      currency: DATA.currency,
      lineItems,
      oneTimeSubtotalCents,
      recurringMonthlyCents,
      serviceSubtotalCents,
      discountKey,
      discountLabel: discountRule.label,
      discountRate: discountRule.rate,
      discountCents,
      rushKey,
      rushRate,
      rushFeeCents,
      delivery,
      shippingCents,
      taxRatePercent: taxRate * 100,
      taxCents,
      preTaxTotalCents,
      totalCents,
      depositRate,
      depositLabel,
      payMode,
      dueNowCents,
      remainingBalanceCents: Math.max(0, totalCents - dueNowCents),
      manualQuoteReasons: uniqueReasons,
      warnings: uniqueWarnings,
      requiresManualQuote: uniqueReasons.length > 0,
      directCheckoutAllowed
    };
  }

  function money(value) {
    return moneyFormatter.format(cents(value) / 100);
  }

  function savePricingDraft(payload) {
    try {
      localStorage.setItem(
        "creativeStudioPricingDraft",
        JSON.stringify(payload)
      );
      return true;
    } catch (error) {
      console.warn("Unable to save pricing draft.", error);
      return false;
    }
  }

  function loadPricingDraft() {
    try {
      const raw = localStorage.getItem("creativeStudioPricingDraft");
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Unable to load pricing draft.", error);
      return null;
    }
  }

  function saveProjectRequest(payload) {
    try {
      localStorage.setItem(
        "creativeStudioProjectRequest",
        JSON.stringify(payload)
      );
      return true;
    } catch (error) {
      console.warn("Unable to save project request.", error);
      return false;
    }
  }

  function loadProjectRequest() {
    try {
      const raw = localStorage.getItem("creativeStudioProjectRequest");
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Unable to load project request.", error);
      return null;
    }
  }

  global.CreativeStudioPricing = {
    data: DATA,
    catalog: DATA.catalog,
    byId,
    calculate,
    money,
    savePricingDraft,
    loadPricingDraft,
    saveProjectRequest,
    loadProjectRequest
  };
})(window);
