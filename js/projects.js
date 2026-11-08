// Projects from the GitHub Api + projects-html

import { GITHUB_USER, MAX_PROJECTS } from "./config.js";
import { fetchJson } from "./api.js";
import { createElement, showStatus, clearStatus } from "./dom.js";
import { observeReveals } from "./reveal.js";

// The page elements this file works with
let projectStatus, projectList, projectFilters, filterResult;

export function initProjects(elements) {
    ({ projectStatus, projectList, projectFilters, filterResult }
        = elements);

        //One listener on the group instead of one per button.
        // It keeps workin even though the buttons are created later
        projectFilters.addEventListener("click", (event) => {
            const button = event.target.closest(".filter-button");
            if (button) filterProjects(button.dataset.language);
        });

        loadProjects();
}

// Loading
async function loadProjects() {
    showProjectSkeletons();
    showStatus(projectStatus, "Loading projects from GitHub...");
    projectFilters.hidden = true;

    const url = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`;
    
    try {
        const repos = await fetchJson(url, {
            headers: { Accept: "application/vnd.github+json" },
        });

        const projects = repos.filter((repo) => !repo.fork) //skips repos that are copies of someone else's
        .slice(0, MAX_PROJECTS);

        if (projects.length === 0) {
            projectList.replaceChildren();
            showStatus(projectStatus, "There are no public projects to show yet - check back soon!");
            return;
        }

        projectList.replaceChildren(...projects.map(createProjectItem));
        observeReveals(projectList);
        renderFilters(projects);
        clearStatus(projectStatus);
    } catch (error) {
        console.warn("GitHub projects could not be loaded:", error.message);
        projectList.replaceChildren();
        showStatus(projectStatus, getProjectErrorMessage(error), loadProjects);
    } finally {
        projectList.removeAttribute("aria-busy");
    }
}

//Shimmering placeholder cards while we wait for GitHub
function showProjectSkeletons() {
    const skeletons = Array.from({ length: 3 }, () => {
        const item = createElement("li", "card skeleton");
        item.setAttribute("aria-hidden", "true");
        return item;
    });
    projectList.replaceChildren(...skeletons);
    projectList.setAttribute("aria-busy", "true");
}

function getProjectErrorMessage(error) {
    switch (error.status) {
        case 403:
            case 429:
                return "GitHub has limited how often projects can be loaded. Please try again in a few minutes.";
                case 404:
                    return "The GitHub profile could not be found.";
                    case 0: 
                    return `Projects could not be loaded. ${error.message}`;
                    default:
                        return "Something went wrong on GitHub's side. Please try again later.";
    }
}

// Building the cards
// Turns a repo name into a nicer title
function formatRepoName(name) {
    return name.replaceAll("-", " ").replaceAll("_", " ");
}

function createProjectItem(repo) {
    const title = formatRepoName(repo.name);
    const language = repo.language ?? "Other";
    
    const item = createElement("li");
    item.dataset.language  = language;

    const card = createElement("article", "card project-card reveal");

    const links = createElement("div", "project-links");
    links.append(createProjectLink(repo.html_url, "Code", title));
    if (repo.homepage) links.append(createProjectLink(repo.homepage, "Live", title));

    const meta = createElement("div", "project-meta");
    meta.append(createElement("span", "project-lang", language), links);

    card.append(
        createElement("h2", "project-card__title", title),
        createElement("p", "project-card__description", repo.description ?? "No description yet."),
        meta
    );
    item.append(card);
    return item;
}

//"Code" - with hidden text so a screen reader hears "Code for ..."

function createProjectLink(href, text, projectTitle) {
    const link = createElement("a", "", text);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener";

    const hiddenText = createElement("span", "visually-hidden", ` for ${projectTitle} (opens in a new tab)`);
    const arrow = createElement("span", "", " →");
    arrow.setAttribute("aria-hidden", "true");

    link.append(hiddenText, arrow);
    return link;
}

//Filter by language
function renderFilters(projects) {
    const languages = [...new Set(projects.map((repo) => repo.language ?? "Other"))].sort();

    //a filter is only useful if there are at least two languges
    if (languages.length < 2) {
        projectFilters.hidden = true;
        return;
    }

    const buttons = ["All", ...languages].map((language) => {
        const button = createElement("button", "filter-button", language);
        button.type = "button";
        button.dataset.language = language;
        button.setAttribute("aria-pressed", language === "All");
        return button;
    });

    projectFilters.replaceChildren(...buttons);
    projectFilters.hidden = false;
}

function filterProjects(selectedLanguage) {
    projectFilters.querySelectorAll(".filter-button").forEach((button) => {
        button.setAttribute("aria-pressed", button.dataset.language === selectedLanguage);
    });

    const items = [...projectList.children];
    let visibleCount = 0;

    items.forEach((item) => {
        const isVisible = selectedLanguage === "All" || item.dataset.language === selectedLanguage;
        item.hidden = !isVisible;
        if (isVisible) visibleCount++;
    });

    //Read out by screen readers, not shown on screen
    filterResult.textContent = `Showing ${visibleCount} of ${items.length} projects.`;
}