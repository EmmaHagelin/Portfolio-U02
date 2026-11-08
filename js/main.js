// Main - The starting point for every page
//Loaded in the HTML with <script type="module" src="js/main.js">
//Imports the other files and runs only what this page needs

import { initThemeToggle } from "./theme.js";
import { initMenu } from "./menu.js";
import { initCV } from "./cv.js";
import { initProjects } from "./projects.js";
import { observeReveals } from  "./reveal.js";

observeReveals();
document.documentElement.classList.add("js");

//Every page
const themeButton = document.getElementById("theme-toggle");
if (themeButton) initThemeToggle(themeButton);

const menuButton = document.getElementById("theme-toggle");
const navLinks = document.getElementById("nav-links");
if (menuButton && navLinks) initMenu(menuButton, navLinks);

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// About.html + tech-stack.html
const cvStatus = document.getElementById("cv-status");
if (cvStatus) {
    initCV({
        cvStatus,
        educationList: document.getElementById("education-list"),
        workList: document.getElementById("work-list"),
        techList: document.getElementById("tech-list"),
    });
}

// projects.html

const projectList = document.getElementById("project-list");
if (projectList) {
    initProjects({
        projectList,
        projectStatus: document.getElementById("project-status"),
        projectFilters: document.getElementById("project-filters"),
        filterResult: document.getElementById("filter-result"),
    });
}