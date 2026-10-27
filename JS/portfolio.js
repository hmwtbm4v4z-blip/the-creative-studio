/* Page controller: portfolio.html. Loaded once with defer. */
(function () {
    "use strict";

    const initializePortfolioPage = function () {
        const filters = Array.from(
            document.querySelectorAll(".filter-btn")
        );
        const projects = Array.from(
            document.querySelectorAll(".portfolio-item")
        );
        const emptyState = document.getElementById(
            "portfolioEmptyState"
        );
        const gallery = document.getElementById(
            "portfolioGallery"
        );
        // A cached or re-inserted script must not bind a second set of handlers.
        if (!gallery || gallery.dataset.portfolioReady === "true") return;
        gallery.dataset.portfolioReady = "true";

        const collections = Array.from(gallery.querySelectorAll("[data-portfolio-collection]"));

        const modal = document.getElementById(
            "portfolioModal"
        );
        let modalImage = document.getElementById(
            "portfolioModalImage"
        );
        const modalContent = modal?.querySelector(".modal-content");
        const placeholder = document.getElementById("portfolioModalPlaceholder");
        const fullImage = document.getElementById("portfolioFullImage");
        const modalTitle = document.getElementById(
            "portfolioModalTitle"
        );
        const modalCategory = document.getElementById(
            "portfolioModalCategory"
        );
        const modalDescription = document.getElementById(
            "portfolioModalDescription"
        );
        const modalClose = modal?.querySelector(
            "[data-close-modal]"
        );

        let previousFocus = null;
        let previousOverflow = "";
        let previewGeneration = 0;

        const applyFilter = function (button) {
            const selected = button?.dataset.filter || "all";
            let visibleCount = 0;

            filters.forEach(function (item) {
                const active = item === button;
                item.classList.toggle("active", active);
                item.setAttribute(
                    "aria-pressed",
                    String(active)
                );
            });

            projects.forEach(function (project) {
                // Keep specialist work visible in its broader service category too.
                const categories = (project.dataset.category || "").split(/\s+/);
                const matches =
                    selected === "all" ||
                    categories.includes(selected);

                project.hidden = !matches;

                if (matches) {
                    visibleCount += 1;
                }
            });

            collections.forEach(function (collection) {
                const matching = Array.from(collection.querySelectorAll(".portfolio-stack-card"))
                    .filter(function (card) { return !card.hidden; });
                collection.hidden = matching.length === 0;
                if (selected !== "all" && matching.length && !matching.some(function (card) { return card.open; })) {
                    matching[0].open = true;
                }
            });

            emptyState?.classList.toggle(
                "show",
                visibleCount === 0
            );

            if (gallery) {
                gallery.setAttribute(
                    "aria-label",
                    visibleCount +
                    " portfolio project" +
                    (visibleCount === 1 ? "" : "s") +
                    " available"
                );
            }
        };

        filters.forEach(function (button) {
            button.addEventListener("click", function () {
                applyFilter(button);
            });
        });

        const closeModal = function () {
            if (!modal || modal.hidden) {
                return;
            }

            previewGeneration += 1;
            modalImage.onload = null;
            modalImage.onerror = null;
            modalImage.hidden = true;
            modalImage.removeAttribute("src");
            fullImage.hidden = true;
            fullImage.removeAttribute("href");
            modalContent.setAttribute("aria-busy", "false");
            modal.hidden = true;
            modal.classList.add("hidden");
            document.body.style.overflow = previousOverflow;

            if (
                previousFocus &&
                typeof previousFocus.focus === "function"
            ) {
                previousFocus.focus({ preventScroll: true });
            }

            modal.setAttribute("aria-hidden", "true");
            previousFocus = null;
        };

        const openModal = function (button) {
            if (
                !modal ||
                !modalImage ||
                !modalTitle ||
                !modalCategory ||
                !modalDescription ||
                !modalContent ||
                !placeholder ||
                !fullImage
            ) {
                return;
            }

            // Safari does not always focus a clicked button: remember its trigger.
            previousFocus = button;
            if (modal.hidden) previousOverflow = document.body.style.overflow;
            const generation = ++previewGeneration;

            modalTitle.textContent =
                button.dataset.portfolioTitle || "";
            modalCategory.textContent =
                button.dataset.portfolioCategory || "";
            modalDescription.textContent =
                button.dataset.portfolioDescription || "";
            const cardImage = button.querySelector("img");
            const imageSource =
                button.dataset.portfolioImage ||
                cardImage?.getAttribute("src") ||
                "";
            const missing =
                button.dataset.artworkPlaceholder === "true" ||
                !imageSource;
            // A fresh image prevents late events or old artwork from another preview.
            const preview = modalImage.cloneNode(false);
            preview.removeAttribute("src");
            preview.hidden = true;
            preview.alt = cardImage?.alt || button.dataset.portfolioTitle || "Portfolio project";
            modalImage.onload = null;
            modalImage.onerror = null;
            modalImage.replaceWith(preview);
            modalImage = preview;
            fullImage.hidden = true;
            fullImage.removeAttribute("href");
            placeholder.hidden = false;
            modalContent.setAttribute("aria-busy", String(!missing));
            placeholder.textContent = missing
                ? button.dataset.portfolioTitle || "Project artwork"
                : "Loading project preview…";
            preview.onerror = function () {
                if (generation !== previewGeneration || modal.hidden) return;
                preview.hidden = true;
                fullImage.hidden = true;
                modalContent.setAttribute("aria-busy", "false");
                placeholder.hidden = false;
                placeholder.textContent =
                    (button.dataset.portfolioTitle || "Project") +
                    " preview is temporarily unavailable.";
            };
            preview.onload = function () {
                if (generation !== previewGeneration || modal.hidden || missing) return;
                preview.hidden = false;
                placeholder.hidden = true;
                modalContent.setAttribute("aria-busy", "false");
                fullImage.href = imageSource;
                fullImage.setAttribute("aria-label", "Open full-size image: " + button.dataset.portfolioTitle);
                fullImage.hidden = false;
            };

            modal.hidden = false;
            modal.classList.remove("hidden");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            modal.scrollTop = 0;
            modalContent.scrollTop = 0;
            modalClose?.focus({ preventScroll: true });
            if (!missing) {
                preview.src = imageSource;
                if (preview.complete && preview.naturalWidth > 0) preview.onload();
            }
        };

        projects.forEach(function (project) {
            const button = project.querySelector(
                "button[data-portfolio-title]"
            );

            button?.addEventListener("click", function () {
                openModal(button);
            });
        });

        modalClose?.addEventListener(
            "click",
            closeModal
        );

        modal?.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                modal &&
                !modal.classList.contains("hidden")
            ) {
                closeModal();
            }
        });

        const activeFilter =
            filters.find(function (button) {
                return button.classList.contains("active");
            }) ||
            filters[0];

        if (activeFilter) {
            applyFilter(activeFilter);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializePortfolioPage,
            { once: true }
        );
    }
    else {
        initializePortfolioPage();
    }
})();
