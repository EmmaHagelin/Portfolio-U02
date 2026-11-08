//CV from json - about.html and tech-stack.html

import { fetchJson } from "./api.js";
import { createElement, showStatus, clearStatus } from "./dom.js";
import { observeReveals } from "./reveal.js"

let cvStatus, educationList, workList, techList;

export function initCV(elements) {
    ({ cvStatus, educationList, workList, techList } = elements);
    loadCV();
}

async function loadCV() {
    const loadingTimer = setTimeout(() => showStatus(cvStatus, "Loading..."), 400);

    try {
        const cv = await fetchJson("json/cv.json");

        //Only render the parts that exist on this page
        
        if (educationList) renderTimeline(educationList, cv.education);
        if (workList) renderTimeline(workList, cv.work);
        if (techList) renderTechStack(techList, cv.techstack);

        clearStatus(cvStatus);
    } catch (error) {
        console.warn("cv.json could not be loaded:", error.message);
        showStatus(cvStatus, "This content could not be loaded right now.", loadCV);
    } finally {
        clearTimeout(loadingTimer);
    }
}

//Used for both education and work 
function renderTimeline(list, entries = []) {
    if (entries.length === 0) {
        list.replaceChildren(createElement("li", "status-box__text", "Nothing here yet."));
        return;
    }
    
    const items = entries.map((entry) => {
        const item = createElement("li", "timeline__item");
        item.append(
            createElement("p", "timeline__period", entry.period),
            createElement("h3", "timeline__title", entry.title),
            createElement("p", "timeline__place", entry.place)
        );

        //type is optional in cv.json ("Full time" or "Apprenticeship")
        if(entry.type) item.append(createElement("p", "tag timeline__type", entry.type));
        return item;
    });

    list.replaceChildren(...items);
}

    function renderTechStack(list, groups = []) {
        const items = groups.map((group) => {
            const item = createElement("li");
            const card = createElement("article", "card reveal");
            const tags = createElement("ul", "tags");

            group.items.forEach((skill) => tags.append(createElement("li", "tag", skill)));
            card.append(createElement("h2", "card-title", group.category), tags);
            item.append(card);
            return item;
        });

        list.replaceChildren(...items);
        observeReveals(list);
    }
