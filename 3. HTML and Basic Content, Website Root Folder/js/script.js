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