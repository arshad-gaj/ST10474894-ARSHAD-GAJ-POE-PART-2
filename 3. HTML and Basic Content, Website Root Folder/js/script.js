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