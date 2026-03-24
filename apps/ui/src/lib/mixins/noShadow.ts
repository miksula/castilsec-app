import { LitElement } from "lit";

// deno-lint-ignore no-explicit-any
type Constructor<T = Record<string, never>> = new (...args: any[]) => T;

export function noShadow<T extends Constructor<LitElement>>(Base: T) {
  return class NoShadowMixin extends Base {
    override createRenderRoot() {
      // will render the template without shadow DOM
      return this;
    }
  };
}
