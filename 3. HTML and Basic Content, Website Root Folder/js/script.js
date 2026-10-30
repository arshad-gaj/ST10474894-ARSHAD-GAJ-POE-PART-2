"use strict";

/*
    NovaTech Computer Solutions
    WEDE5020 POE Part 3
    Main JavaScript File
*/
// =================================
// FAQ Accordion
// =================================

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question, index) => {
    const faqItem = question.closest(".faq-item");
    const faqAnswer = faqItem.querySelector(".faq-answer");

    const answerId = `faq-answer-${index + 1}`;

    faqAnswer.id = answerId;
    question.setAttribute("aria-expanded", "false");
    question.setAttribute("aria-controls", answerId);

    question.addEventListener("click", () => {
        const isOpen = faqItem.classList.contains("active");

        // Close any currently open FAQ item
        faqQuestions.forEach((otherQuestion) => {
            const otherItem = otherQuestion.closest(".faq-item");
            const otherAnswer = otherItem.querySelector(".faq-answer");

            otherItem.classList.remove("active");
            otherQuestion.setAttribute("aria-expanded", "false");
            otherAnswer.style.maxHeight = null;
        });

        // Open the selected item if it was previously closed
        if (!isOpen) {
            faqItem.classList.add("active");
            question.setAttribute("aria-expanded", "true");
            faqAnswer.style.maxHeight = `${faqAnswer.scrollHeight}px`;
        }
    });
});

// Keep an open FAQ correctly sized on responsive screens
window.addEventListener("resize", () => {
    const openAnswer = document.querySelector(".faq-item.active .faq-answer");

    if (openAnswer) {
        openAnswer.style.maxHeight = `${openAnswer.scrollHeight}px`;
    }
});
// =================================
// Interactive Leaflet Map
// =================================

const mapElement = document.getElementById("map");

if (mapElement && typeof L !== "undefined") {
    const johannesburgCoordinates = [-26.2041, 28.0473];

    const map = L.map("map").setView(johannesburgCoordinates, 12);

   L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
        maxZoom: 19,
        attribution:
            "Tiles &copy; Esri"
    }
).addTo(map);

    const serviceMarker = L.marker(johannesburgCoordinates).addTo(map);

serviceMarker.bindPopup(
    `
        <strong>NovaTech Computer Solutions</strong><br>
        Johannesburg Service Area<br>
        Computer products, repairs and IT support.
    `,
    {
        maxWidth: 220,
        minWidth: 180
    }
);

    L.circle(johannesburgCoordinates, {
        radius: 12000,
        color: "#173b67",
        fillColor: "#f5a623",
        fillOpacity: 0.12,
        weight: 2
    })
        .addTo(map)
        .bindPopup("NovaTech's primary Johannesburg service area.");

    if (window.innerWidth > 768) {
    serviceMarker.openPopup();
}
}
// =================================
// Product Gallery Lightbox
// =================================

const galleryTriggers = Array.from(
    document.querySelectorAll(".gallery-trigger")
);

const lightbox = document.getElementById("product-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrevious = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

let currentImageIndex = 0;
let lastFocusedElement = null;

if (
    galleryTriggers.length > 0 &&
    lightbox &&
    lightboxImage &&
    lightboxCaption &&
    lightboxClose &&
    lightboxPrevious &&
    lightboxNext
) {
    const updateLightbox = (index) => {
        currentImageIndex =
            (index + galleryTriggers.length) % galleryTriggers.length;

        const currentTrigger = galleryTriggers[currentImageIndex];
        const thumbnail = currentTrigger.querySelector("img");

        lightboxImage.src = currentTrigger.dataset.full;
        lightboxImage.alt = thumbnail ? thumbnail.alt : "";
        lightboxCaption.textContent =
            currentTrigger.dataset.caption || "";
    };

    const openLightbox = (index) => {
        lastFocusedElement = document.activeElement;

        updateLightbox(index);

        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");

        lightboxClose.focus();
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");

        lightboxImage.src = "";

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };

    const showPreviousImage = () => {
        updateLightbox(currentImageIndex - 1);
    };

    const showNextImage = () => {
        updateLightbox(currentImageIndex + 1);
    };

    galleryTriggers.forEach((trigger, index) => {
        trigger.addEventListener("click", () => {
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrevious.addEventListener("click", showPreviousImage);
    lightboxNext.addEventListener("click", showNextImage);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (lightbox.hidden) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showPreviousImage();
        }

        if (event.key === "ArrowRight") {
            showNextImage();
        }
    });
}
// =================================
// Dynamic Product Search and Filter
// =================================

const productSearchInput = document.getElementById("product-search");
const clearProductSearch = document.getElementById("clear-product-search");
const productSearchStatus = document.getElementById("product-search-status");
const noProductResults = document.getElementById("no-product-results");
const searchableProductCards = Array.from(
    document.querySelectorAll(".products-grid .product-card")
);

if (
    productSearchInput &&
    clearProductSearch &&
    productSearchStatus &&
    noProductResults &&
    searchableProductCards.length > 0
) {
    const filterProducts = () => {
        const searchTerm = productSearchInput.value
            .trim()
            .toLowerCase();

        const searchWords = searchTerm
            .split(/\s+/)
            .filter(Boolean);

        let visibleProducts = 0;

        searchableProductCards.forEach((card) => {
            const visibleText = card.textContent.toLowerCase();
            const extraKeywords = (
                card.dataset.search || ""
            ).toLowerCase();

            const searchableContent =
                `${visibleText} ${extraKeywords}`;

            const matchesSearch =
                searchWords.length === 0 ||
                searchWords.every((word) =>
                    searchableContent.includes(word)
                );

            card.hidden = !matchesSearch;

            if (matchesSearch) {
                visibleProducts++;
            }
        });

        if (searchTerm === "") {
            productSearchStatus.textContent =
                `Showing all ${searchableProductCards.length} product categories.`;
        } else if (visibleProducts === 1) {
            productSearchStatus.textContent =
                `1 product category matches "${productSearchInput.value.trim()}".`;
        } else {
            productSearchStatus.textContent =
                `${visibleProducts} product categories match "${productSearchInput.value.trim()}".`;
        }

        noProductResults.hidden = visibleProducts !== 0;
    };

    productSearchInput.addEventListener("input", filterProducts);

    clearProductSearch.addEventListener("click", () => {
        productSearchInput.value = "";
        filterProducts();
        productSearchInput.focus();
    });

    productSearchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && productSearchInput.value !== "") {
            productSearchInput.value = "";
            filterProducts();
        }
    });

    filterProducts();
}
// =================================
// Enquiry Form Validation
// =================================

const enquiryForm = document.getElementById("enquiry-form");
const enquiryStatus = document.getElementById("enquiry-status");

if (enquiryForm && enquiryStatus) {
    const fullName = enquiryForm.elements.namedItem("fullname");
    const phone = enquiryForm.elements.namedItem("phone");
    const message = enquiryForm.elements.namedItem("message");
    const fields = Array.from(
        enquiryForm.querySelectorAll("input, select, textarea")
    );

    // Run our checks before displaying browser validation messages.
    enquiryForm.noValidate = true;

    const validateField = (field) => {
        field.setCustomValidity("");

        if (field === fullName && field.value.trim().length < 2) {
            field.setCustomValidity(
                "Please enter your name using at least 2 characters."
            );
        }

        if (field === phone && field.value.trim() !== "") {
            const phoneNumber = field.value.replace(/[\s()-]/g, "");

            if (!/^(0[1-9]\d{8}|\+27[1-9]\d{8})$/.test(phoneNumber)) {
                field.setCustomValidity(
                    "Enter a South African number, such as 082 123 4567 or +27 82 123 4567."
                );
            }
        }

        if (field === message && field.value.trim().length < 10) {
            field.setCustomValidity(
                "Please describe your enquiry using at least 10 characters, excluding surrounding spaces."
            );
        }

        field.setAttribute(
            "aria-invalid",
            String(!field.validity.valid)
        );
    };

    fields.forEach((field) => {
        field.addEventListener("input", () => {
            validateField(field);
            enquiryStatus.textContent = "";
        });

        field.addEventListener("blur", () => {
            validateField(field);
        });
    });

    enquiryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        enquiryStatus.textContent = "";

        fields.forEach(validateField);

        if (!enquiryForm.reportValidity()) {
            enquiryStatus.textContent =
                "Please correct the highlighted field and submit again.";
            return;
        }

       const enquiryType =
    enquiryForm.elements.namedItem("enquiry-type").value;

const responses = {
    product:
        "Product pricing and availability depend on the model and specifications. Contact NovaTech with the product name and quantity to confirm stock and pricing.",
    service:
        "Service costs depend on the work required and the condition of your computer. Contact NovaTech to arrange an assessment and confirm appointment availability.",
    quotation:
        "A quotation requires the product or service details, specifications and quantity. Contact NovaTech with these details to request an accurate price.",
    support:
        "For technical support, include your device model, operating system and any error message. Do not include passwords. The next step is to contact NovaTech for assistance.",
    other:
        "For other enquiries, contact NovaTech with your requirements so the appropriate assistance can be confirmed."
};

enquiryStatus.textContent =
    `Thank you, ${fullName.value.trim()}. ${responses[enquiryType]} ` +
    "This is an on-page guidance response; your details have not been sent. " +
    "Use the Contact page to get in touch.";
    });

    enquiryForm.addEventListener("reset", () => {
        enquiryStatus.textContent = "";

        fields.forEach((field) => {
            field.setCustomValidity("");
            field.removeAttribute("aria-invalid");
        });
    });
}
// =================================
// Contact Form Validation
// =================================

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

if (contactForm && contactStatus) {
    const contactName = contactForm.elements.namedItem("fullname");
    const contactMessage = contactForm.elements.namedItem("message");

    const contactFields = Array.from(
        contactForm.querySelectorAll("input, select, textarea")
    );

    contactForm.noValidate = true;

    const validateContactField = (field) => {
        field.setCustomValidity("");

        if (field === contactName && field.value.trim().length < 2) {
            field.setCustomValidity(
                "Please enter your name using at least 2 characters."
            );
        }

        if (
            field === contactMessage &&
            field.value.trim().length < 10
        ) {
            field.setCustomValidity(
                "Please enter at least 10 characters, excluding surrounding spaces."
            );
        }

        field.setAttribute(
            "aria-invalid",
            String(!field.validity.valid)
        );
    };

    contactFields.forEach((field) => {
        field.addEventListener("input", () => {
            validateContactField(field);
            contactStatus.textContent = "";
        });

        field.addEventListener("blur", () => {
            validateContactField(field);
        });
    });

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        contactStatus.textContent = "";

        contactFields.forEach(validateContactField);

        if (!contactForm.reportValidity()) {
            contactStatus.textContent =
                "Please correct the highlighted field and try again.";
            return;
        }

      const senderName = contactName.value.trim();
const senderEmail =
    contactForm.elements.namedItem("email").value.trim();
const messageType =
    contactForm.elements.namedItem("message-type").value;

const recipient = "info@novatechsolutions.co.za";
const subject = `NovaTech Website: ${messageType}`;

const emailBody = [
    `Name: ${senderName}`,
    `Email: ${senderEmail}`,
    `Message Type: ${messageType}`,
    "",
    "Message:",
    contactMessage.value.trim()
].join("\r\n");

const emailLink =
    `mailto:${recipient}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(emailBody)}`;

contactStatus.textContent =
    "Your email is ready. If your email application opens, " +
    "review the details and click Send there. " +
    "If nothing opens, configure a default email application " +
    `or email ${recipient} manually.`;

window.location.href = emailLink;
    });

    contactForm.addEventListener("reset", () => {
        contactStatus.textContent = "";

        contactFields.forEach((field) => {
            field.setCustomValidity("");
            field.removeAttribute("aria-invalid");
        });
    });
}
