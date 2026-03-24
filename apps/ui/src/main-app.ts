import { LitElement, type TemplateResult } from "lit";
import { type Session } from "@supabase/supabase-js";
import Router from "@app/router";

import { type State } from "@/lib/types.ts";
import { EVENT_DATA, EVENT_LOAD } from "@/lib/constants.ts";
import {
  type Store,
  type SupabaseConnector,
  withRouter,
  withStore,
  withSupabase,
} from "@/lib/mixins/index.ts";

import { prepareHooks } from "@/lib/hooks.ts";

import {
  Dashboard,
  Login,
  NotFound,
  Play,
  Register,
  Tasks,
} from "@/routes/index.ts";
import Layout from "@/layout.ts";
import AuthLayout from "@/routes/auth/layout.ts";

export class MainApp extends withSupabase(withRouter(withStore(LitElement))) {
  protected override get router(): Router {
    return super.router;
  }

  protected override get store(): Store {
    return super.store;
  }

  protected override get supabase(): SupabaseConnector {
    return super.supabase;
  }

  private page: TemplateResult | null = null;
  private state!: State;
  private authSubscription?: { unsubscribe: () => void };

  private readonly onStateChange = (event: CustomEvent<State>) => {
    this.state = event.detail;
    this.router.check(); // triggers update
  };

  protected override createRenderRoot() {
    return this; // no shadow DOM
  }

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
      .add("/play", () => {
        this.page = Play();
      })
      .add("/*", () => {
        this.page = NotFound(this.router.path);
      })
      .onRouteCheck((path: string) => {
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
    } = this.supabase.client.auth.onAuthStateChange(
      (event: string, session: Session) => {
        this.supabase.updateSession(session);

        if (event === "SIGNED_OUT") {
          this.router.navigate("/auth/login");
          return;
        }

        if (event === "SIGNED_IN" && this.router.path.startsWith("/auth")) {
          this.router.navigate("/");
        }
      },
    );
    this.authSubscription = subscription;

    // Listen for state update events
    addEventListener(EVENT_DATA, this.onStateChange as EventListener);

    this.loadData(); // Trigger initial update to get the state from persistent storage
  }

  override disconnectedCallback() {
    this.authSubscription?.unsubscribe();
    removeEventListener(EVENT_DATA, this.onStateChange as EventListener);
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
    if (this.router.path === "/play") {
      return this.page; // Play route has its own unique layout for testing purposes, so we render it directly without the main layout
    }
    return Layout(this.page);
  }
}

customElements.define("main-app", MainApp);
