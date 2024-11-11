import { BaseModule } from "@/scripts/types";

const SELECTORS = {
    BG: ".js-background-image",
    IMG: ".js-image",
};

const initBG = (): void => {
    const bg = document.querySelectorAll<HTMLElement>(SELECTORS.BG);
    if (bg.length > 0) {
        bg.forEach((el: HTMLElement) => {
            const src = el.dataset.src;
            if (src) {
                el.style.backgroundImage = `url(${src})`;
            }
        });
    }
};

const initIMG = (): void => {
    const img = document.querySelectorAll<HTMLImageElement>(SELECTORS.IMG);
    if (img.length > 0) {
        img.forEach((el: HTMLImageElement) => {
            const src = el.dataset.src;
            if (src) {
                el.src = src;
            }
        });
    }
};

const init = (): void => {
    addEventListener("DOMContentLoaded", initBG);
    addEventListener("DOMContentLoaded", initIMG);
    // initBG();
    // initIMG();
};

const destroy = (): void => {
    removeEventListener("DOMContentLoaded", initBG);
    removeEventListener("DOMContentLoaded", initIMG);
};

const images: BaseModule = {
    init,
    destroy,
};

export default images;
