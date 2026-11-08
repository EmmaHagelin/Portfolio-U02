//Fade-in when scrolling

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

export function observeReveals(container = document) {
    container.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => {
        revealObserver.observe(element);
    });
}