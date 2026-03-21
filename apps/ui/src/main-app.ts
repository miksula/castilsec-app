import { LitElement, type TemplateResult } from "lit";
import Router from "@app/router";

import type { State } from "@/lib/types.ts";
import type { SupabaseConnector } from "@/lib/mixins/supabaseContext.ts";
import { EVENT_DATA, EVENT_LOAD } from "@/lib/constants.ts";
import { noShadow } from "@/lib/mixins/noShadow.ts";
import { withRouter } from "@/lib/mixins/withRouter.ts";
import { withStore } from "@/lib/mixins/withStore.ts";
import { withSupabase } from "@/lib/mixins/withSupabase.ts";
import { prepareHooks } from "@/state/hooks.ts";
import RootStore from "@/state/stores/root.ts";

import { Dashboard, Login, NotFound, Register } from "@/routes/index.ts";
import Layout from "./layout.ts";
import AuthLayout from "./routes/auth/layout.ts";

export class MainApp extends withSupabase(
  withRouter(withStore(noShadow(LitElement))),
) {
  declare protected router: Router;
  declare protected store: ReturnType<typeof RootStore>;
  declare protected supabase: SupabaseConnector;

  private page: TemplateResult | null = null;
  private state!: State;

  constructor() {
    super();
    this.state = this.store.getState();

    this.router
      .add("/", () => {
        this.page = Dashboard();
      })
      .add("/auth/login", () => {
        this.page = Login();
      })
      .add("/auth/register", () => {
        this.page = Register();
      })
      .add("/*", () => {
        this.page = NotFound(this.router.path);
      })
      .onRouteCheck(() => {
        // This callback prepares the hook system and triggers a new render cycle
        // every time the router `check()` is called
        prepareHooks();
        this.requestUpdate();
      });

    // Initial route check on page load
    this.router.check();
  }

  override connectedCallback() {
    super.connectedCallback();

    void this.supabase.init();

    // Listen for state update events
    addEventListener(EVENT_DATA, (event: CustomEvent<State>) => {
      this.state = event.detail;
      // Update route based on new state
      this.router.check();
    });

    this.loadData(); // Trigger initial update to get the state from persistent storage
  }

  private loadData() {
    dispatchEvent(new CustomEvent(EVENT_LOAD));
  }

  override render() {
    if (this.router.path.startsWith("/auth")) {
      return AuthLayout(this.page);
    }
    return Layout(this.page);
  }
}

customElements.define("main-app", MainApp);
