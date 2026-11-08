//CV from json - about.html and tech-stack.html

import { fetchJson } from "./Api.js";
import { createElement, showStatus, clearStatus } from "./dom.js";
import { observeReveals } from "./Reveal.js"

let cvStatus, educationList, workList, techList;

export function initCV(elements) {
    ({ cvStatus, educationList, workList, techList } = elements);
    loadCV();
}

async function loadCV() {
    showStatus(cvStatus, "Loading...");

    try {
        const cv = await fetchJson("cv.json");

        //Only render the parts that exist on this page
        
        if (educationList) renderTimeline(educationList, cv.education);
        if (workList) renderTimeline(workList, cv.work);
        if (techList) renderTimeline(workList, cv.techstack);

        clearStatus(cvStatus);
    } catch (error) {
        console.warn("cv.json could not be loaded:", error.messege);
        showStatus(cvStatus, "This content could not be loaded right now.", loadCV);
    }
}

//Used for both education and work 
function renderTimeline(list, entries = []) {
    if (entries.length === 0) {
        list.replaceChildren(createElement("li", "status-box__text", "Nothing here yet."));
        return;
    }
    
    const items = entries.map((entry) => {
        const items = createElement("li", "timeline__item");
        items.append(
            createElement("p", "timeline__period", entry.period),
            createElement("h3", "timeline__title", entry.title),
            createElement("p", "timeline__place", entry.place)
        );

        //type is optional in cv.json ("Full time" or "Apprenticeship")
        if(entry.type) items.append(createElement("p", "tag timeline__type", entry.type));
        return items;
    });

    list.replaceChildren(...items);

    function renderTechStack(list, groups = []) {
        const items = groups.map((group) => {
            const item = createElement("li");
            const card = createElement("article", "card reveal");
            const tags = createElement("ul", "tags");

            group.items.forEach((skill) => tags.append(createElement("li", "tag", skill)));
            card.append(createElement("h2", "card-title", group.category), tags);
            item.append(card);
            return items;
        });

        list.replaceChildren(...items);
        observeReveals(list);
    }
}