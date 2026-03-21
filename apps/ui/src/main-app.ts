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

import { Dashboard, Login, NotFound, Register, Tasks } from "@/routes/index.ts";
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
  private authSubscription?: { unsubscribe: () => void };
  private readonly onStateData = (event: CustomEvent<State>) => {
    this.state = event.detail;
    this.router.check();
  };

  constructor() {
    super();
    this.state = this.store.getState();

    this.router
      .add("/", () => {
        this.page = Dashboard();
      })
      .add("/tasks", () => {
        this.page = Tasks();
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
      .onRouteCheck((path) => {
        this.enforceAuthRoute(path);
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

    // initialize PowerSync and establish connection to Supabase
    void this.supabase.init().then(() => {
      this.enforceAuthRoute();
    });

    const {
      data: { subscription },
    } = this.supabase.client.auth.onAuthStateChange((event, session) => {
      this.supabase.updateSession(session);

      if (event === "SIGNED_OUT") {
        this.router.navigate("/auth/login");
        return;
      }

      if (event === "SIGNED_IN" && this.router.path.startsWith("/auth")) {
        this.router.navigate("/");
      }
    });
    this.authSubscription = subscription;

    // Listen for state update events
    addEventListener(EVENT_DATA, this.onStateData as EventListener);

    this.loadData(); // Trigger initial update to get the state from persistent storage
  }

  override disconnectedCallback() {
    this.authSubscription?.unsubscribe();
    removeEventListener(EVENT_DATA, this.onStateData as EventListener);
    super.disconnectedCallback();
  }

  private loadData() {
    dispatchEvent(new CustomEvent(EVENT_LOAD));
  }

  private enforceAuthRoute(path = this.router.path) {
    if (!this.supabase.ready) {
      return;
    }

    const isAuthRoute = path.startsWith("/auth");
    if (!this.supabase.currentSession && !isAuthRoute) {
      this.router.navigate("/auth/login");
    }
  }

  override render() {
    if (this.router.path.startsWith("/auth")) {
      return AuthLayout(this.page);
    }
    return Layout(this.page);
  }
}

customElements.define("main-app", MainApp);
