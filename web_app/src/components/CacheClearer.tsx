"use client";

import { useEffect } from "react";

export function CacheClearer() {
    useEffect(() => {
        // Clear all storage on component mount (which happens on site load/refresh)
        try {
            if (typeof window !== "undefined") {
                console.log("Clearing browser storage...");
                localStorage.clear();
                sessionStorage.clear();

                // Optional: specific keys if we don't want to nuke everything
                // but user asked for "browser info to be deleted"
            }
        } catch (e) {
            console.error("Failed to clear storage:", e);
        }
    }, []);

    return null;
}
