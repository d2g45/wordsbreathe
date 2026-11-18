import type { BaseComponentInterface } from "./interfaces";

export type BaseModule = {
    init: Function;
    destroy: Function;
};

export type ComponentConfig = {
    selector: string;
    Component: new (el: HTMLElement) => BaseComponentInterface;
};

export type AppConfig = {
    modules?: Array<BaseModule>;
    components?: Array<ComponentConfig>;
};
