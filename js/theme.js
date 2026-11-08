// Theme toggle (light/dark) - every page
//The theme is picked before the page is drawn by theme-init.js

const root = document.documentElement;

export function initThemeToggle(themeButton) {
    function updateThemeButton() {
        const isDark = root.classList.contains("dark");
        themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");  
    }

    themeButton.addEventListener("click", () => {
        const isDark = root.classList.toggle("dark");
        updateThemeButton();
        try {
            localStorage.setItem("theme", isDark ? "dark" : "light"); //remembered on every page
        } catch (error) {
            //localStorage blocked - the theme still changes, it just isn't remembered
        }
    });

    updateThemeButton();
}