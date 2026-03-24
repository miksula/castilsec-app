import { LitElement } from "lit";
import { ContextProvider } from "@lit/context";
import RootStore from "@/lib/stores/root.ts";

// The context object for children to access the router instance.
// See: https://lit.dev/docs/data/context
import { storeContext } from "./storeContext.ts";

// deno-lint-ignore no-explicit-any
type Constructor<T = Record<string, never>> = new (...args: any[]) => T;

export function withStore<T extends Constructor<LitElement>>(Base: T) {
  return class WithStoreMixin extends Base {
    private storeInstance = RootStore();

    protected get store() {
      return this.storeInstance;
    }

    private _storeProvider = new ContextProvider(this, {
      context: storeContext,
      initialValue: this.store,
    });
  };
}
