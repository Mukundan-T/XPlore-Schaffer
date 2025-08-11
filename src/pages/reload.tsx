/**
 * This file reloads the page with the accurate default position after a period of inactivity.
 */

import { getDefaultLocation } from "@/store/defaultPosition";

(function () {
  let idleTimeout: ReturnType<typeof setTimeout>;
  const idleDurationSecs = 300; // number of seconds for timeout
  let redirectUrl = buildRedirectUrl(getDefaultLocation());

  function buildRedirectUrl(location: string | null) {
    const finalLocation = location || "v199";
    return `https://xplore.schafferlibrarycollections.org/?position=${finalLocation}`;
  }

  function resetIdleTimeout() {
    if (idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => (location.href = redirectUrl), idleDurationSecs * 1000);
  }

  // Listen for changes in default location and update redirect URL
  window.addEventListener("defaultLocationChanged", (e: any) => {
    redirectUrl = buildRedirectUrl(e.detail);
  });

  // Start timeout
  resetIdleTimeout();

  // Reset the idle timeout on any user interaction
  ["click", "touchstart", "mousemove", "scroll"].forEach((evt) =>
    document.addEventListener(evt, resetIdleTimeout, false)
  );
})();