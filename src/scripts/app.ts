import { onReady } from "./ready";
import type { AppConfig, BaseModule, ComponentConfig } from "./types";

export default class App {
  modules: Array<BaseModule> = [];
  components: Array<ComponentConfig> = [];

  constructor(config: AppConfig = {}) {
    this.modules = config?.modules ?? [];
    this.components = config?.components ?? [];

    onReady(this.init.bind(this));
  }

  // Keeps one failure from stopping the rest of the start-up (#15). The rethrow
  // is async so the error still reaches window.onerror, which is what the smoke
  // tests watch and how #10 was found, while this loop carries on.
  private reportFailure(what: string, error: unknown): void {
    console.error(`[App] ${what} failed to start`, error);

    setTimeout(() => {
      throw error;
    });
  }

  private loadModules(): void {
    this.modules.forEach((module, index) => {
      try {
        module.init();
      } catch (error) {
        this.reportFailure(`module ${index}`, error);
      }
    });
  }

  private initComponents(): void {
    this.components.forEach((item) => {
      let elements: HTMLElement[] = [];

      // An empty or malformed selector throws here rather than in the component.
      try {
        elements = [...document.querySelectorAll<HTMLElement>(item.selector)];
      } catch (error) {
        this.reportFailure(`selector ${JSON.stringify(item.selector)}`, error);
        return;
      }

      elements.forEach((element) => {
        try {
          new item.Component(element);
        } catch (error) {
          this.reportFailure(item.selector, error);
        }
      });
    });
  }

  public init(): void {
    this.loadModules();
    this.initComponents();
  }
}
