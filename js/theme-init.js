//Runs in <head> on every page, before the page is drawn so it never flashes light -> dark
//Saved choice first, otherwise the visitor's system setting

let savedTheme = null;

try {
    savedTheme = localStorage.getItem("theme");
} catch (error) {
    //localStorage can be blocked
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (savedTheme === null && prefersDark)) {
    document.documentElement.classList.add("dark");
}