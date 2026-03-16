import { LitElement } from "lit";
import { ContextProvider } from "@lit/context";
import RootStore from "@/state/stores/root.ts";

// The context object for children to access the router instance.
// See: https://lit.dev/docs/data/context
import { storeContext } from "./storeContext.ts";

export const withStore = (superClass: typeof LitElement) =>
  class WithStoreMixin extends superClass {
    protected store = RootStore();

    private _storeProvider = new ContextProvider(this, {
      context: storeContext,
      initialValue: this.store,
    });
  };
