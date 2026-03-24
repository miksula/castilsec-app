import { LitElement } from "lit";
import { ContextConsumer } from "@lit/context";

import { routerContext } from "./routerContext.ts";

// deno-lint-ignore no-explicit-any
type Constructor<T = Record<string, never>> = new (...args: any[]) => T;

export function useRouter<T extends Constructor<LitElement>>(Base: T) {
  return class UseRouterMixin extends Base {
    private routerInstance = new ContextConsumer(this, {
      context: routerContext,
      subscribe: true,
    });

    protected get router() {
      const router = this.routerInstance.value;

      if (!router) {
        throw new Error("Router context is not available.");
      }

      return router;
    }
  };
}
