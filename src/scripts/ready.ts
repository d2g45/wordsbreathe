// Runs `callback` once the document has been parsed, whether or not
// DOMContentLoaded has already fired. A bare listener is not enough: the legacy
// bundle loads through SystemJS (`@vitejs/plugin-legacy`), which can finish
// after the event, and a listener added after it has fired never runs (#21).
export const onReady = (callback: () => void): void => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
    return;
  }

  callback();
};

export const offReady = (callback: () => void): void => {
  document.removeEventListener("DOMContentLoaded", callback);
};
