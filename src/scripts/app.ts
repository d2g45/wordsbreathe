import { AppConfig, BaseComponent, BaseModule } from "./types";

export default class App {
    modules: Array<BaseModule> = [];
    components: Array<any> = [];

    constructor(config: AppConfig = {}) {
        this.modules = config?.modules ?? [];
        this.components = config?.components ?? [];

        document.addEventListener("DOMContentLoaded", this.init.bind(this));
    }

    private loadModules(): void {
        this.modules.map(module => module.init());
    }

    private initComponents(): void {
        this.components.map(item => {
            const elements = [...document.querySelectorAll(item.selector)];
            console.log(item, elements);

            elements?.map(element => new item.Component(element));
        });
    }

    public init(): void {
        this.loadModules();
        this.initComponents();
    }
}
