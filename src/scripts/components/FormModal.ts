import { BaseComponentInterface } from "../interfaces";

class FormModal implements BaseComponentInterface {
    el: HTMLElement;

    constructor(el: HTMLElement) {
        this.el = el;
        this.init();
    }

    public init(): void {
        console.log("FormModals initialized");
        this.bindListeners();
    }

    public destroy(): void {
        this.unbindListeners();
    }

    private bindListeners(): void {}

    private unbindListeners(): void {}
}

export default FormModal;
