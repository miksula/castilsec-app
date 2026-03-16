import { LitElement } from "lit";

export const noShadow = (superClass: typeof LitElement) =>
  class NoShadowMixin extends superClass {
    override createRenderRoot() {
      // will render the template without shadow DOM
      return this;
    }
  };
