import type { AppConfig, BaseModule, ComponentConfig } from "./types";

export default class App {
  modules: Array<BaseModule> = [];
  components: Array<ComponentConfig> = [];

  constructor(config: AppConfig = {}) {
    this.modules = config?.modules ?? [];
    this.components = config?.components ?? [];

    document.addEventListener("DOMContentLoaded", this.init.bind(this));
  }

  private loadModules(): void {
    this.modules.map((module) => module.init());
  }

  private initComponents(): void {
    this.components.map((item) => {
      const elements = [...document.querySelectorAll<HTMLElement>(item.selector)];
      // console.log(item, elements);

      elements?.map((element) => new item.Component(element));
    });
  }

  public init(): void {
    this.loadModules();
    this.initComponents();
  }
}
