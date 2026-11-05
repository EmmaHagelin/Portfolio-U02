// API - everything that talks to the network
// used for both cv.json and the GitHub API


import { REQUEST_TIMEOUT_MS } from "./config.js";

export class RequestError extends Error {
    constructor(message, status = 0) {
        super(message);
        this.name = "RequestError";
        this.status = status;
    }
}

export async function fetchJson(url, options = {}) {
    let response;

    try {
        response = await fetch(url, {
            ...options,
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (error) {
        if (error.name === "TimeoutError") {
            throw new RequestError("The answer took too long to arrive.");
        }
        throw new RequestError("Could not connect. Check your internet connection.");
    }

    if (!response.ok) {
        throw new RequestError(`The server answered with status ${response.status}.`, response.status);
    }

    return response.json();
}