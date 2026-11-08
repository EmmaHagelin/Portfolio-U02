// Mobile mmenu - every page

export function initMenu(menuButton, navLinks) {
    function setMenuOpen(isOpen) {
        navLinks.classList.toggle("is-open", isOpen); 
        menuButton.setAttribute("aria-expanded", isOpen);
        }

        menuButton.addEventListener("click", () => {
            setMenuOpen(!navLinks.classList.contains("is-open"));
        });

        //Close the menu with Escape and put focus back on the menu button
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" &&  navLinks.classList.contains("is-open")) {
                setMenuOpen(false);
                menuButton.focus();
            }
        });
    }
