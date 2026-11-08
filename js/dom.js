//Dom helpers - small functions used by several other files
export function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.className = className;
    return element;
}

// Shows a messege in a status box
export function showStatus(statusElement, messege, onRetry) {
    const text = createElement("p", "status-box__text", messege);
    statusElement.replaceChildren(text);

    if (onRetry) {
        const retryButton = createElement("button", "btn btn--ghost btn--small", "Try again");
        retryButton.type = "button";
        retryButton.addEventListener("click", onRetry, { once: true });
        statusElement.append(retryButton);
    }
}

export function clearStatus(statusElement) {
    statusElement.replaceChildren();
}