import { BaseComponentInterface } from "../interfaces";

class Tabs implements BaseComponentInterface {
    el: HTMLElement;
    buttonSelector: string = ".js-tabs-button";
    buttons: Array<Element> = [];

    boundToggle: EventListener;

    constructor(el: HTMLElement) {
        this.el = el;

        this.buttons = [...this.el.querySelectorAll(this.buttonSelector)];

        this.boundToggle = this.handleToggle.bind(this);

        this.init();
    }

    private handleToggle(e: Event): void {
        e.preventDefault();
        const currentTarget = e.currentTarget as HTMLElement;

        this.buttons.map(button => {
            const buttonElement = button as HTMLElement;
            const id = buttonElement.dataset.id as string;
            const tabTargetElement = this.el.querySelector(
                `#tab-content-${id}`
            );
            const tabBackgroundElement = this.el.querySelector(
                `#tab-background-${id}`
            );

            if (button === currentTarget) {
                button.parentElement?.classList.add("tab-navigation--active");
                tabTargetElement?.classList.add("tab-content--active");
                tabBackgroundElement?.classList.add("tab-background--active");
            } else {
                button.parentElement?.classList.remove(
                    "tab-navigation--active"
                );
                tabTargetElement?.classList.remove("tab-content--active");
                tabBackgroundElement?.classList.remove(
                    "tab-background--active"
                );
            }
        });
    }

    private bindListeners(): void {
        this.buttons?.map(button => {
            button.addEventListener("click", this.boundToggle);
        });
    }

    private unbindListeners(): void {
        this.buttons?.map(button => {
            button.removeEventListener("click", this.boundToggle);
        });
    }

    public init(): void {
        this.bindListeners();
    }

    public destroy(): void {
        this.unbindListeners();
    }
}

export default Tabs;
