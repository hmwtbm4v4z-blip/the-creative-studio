/* Page controller: contact.html. Loaded once with defer. */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("contactFormStatus");
    const submitButton = document.getElementById("contactSubmitButton");
    const submitLabel = document.getElementById("contactSubmitLabel");
    const startedAt = document.getElementById("contactFormStartedAt");
    const preference = document.getElementById("contactPreference");
    const phone = document.getElementById("contactPhone");

    if (!form || !status || !submitButton || !submitLabel) {
        return;
    }

    if (startedAt) {
        startedAt.value = String(Date.now());
    }

    function updatePhoneRequirement() {
        if (!preference || !phone) {
            return;
        }

        const needsPhone =
            preference.value === "Phone Call" ||
            preference.value === "Text Message";

        phone.required = needsPhone;
        phone.setAttribute("aria-required", String(needsPhone));
    }

    if (preference) {
        preference.addEventListener("change", updatePhoneRequirement);
        updatePhoneRequirement();
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        updatePhoneRequirement();

        if (!form.checkValidity()) {
            status.className = "form-status error";
            status.textContent =
                "Please complete all required fields correctly. A phone number is required when phone call or text message is selected.";
            form.reportValidity();
            return;
        }

        const value = (id) => {
            const field = document.getElementById(id);
            return field ? String(field.value || "").trim() : "";
        };
        const subject = value("contactSubject") || "Creative Studio Website Message";
        const body = [
            "NEW WEBSITE MESSAGE",
            "The Creative Studio",
            "",
            `Name: ${value("contactName")}`,
            `Business: ${value("contactBusiness") || "Not provided"}`,
            `Email: ${value("contactEmail")}`,
            `Phone: ${value("contactPhone") || "Not provided"}`,
            `Preferred Contact Method: ${value("contactPreference")}`,
            `Topic: ${value("contactTopic")}`,
            `Related Order or Project: ${value("contactOrderNumber") || "Not provided"}`,
            "",
            "Message:",
            value("contactMessage")
        ].join("\n");

        const payload = new FormData(form);
        payload.set("form-type", "contact-message");
        payload.set("email-subject", subject);
        payload.set("email-body", body);
        payload.set("_subject", subject);
        payload.set("_captcha", "false");
        payload.set("_template", "table");
        payload.set("_honey", "");
        if (/^https?:$/.test(window.location.protocol)) payload.set("_url", window.location.href);
        status.className = "form-status success";
        status.textContent = "Sending your message directly to The Creative Studio…";
        submitLabel.textContent = "Sending…";
        submitButton.disabled = true;
        fetch(form.action, { method:"POST", mode:"cors", body:payload, headers:{Accept:"application/json"} })
            .then((response) => response.json().catch(() => ({})).then((result) => ({response, result})))
            .then(({response, result}) => {
                if (!response.ok || result.success !== true && result.success !== "true") throw new Error(result.message || "Send failed");
                status.className = "form-status success";
                status.textContent = "Message sent successfully. Jeremy will get back to you soon.";
                submitLabel.textContent = "Message Sent";
            })
            .catch((error) => {
                status.className = "form-status error";
                status.textContent = window.location.protocol === "file:"
                    ? "This form needs to be opened from the live website, not directly from a downloaded HTML file."
                    : (error?.message ? `The message could not be sent: ${error.message}. Please try again or call 317-494-0879.` : "The message could not be sent. Please try again or call 317-494-0879.");
                submitLabel.textContent = "Send Message";
            })
            .finally(() => { submitButton.disabled = false; });
    });
});
;
(function () {
    "use strict";

    function initContactFAQ() {
        const container = document.querySelector("#faq .faq-container");

        if (!container || container.dataset.contactFaqReady === "true") {
            return;
        }

        const records = Array.from(
            container.querySelectorAll(".faq-item")
        ).map(item => {
            const button = item.querySelector(".faq-question");
            const answer = item.querySelector(".faq-answer");

            return button && answer ? { item, button, answer } : null;
        }).filter(Boolean);

        if (!records.length) {
            return;
        }

        function setOpen(record, open) {
            record.item.classList.toggle("is-open", open);
            record.item.classList.remove("active");
            record.button.setAttribute(
                "aria-expanded",
                open ? "true" : "false"
            );
            record.answer.setAttribute(
                "aria-hidden",
                open ? "false" : "true"
            );
            record.answer.style.setProperty(
                "max-height",
                open ? record.answer.scrollHeight + "px" : "0px",
                "important"
            );
        }

        container.dataset.contactFaqReady = "true";
        container.classList.add("contact-faq-enhanced");

        records.forEach((record, index) => {
            setOpen(record, index === 0);

            record.button.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    const willOpen =
                        record.button.getAttribute("aria-expanded") !== "true";

                    records.forEach(other => {
                        if (other !== record) {
                            setOpen(other, false);
                        }
                    });

                    setOpen(record, willOpen);
                },
                true
            );

            record.button.addEventListener(
                "keydown",
                event => {
                    const current = records.indexOf(record);
                    let next = null;

                    if (event.key === "ArrowDown") {
                        next = (current + 1) % records.length;
                    } else if (event.key === "ArrowUp") {
                        next = (current - 1 + records.length) % records.length;
                    } else if (event.key === "Home") {
                        next = 0;
                    } else if (event.key === "End") {
                        next = records.length - 1;
                    }

                    if (next !== null) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        records[next].button.focus();
                    }
                },
                true
            );
        });

        window.addEventListener("resize", () => {
            records.forEach(record => {
                if (record.button.getAttribute("aria-expanded") === "true") {
                    record.answer.style.setProperty(
                        "max-height",
                        record.answer.scrollHeight + "px",
                        "important"
                    );
                }
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initContactFAQ, {
            once: true
        });
    } else {
        initContactFAQ();
    }
})();
