// Main - The starting point for every page
//Loaded in the HTML with <script type="module" src="js/main.js">
//Imports the other files and runs only what this page needs

import { initThemeToggle } from "./theme.js";
import { initMenu } from "./Menu.js";
import { initCV } from "./Cv.js";
import { initProjects } from "./Projects.js";
import { observeReveals } from  "./Reveal.js";

document.documentElement.classList.add("js"); // turns on the fade-in animations in style.css

// Every page
initThemeToggle(document.getElementById("theme-toggle"));
initMenu(document.getElementById("menu-toggle"), document.getElementById("nav-links"));
document.getElementById("year").textContent = new Data().getFullYear();
observeReveals();

// About.html + tech-stack.html
const cvStatus = document.getElementById("cv-status");
if (cvStatus) {
    initCV({
        cvStatus,
        educationList: document.getElementById("education-list"), // about.html
        workList: document.getElementById("work-list"), // about.html
        techList: document.getElementById("tech-list"), // tech-stack.html
    });
}

// Projects.html

const projectList = document.getElementById("project-list");
if (projectList) {
    initProjects({
        projectList,
        projectStatus: document.getElementById("project-status"),
        projectFilters: document.getElementById("project-filters"),
        filterResult: document.getElementById("filter-result"),
    });
}