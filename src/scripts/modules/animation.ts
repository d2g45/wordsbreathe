import { BaseModule } from "@/scripts/types";
import gsap from "../lib/gsap";

const FROM = {
  LAZY: {
    opacity: 0,
    y: 30,
  },
};

const SELECTORS = {
  GROUP: ".gs-group",
  LAZY: ".gs-lazy",
  CONTENT: ".gs-content",
};

const lazy = (trigger: HTMLElement[]): void => {
  const to = {
    opacity: 1,
    y: 0,
    duration: 0.3,
    ease: "power2.easeInOut",
    stagger: 0.15,
    scrollTrigger: {
      trigger,
      start: "top bottom-=100px",
    },
  };

  gsap.fromTo(trigger, FROM.LAZY, to);
};

const initLazy = (): void => {
  const groups = [...document.querySelectorAll<HTMLElement>(SELECTORS.GROUP)];

  groups.forEach((group: HTMLElement) => {
    const elements = [
      ...group.querySelectorAll<HTMLElement>(`${SELECTORS.LAZY}:not(${SELECTORS.CONTENT})`),
      ...group.querySelectorAll<HTMLElement>(`${SELECTORS.LAZY}${SELECTORS.CONTENT} > *`),
    ];

    if (elements.length > 0) {
      lazy(elements);
    }
  });
};

const init = (): void => {
  // initLazy();
  addEventListener("DOMContentLoaded", initLazy);
};

const destroy = (): void => {
  removeEventListener("DOMContentLoaded", initLazy);
};

const animation: BaseModule = {
  init,
  destroy,
};

export default animation;
