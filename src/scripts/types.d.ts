export type BaseModule = {
    init: Function;
    destroy: Function;
};

export type BaseComponent = Modal;

export type AppConfig = {
    modules?: Array<BaseModule>;
    components?: Array<BaseComponent>;
};
