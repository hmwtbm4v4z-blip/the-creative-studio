/* Page controller: pricing.html. Loaded once with defer. */
(function () {
    "use strict";

    function initializePricingFAQ() {
        const container = document.querySelector(
            "#pricing-faq .faq-container"
        );

        if (
            !container ||
            container.dataset.pricingFaqReady === "true"
        ) {
            return;
        }

        const records = Array.from(
            container.querySelectorAll(".faq-item")
        ).map(item => {
            const button =
                item.querySelector(".faq-question");
            const answer =
                item.querySelector(".faq-answer");

            return button && answer
                ? { item, button, answer }
                : null;
        }).filter(Boolean);

        if (!records.length) {
            return;
        }

        function setOpen(record, open) {
            record.item.classList.toggle(
                "is-open",
                open
            );

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
                open
                    ? record.answer.scrollHeight + "px"
                    : "0px",
                "important"
            );
        }

        container.dataset.pricingFaqReady = "true";
        container.classList.add(
            "pricing-faq-enhanced"
        );

        records.forEach((record, index) => {
            setOpen(record, index === 0);

            record.button.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    const shouldOpen =
                        record.button.getAttribute(
                            "aria-expanded"
                        ) !== "true";

                    records.forEach(other => {
                        if (other !== record) {
                            setOpen(other, false);
                        }
                    });

                    setOpen(record, shouldOpen);
                },
                true
            );

            record.button.addEventListener(
                "keydown",
                event => {
                    const current =
                        records.indexOf(record);
                    let next = null;

                    if (event.key === "ArrowDown") {
                        next =
                            (current + 1) %
                            records.length;
                    }
                    else if (event.key === "ArrowUp") {
                        next =
                            (
                                current -
                                1 +
                                records.length
                            ) %
                            records.length;
                    }
                    else if (event.key === "Home") {
                        next = 0;
                    }
                    else if (event.key === "End") {
                        next =
                            records.length - 1;
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

        window.addEventListener(
            "resize",
            () => {
                records.forEach(record => {
                    if (
                        record.button.getAttribute(
                            "aria-expanded"
                        ) === "true"
                    ) {
                        record.answer.style.setProperty(
                            "max-height",
                            record.answer.scrollHeight +
                                "px",
                            "important"
                        );
                    }
                });
            }
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializePricingFAQ,
            { once: true }
        );
    }
    else {
        initializePricingFAQ();
    }
})();
