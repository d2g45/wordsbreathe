import { BaseComponentInterface } from "../interfaces";
import Glide from "@glidejs/glide";

class Gallery implements BaseComponentInterface {
    el: HTMLElement;

    targetSelector: string = ".js-gallery";

    constructor(el: HTMLElement) {
        this.el = el;
        this.init();
    }

    private bindListeners(): void {}

    private unbindListeners(): void {}

    public init(): void {
        console.log("Gallery initialized");
        new Glide(this.el, {}).mount();

        this.bindListeners();
    }

    public destroy(): void {
        this.unbindListeners();
    }
}

export default Gallery;
