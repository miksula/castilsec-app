import { LitElement, type TemplateResult } from "lit";

import type { State } from "@/lib/types.ts";
import { EVENT_DATA, EVENT_LOAD } from "@/lib/constants.ts";
import { noShadow } from "@/lib/mixins/noShadow.ts";
import { withRouter } from "@/lib/mixins/withRouter.ts";
import { withStore } from "@/lib/mixins/withStore.ts";
import { prepareHooks } from "@/state/hooks.ts";

import { Dashboard, NotFound, Task, Tasks, Test } from "@/routes/index.ts";
import Layout from "./layout.ts";

export class MainApp extends withRouter(withStore(noShadow(LitElement))) {
  private page: TemplateResult | null = null;
  private state: State = this.store.getState();

  constructor() {
    super();

    this.router
      .add("/", () => {
        this.page = Dashboard(this.state);
      })
      .add("/tasks", () => {
        this.page = Tasks(this.state.tasks);
      })
      .add("/tasks/:id", (c) => {
        const id = c.params.id;
        this.page = Task(id);
      })
      .add("/test", () => {
        this.page = Test();
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
    return Layout(this.page);
  }
}

customElements.define("main-app", MainApp);
