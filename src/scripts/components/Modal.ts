import { BaseComponentInterface } from "../interfaces";

interface ModalVideo {
    provider: string;
    parent: HTMLElement | null;
    element: HTMLIFrameElement | null;
}

class Modal implements BaseComponentInterface {
    el: HTMLElement;
    openSelector: string = "";
    closeSelector: string = ".js-close";
    close: HTMLElement | null;
    overlay: HTMLElement | null;
    open: Array<Node>;
    isOpen: Boolean = false;
    modalType: string = "default";

    video: ModalVideo | undefined;

    boundClose: EventListener;
    boundOpen: EventListener;

    constructor(el: HTMLElement) {
        this.el = el;
        this.modalType = this.el.dataset.modalType ?? "default";

        this.overlay = this.el.querySelector(".js-modal-overlay");

        this.video = {
            parent: this.el.querySelector(".js-modal-video-parent"),
            element: null,
            provider: this.video?.parent?.dataset?.provider ?? "",
        };

        this.openSelector = this.el?.dataset.openSelector ?? this.openSelector;

        this.close = this.el.querySelector(this.closeSelector);
        this.open = [...document.querySelectorAll(this.openSelector)];

        this.boundClose = this.handleClose.bind(this);
        this.boundOpen = this.handleOpen.bind(this);

        this.init();
    }

    private handleClose(e: Event): void {
        e.preventDefault();
        this.isOpen = false;
        this.el.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");

        switch (this.modalType) {
            case "video":
                this.video?.element?.remove();
                break;
            default:
            // do nothing
        }
    }

    private handleOpen(e: Event): void {
        e.preventDefault();
        this.isOpen = true;
        this.el.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
        this.el.focus();

        switch (this.modalType) {
            case "video":
                if (this.video?.parent) {
                    this.video.element = this.createIframe();
                    this.video?.parent?.appendChild(this.video?.element);
                }
                break;
            default:
            // do nothing
        }
    }

    private handleKeyup(e: KeyboardEvent): void {
        if (e.key === "Escape") {
            this.handleClose(e);
        }
    }

    private createIframe(): HTMLIFrameElement {
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.video?.parent?.dataset?.src as string);
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("allow", "autoplay; encrypted-media");
        iframe.setAttribute("class", "js-modal-video");

        return iframe;
    }

    private bindListeners(): void {
        this.el?.addEventListener("keyup", this.handleKeyup.bind(this));
        this.close?.addEventListener("click", this.boundClose);
        this.overlay?.addEventListener("click", this.boundClose);

        this.open.map(trigger =>
            trigger.addEventListener("click", this.boundOpen)
        );
    }

    private unbindListeners(): void {
        this.el.removeEventListener("keyup", this.handleKeyup.bind(this));
        this.close?.removeEventListener("click", this.boundClose);
        this.overlay?.removeEventListener("click", this.boundClose);
        this.open.map(trigger =>
            trigger.removeEventListener("click", this.boundOpen)
        );
    }

    public init(): void {
        this.bindListeners();
    }

    public destroy(): void {
        this.unbindListeners();
    }
}

export default Modal;
