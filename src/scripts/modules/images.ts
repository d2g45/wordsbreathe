import { offReady, onReady } from "@/scripts/ready";
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
    onReady(initBG);
    onReady(initIMG);
};

const destroy = (): void => {
    offReady(initBG);
    offReady(initIMG);
};

const images: BaseModule = {
    init,
    destroy,
};

export default images;
