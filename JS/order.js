/* Page controller: order.html. Loaded once with defer. */
(function () {
  'use strict';

  const STORAGE_KEY = 'creativeStudioEnhancedOrderDraftV2';
  const ready = (callback) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', callback, { once: true })
    : callback();

  ready(() => {
    const form = document.getElementById('projectForm');
    if (!form) return;

    const primaryRadios = Array.from(form.querySelectorAll('input[name="primary-service"]'));
    const panels = Array.from(form.querySelectorAll('[data-service-panel]'));
    const additionalChecks = Array.from(form.querySelectorAll('input[name="additional-services"]'));
    const status = document.getElementById('projectFormStatus');
    const autosaveStatus = document.getElementById('autosaveStatus');
    const phone = document.getElementById('phone');
    const customPreferredContainer = document.getElementById('customPreferredColors');
    const customAvoidContainer = document.getElementById('customAvoidColors');
    const summary = {
      service: document.getElementById('summaryService'),
      additional: document.getElementById('summaryAdditional'),
      name: document.getElementById('summaryName'),
      business: document.getElementById('summaryBusiness'),
      budget: document.getElementById('summaryBudget'),
      deadline: document.getElementById('summaryDeadline'),
      frequency: document.getElementById('summaryFrequency'),
      colors: document.getElementById('summaryColors'),
      colorDots: document.getElementById('summaryColorDots'),
      style: document.getElementById('summaryStyle')
    };

    let preferredCustomColors = [];
    let avoidCustomColors = [];
    let saveTimer = null;

    const serviceNames = {
      website: 'Website Design', maintenance: 'Website Maintenance', logo: 'Logo Design',
      'business-cards': 'Business Cards', magnets: 'Magnets', 'yard-signs': 'Yard Signs',
      'yard-banners': 'Yard Banners', 'greeting-cards': 'Greeting Cards', postcards: 'Postcards',
      'social-media': 'Social Media Graphics', 'email-banners': 'Email Banners & Signatures',
      custom: 'Custom Graphic Design'
    };
    const serviceAliases = {
      website: 'website', web: 'website', websites: 'website', maintenance: 'maintenance', redesign: 'maintenance',
      logo: 'logo', logos: 'logo', businesscards: 'business-cards', 'business-cards': 'business-cards', cards: 'business-cards',
      magnets: 'magnets', magnet: 'magnets', yardsigns: 'yard-signs', 'yard-signs': 'yard-signs', signs: 'yard-signs',
      yardbanners: 'yard-banners', 'yard-banners': 'yard-banners', banners: 'yard-banners',
      greetingcards: 'greeting-cards', 'greeting-cards': 'greeting-cards', postcards: 'postcards', postcard: 'postcards',
      social: 'social-media', 'social-media': 'social-media', email: 'email-banners', 'email-banners': 'email-banners', custom: 'custom'
    };
    const fieldLabels = {
      'full-name':'Name','business-name':'Business / Organization','email':'Email','phone':'Phone',
      'current-web-or-social':'Current Website / Social Page','business-location':'Location / Service Area',
      'primary-service':'Primary Service','additional-services':'Additional Services','preferred-colors':'Preferred Preset Colors',
      'custom-preferred-colors':'Custom Preferred Colors','colors-to-avoid-exact':'Exact Colors to Avoid',
      'style-preferences':'Style Preferences','target-audience':'Target Audience','estimated-budget':'Estimated Budget',
      'requested-deadline':'Requested Deadline','deadline-flexibility':'Deadline Flexibility','frequency':'Work Frequency',
      'project-goals':'Project Goals / Requirements','preferred-contact':'Preferred Contact Method','contact-consent':'Contact Consent'
    };

    function selectedPrimaryValue() {
      return primaryRadios.find((radio) => radio.checked)?.value || '';
    }
    function checkedValues(name) {
      return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((field) => field.value);
    }
    function selectedText(select) {
      if (!select || !select.value) return '';
      return select.options[select.selectedIndex]?.textContent.trim() || select.value;
    }
    function normalizeHex(value) {
      const candidate = String(value || '').trim().toUpperCase();
      return /^#[0-9A-F]{6}$/.test(candidate) ? candidate : null;
    }
    function formatDeadline(value) {
      if (!value) return 'Not selected';
      const date = new Date(value + 'T12:00:00');
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });
    }
    function setStatus(type, message) {
      status.className = `new-form-status ${type}`;
      status.textContent = message;
    }
    function clearStatus() {
      status.className = 'new-form-status';
      status.textContent = '';
    }

    function showPanel() {
      const value = selectedPrimaryValue();
      panels.forEach((panel) => {
        const active = panel.dataset.servicePanel === value;
        panel.classList.toggle('active', active);
        panel.querySelectorAll('input, select, textarea').forEach((field) => { field.disabled = !active; });
      });
      additionalChecks.forEach((checkbox) => {
        const duplicate = checkbox.dataset.serviceValue === value;
        if (duplicate) checkbox.checked = false;
        checkbox.disabled = duplicate;
      });
      const businessPanel = form.querySelector('[data-service-panel="business-cards"]');
      if (businessPanel && !document.getElementById('businessCardDetails')) {
        const details = document.createElement('div');
        details.className = 'new-form-group full business-card-details';
        details.id = 'businessCardDetails';
        details.innerHTML = '<label for="businessCardVersions">Additional Business Card Versions (up to 25)</label><input id="businessCardVersions" max="25" min="1" name="additional-business-card-versions" type="number" value="1"><p class="field-help">Use this for unique employee or team cards. Include each person’s exact name, title, phone, email, and other card-specific details in Project Goals.</p>';
        businessPanel.appendChild(details);
      }
      const businessDetails = document.getElementById('businessCardDetails');
      businessDetails?.querySelectorAll('input, select, textarea').forEach((field) => {
        field.disabled = value !== 'business-cards';
      });
    }

    function updatePhoneRequirement() {
      const contact = form.querySelector('input[name="preferred-contact"]:checked')?.value || '';
      phone.required = contact === 'Phone' || contact === 'Text';
      phone.setAttribute('aria-required', String(phone.required));
    }

    function allPreferredColors() {
      const preset = Array.from(form.querySelectorAll('input[name="preferred-colors"]:checked')).map((input) => ({ label: input.value, hex: input.dataset.color }));
      return preset.concat(preferredCustomColors.map((item) => ({ label: `${item.role}: ${item.hex}`, hex: item.hex })));
    }

    function updateSummary() {
      const primary = selectedPrimaryValue();
      const additions = checkedValues('additional-services');
      const styles = checkedValues('style-preferences');
      const colors = allPreferredColors();
      summary.service.textContent = serviceNames[primary] || 'Not selected';
      summary.additional.textContent = additions.length ? additions.join(', ') : 'None selected';
      summary.name.textContent = document.getElementById('fullName').value.trim() || 'Not entered';
      summary.business.textContent = document.getElementById('businessName').value.trim() || 'Not entered';
      summary.budget.textContent = selectedText(document.getElementById('budget')) || 'Not selected';
      summary.deadline.textContent = formatDeadline(document.getElementById('deadline').value);
      summary.frequency.textContent = selectedText(document.getElementById('frequency')) || 'Once';
      summary.colors.textContent = colors.length ? colors.map((item) => item.label).join(', ') : 'None selected';
      summary.style.textContent = styles.length ? styles.join(', ') : 'Not selected';
      summary.colorDots.innerHTML = '';
      colors.forEach((item) => {
        const dot = document.createElement('span');
        dot.className = 'summary-color-dot';
        dot.style.background = item.hex;
        dot.title = item.label;
        summary.colorDots.appendChild(dot);
      });
    }

    function renderColorChips(container, items, hiddenName, emptyText) {
      container.innerHTML = '';
      if (!items.length) {
        const empty = document.createElement('span');
        empty.className = 'empty-color-message';
        empty.textContent = emptyText;
        container.appendChild(empty);
        return;
      }
      items.forEach((item, index) => {
        const chip = document.createElement('span');
        chip.className = 'color-chip';
        const dot = document.createElement('span');
        dot.className = 'color-chip-dot';
        dot.style.background = item.hex;
        const label = document.createElement('span');
        label.textContent = item.role ? `${item.role}: ${item.hex}` : item.hex;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.setAttribute('aria-label', `Remove ${label.textContent}`);
        remove.textContent = '×';
        remove.addEventListener('click', () => {
          items.splice(index, 1);
          renderAllColors();
          updateSummary();
          scheduleSave();
        });
        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = hiddenName;
        hidden.value = label.textContent;
        chip.append(dot, label, remove, hidden);
        container.appendChild(chip);
      });
    }

    function renderAllColors() {
      renderColorChips(customPreferredContainer, preferredCustomColors, 'custom-preferred-colors', 'No custom colors added yet.');
      renderColorChips(customAvoidContainer, avoidCustomColors, 'colors-to-avoid-exact', 'No avoided colors added yet.');
    }

    function bindColorBuilder(pickerId, hexId, addButtonId, target) {
      const picker = document.getElementById(pickerId);
      const hex = document.getElementById(hexId);
      const button = document.getElementById(addButtonId);
      picker.addEventListener('input', () => { hex.value = picker.value.toUpperCase(); });
      hex.addEventListener('input', () => {
        const normalized = normalizeHex(hex.value);
        if (normalized) picker.value = normalized;
      });
      button.addEventListener('click', () => {
        const normalized = normalizeHex(hex.value);
        if (!normalized) {
          setStatus('error', 'Enter a valid six-digit HEX color such as #1F73E8.');
          hex.focus();
          return;
        }
        clearStatus();
        if (target === 'preferred') {
          const role = document.getElementById('customColorRole').value;
          if (!preferredCustomColors.some((item) => item.hex === normalized && item.role === role)) preferredCustomColors.push({ hex: normalized, role });
        } else if (!avoidCustomColors.some((item) => item.hex === normalized)) {
          avoidCustomColors.push({ hex: normalized, role: '' });
        }
        renderAllColors();
        updateSummary();
        scheduleSave();
      });
    }

    function serializeDraft() {
      const fields = {};
      Array.from(form.elements).forEach((field) => {
        if (!field.name || field.type === 'hidden' || field.type === 'submit' || field.type === 'reset' || field.type === 'button') return;
        if (field.type === 'checkbox' || field.type === 'radio') {
          if (!fields[field.name]) fields[field.name] = [];
          if (field.checked) fields[field.name].push(field.value);
        } else fields[field.name] = field.value;
      });
      return { fields, preferredCustomColors, avoidCustomColors, savedAt: new Date().toISOString() };
    }

    function saveDraft(showMessage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeDraft()));
        autosaveStatus.textContent = `Saved ${new Date().toLocaleTimeString([], { hour:'numeric', minute:'2-digit' })}`;
        if (showMessage) setStatus('success', 'Your progress was saved on this device.');
      } catch (error) {
        autosaveStatus.textContent = 'Local saving unavailable';
        if (showMessage) setStatus('error', 'This browser could not save the form locally.');
      }
    }

    function scheduleSave() {
      autosaveStatus.textContent = 'Saving…';
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => saveDraft(false), 450);
    }

    function restoreDraft() {
      let draft;
      try { draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (error) { return; }
      if (!draft?.fields) return;
      Array.from(form.elements).forEach((field) => {
        if (!field.name || !(field.name in draft.fields)) return;
        const value = draft.fields[field.name];
        if (field.type === 'checkbox' || field.type === 'radio') field.checked = Array.isArray(value) && value.includes(field.value);
        else field.value = value;
      });
      preferredCustomColors = Array.isArray(draft.preferredCustomColors) ? draft.preferredCustomColors : [];
      avoidCustomColors = Array.isArray(draft.avoidCustomColors) ? draft.avoidCustomColors : [];
      renderAllColors();
      autosaveStatus.textContent = 'Saved progress restored';
    }

    function titleFromName(name) {
      return fieldLabels[name] || String(name || '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function collectFormLines() {
      const data = new FormData(form);
      const grouped = new Map();
      for (const [name, rawValue] of data.entries()) {
        let value = String(rawValue).trim();
        if (!value) continue;
        if (name === 'primary-service') value = serviceNames[value] || value;
        if (!grouped.has(name)) grouped.set(name, []);
        grouped.get(name).push(value);
      }
      const lines = ['NEW PROJECT REQUEST','The Creative Studio','','CUSTOMER INFORMATION'];
      ['full-name','business-name','email','phone','current-web-or-social','business-location'].forEach((name) => {
        const values = grouped.get(name);
        if (values?.length) lines.push(`${titleFromName(name)}: ${values.join(', ')}`);
        grouped.delete(name);
      });
      lines.push('', 'PROJECT SELECTIONS');
      ['primary-service','additional-services','estimated-budget','requested-deadline','deadline-flexibility','frequency','ready-to-begin'].forEach((name) => {
        const values = grouped.get(name);
        if (values?.length) lines.push(`${titleFromName(name)}: ${values.join(', ')}`);
        grouped.delete(name);
      });
      lines.push('', 'DESIGN, CONTENT, AND SERVICE DETAILS');
      for (const [name, values] of grouped.entries()) lines.push(`${titleFromName(name)}: ${values.join(', ')}`);
      lines.push('', 'Please review this request and contact me with the next steps or an estimate.');
      return lines;
    }

    primaryRadios.forEach((radio) => radio.addEventListener('change', () => { showPanel(); updateSummary(); scheduleSave(); }));
    form.addEventListener('input', () => { updateSummary(); updatePhoneRequirement(); scheduleSave(); });
    form.addEventListener('change', () => { updateSummary(); updatePhoneRequirement(); scheduleSave(); });
    document.getElementById('saveDraftButton').addEventListener('click', () => saveDraft(true));
    bindColorBuilder('customColorPicker', 'customColorHex', 'addPreferredColor', 'preferred');
    bindColorBuilder('avoidColorPicker', 'avoidColorHex', 'addAvoidColor', 'avoid');

    form.addEventListener('reset', () => {
      window.setTimeout(() => {
        preferredCustomColors = [];
        avoidCustomColors = [];
        renderAllColors();
        showPanel();
        updatePhoneRequirement();
        updateSummary();
        clearStatus();
        localStorage.removeItem(STORAGE_KEY);
        autosaveStatus.textContent = 'Form cleared';
      }, 0);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      updatePhoneRequirement();
      if (!form.checkValidity()) {
        form.reportValidity();
        setStatus('error', 'Please complete the required fields before sending your request.');
        const invalid = form.querySelector(':invalid');
        invalid?.focus({ preventScroll:true });
        invalid?.scrollIntoView?.({ behavior:'smooth', block:'center' });
        return;
      }
      const business = document.getElementById('businessName').value.trim();
      const service = serviceNames[selectedPrimaryValue()] || '';
      const baseSubject = form.dataset.subject || 'New Creative Studio Project Request';
      const subject = [baseSubject, business || service].filter(Boolean).join(' - ');
      const body = collectFormLines().join('\n');
      const payload = new FormData(form);
      payload.set('form-type', 'project-request');
      payload.set('email-subject', subject);
      payload.set('email-body', body);
      payload.set('_subject', subject);
      payload.set('_captcha', 'false');
      payload.set('_template', 'table');
      payload.set('_honey', '');
      setStatus('success', 'Sending your request directly to The Creative Studio…');
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      saveDraft(false);
      fetch(form.action, { method:'POST', body:payload, headers:{Accept:'application/json'} })
        .then((response) => response.json().catch(() => ({})).then((result) => ({response, result})))
        .then(({response, result}) => {
          if (!response.ok || result.success !== true && result.success !== 'true') throw new Error(result.message || 'Send failed');
          localStorage.removeItem(STORAGE_KEY);
          if (autosaveStatus) autosaveStatus.textContent = 'Request sent';
          setStatus('success', 'Request sent successfully. Jeremy will follow up at the email or phone number you provided.');
        })
        .catch(() => setStatus('error', 'The request could not be sent. Please try again or call 317-494-0879.'))
        .finally(() => { if (submitButton) submitButton.disabled = false; });
    });

    restoreDraft();
    const requestedService = new URLSearchParams(window.location.search).get('service');
    if (requestedService) {
      const clean = requestedService.toLowerCase().replace(/\s+/g, '');
      const normalized = serviceAliases[clean] || serviceAliases[requestedService.toLowerCase()] || requestedService;
      const requestedRadio = primaryRadios.find((radio) => radio.value === normalized);
      if (requestedRadio) requestedRadio.checked = true;
    }
    renderAllColors();
    showPanel();
    updatePhoneRequirement();
    updateSummary();
  });
})();
