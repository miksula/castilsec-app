import { LitElement } from "lit";
import { ContextProvider } from "@lit/context";
import Router from "@app/router";

// The context object for children to access the router instance.
// See: https://lit.dev/docs/data/context
import { routerContext } from "./routerContext.ts";

// https://www.typescriptlang.org/docs/handbook/mixins.html
// deno-lint-ignore no-explicit-any
type Constructor<T = Record<string, never>> = new (...args: any[]) => T;

export function withRouter<T extends Constructor<LitElement>>(Base: T) {
  return class WithRouterMixin extends Base {
    protected router = new Router();

    private _routerProvider = new ContextProvider(this, {
      context: routerContext,
      initialValue: this.router,
    });
  };
}
