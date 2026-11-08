# Portfolio-U02
My portfolio - Schoolassignment 

**Grade aim: VG**
**live site:** https://emmahagelin.github.io/Portfolio-U02/
**Design (Figma):** https://www.figma.com/design/r76vYcXArd2nIvJDPLPegj/u02-design
Feedback from U01: The live link is now copied directly from GitHub Pages and tested. Dark mode now works both with the theme button and automatically from the visitor's system setting.
________________________________
Reflection:

###The data’s journey
When the page loads, main.js calls initProjects() which calls loadProjects() in projects.js. Skeleton cards and a loading message appear while data is requested.

Through fetchJson() in api.js, the browser sends a GET request to https://api.github.com/users/EmmaHagelin/repos?sort=updated&per_page=30.Github returns a status code, such as 200 for success and a JSON array containing repository objects with properties such as name, description, language and html_url.

The code checks response.ok, converts the response to JSON, filters out forks and selects six repositories. It creates cards, replaces the skeletons using replaceChildren(), renders the filters with renderFilters() and removes the loading message.

###Two data sources
My CV comes from json/cv.json, while my projects come from GitHub API. Keeping my cv in JSON separates content from presentation and its structure is predictable because I control it.
Both sources use fetchJson(), avoiding duplicated request logic. However, GitHub can be slow, unavailable or rate-limited. Its data can also contain null values, so I use ?? to provide fallback text such as “No description yet.” and “Other”.

I learned that fetch paths are relative to the page URL, while import paths are relative to the JavaScript file. GitHub pages use a project subpath, so root-relative paths can fail after deployment.

###DOM manipulation and events
I use createElement() and textContent to create content safely. Unlike innerHTML, textContent treats API data as text, reducing the risk of cross-site scripting. .map() creates project elements and replaceChildren() replaces existing content in one operation.
The filter buttons use even delegation: one click listener on their parent handles dynamically generated buttons. 

IntersectionObserver triggers fade-in animations when elements enter view, while prefers-reduced-motion respects visitors who prefer less animation.
The theme button toggles the dark class and saves the preference. The hamburger button controls the menu with Escape and returns focus to its button.

###Modern JavaScript
I organised my code into ES moduled such as api.js, projects.js and main.js. This seperates resposibilities and allows fetchJson() to be reused for the CV and projects.

In initProjects(), I use destructuring to extract the elements the function needs:

({ projectStatus, projectList, projectFilters, filterResult } = elements);

This avoids repeatedly accessing properties on elements. I also use spread syntax in projectList.replaceChildren(...projects.map(createProjectItem)) to pass the generated elements as individual arguments. In renderFilters(), [...new Set(projects.map((rep) => repo.language ?? "Other"))] removes duplicate languages before creating filters.


###Semantic HTML and accessibility
I use semantic elements such as article, ul, li and button. Each page has an H1, with lower-level headings for cards and timeline entries. Attributes such as aria-pressed, aria-expanded and aria-current communicate control states to assistive technologies.

I included a skip link, visible focus indicators and descriptive hidden link text. I tested the skip link, Tab focus order, visible focus outlines and Escape menu behaviour. Keyboard navigation worked as intended.

I also checked text contrast against WCAG AA. A colour typo initially produced a contrast ratio of 3.3:1, below the 4.5:1 requirement for normal text. Correcting the colour increased it to 8.3:1. Lighthouse Accessibility scored 100 on desktop, and the HTML/CSS validator reported zero errors.


###The theme toggle
CSS variables in base.css  define the light and dark palettes. JavaScript changes the dark class, leaving CSS responsible for the colours. localStorages remembers the preference, and prefers-color-scheme provides a default based on the visitor’s system settings.

The regular script theme-init.js runs in the head to apply the theme before the page appears, preventing a white flash in dark mode. Although Lighthouse flags it as render-blocking, I kept it to preserve the visual experience. Changing colours directly through JavaScript would scatter them across the code, and dynamically created elements would also need their colours updated manually.


###When things go wrong
Slow request: skeleton cards and a loading message appear first. After eight seconds, AbortSignal.timeout() aborts the request, and the visitor sees an error message with a “Try again” button.
Failed request: try/catch handles failures, and getProjectErrorMessage() provides readable messages for GitHub rate limits (403/429), a missing profile (404) or no connection. Technical details go to console.warn to help debugging without confusing visitors.

Empty response: if the request succeeds but no projects remain, the visitor sees: “There are no public projects to show yet - check back soon!”

A JavaScript error during development left content hidden because the js class was added before the reveal functionality was initialised, so I fixed the initialisation order and added element checks. I also tested Offline mode and slow network throttling in DevTools.


###Strengths and weaknesses
My main strengths are the modular code, accessibility and performance improvements. The About pages initially had a CLS score between 0.116 and 0.327 because content shifted when loading messages disappeared and CV content appeared. Delaying the loading message by 400 milliseconds and reserving space for empty timeline lists reduced CLS to 0.000 in my test.

I also replaced a large profile image with two WebP sizes using srcset and sizes. The image size decreased from 84 KiB to 25 KiB in Lighthouse’s mobile test.
If I rebuilt the project, I would use lowercase file names from the start and test on GitHub Pages earlier. Capitalisation differences caused broken paths after deployment even though the site worked locally. I would also consider catching the GitHub response in sessionStorage for a few minutes and refreshing expired data so repository updates remain visible.


###AI tools
After creating the desktop version of my website in Figma, I used Claude to help me develop one of the mobile versions. I also turned to AI when I encountered bugs that I could not figure out how to fix on my own. Instead of asking for solutions, I tried to understand why the problems occurred and how the suggested fixes worked. For example, I asked how to create the glow effect on my page and found it interesting that the technique was quite similar to how I had created it in Figma. This helped me understand how design techniques can be applied differently across tools. Overall, AI was useful for exploring ideas and solving problems, but I still needed to review the suggestions, adapt them to my project and check that the results worked as intended.
