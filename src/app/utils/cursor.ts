export function setGlobalCursorWait(isLoading: boolean) {
    let styleEl = document.getElementById("global-cursor-style");
    if (isLoading) {
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "global-cursor-style";
        styleEl.innerHTML = `
          * {
            cursor: wait !important;
          }
        `;
        document.head.appendChild(styleEl);
      }
    } else {
      if (styleEl) {
        styleEl.remove();
      }
    }
  }
  