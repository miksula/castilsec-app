import { LitElement } from "lit";
import { ContextConsumer } from "@lit/context";

import { routerContext } from "./routerContext.ts";

export const useRouter = (superClass: typeof LitElement) =>
  class UseRouterMixin extends superClass {
    // Consume the router context
    private routerInstance = new ContextConsumer(this, {
      context: routerContext,
      subscribe: true,
    });

    protected get router() {
      return this.routerInstance.value;
    }
  };
