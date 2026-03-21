import { html, LitElement } from "lit";
import type Router from "@app/router";
import { noShadow } from "../mixins/noShadow.ts";
import { useRouter } from "../mixins/useRouter.ts";
import { useSupabase } from "../mixins/useSupabase.ts";

import "./nav-link.ts";

class AppNavigation extends useSupabase(useRouter(noShadow(LitElement))) {
  declare protected router: Router;

  private activePath: string = "/";
  private isLoggingOut = false;

  override connectedCallback() {
    super.connectedCallback();

    this.router?.onRouteCheck((path: string) => {
      this.activePath = path;
      this.requestUpdate();
    });
  }

  private async handleLogout(event: Event) {
    event.preventDefault();

    if (!this.supabase || this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    this.requestUpdate();

    try {
      await this.supabase.logout();
    } finally {
      this.isLoggingOut = false;
      this.requestUpdate();
    }
  }

  override render() {
    return html`
      <nav
        class="px-8 flex items-center h-14 border-b border-b-gray-200"
      >
        <img src="/logo.svg" alt="Castle Logo" class="w-6 h-6 -mr-1" />
        <span class="mx-2 font-semibold text-gray-800 tracking-wide">CastilSec</span>
        <ul class="mx-6 p-0 flex justify-between list-none">
          <nav-link text="Työpöytä" to="/" ?active="${this.activePath ==
            "/"}"></nav-link>
          <nav-link text="Kohteet" to="/kohteet" ?active="${this.activePath ==
            "/kohteet"}"></nav-link>
          <nav-link text="Tehtävät" to="/tasks" ?active="${this.activePath ==
            "/tasks"}"></nav-link>
          <nav-link text="Riskit" to="/riskit" ?active="${this.activePath ==
            "/riskit"}"></nav-link>
        </ul>
        <button
          type="button"
          ?disabled="${this.isLoggingOut}"
          @click="${this.handleLogout}"
          class="ml-auto rounded-md px-3 py-1.5 text-sm font-medium text-brand-blue transition-colors hover:bg-brand-blue-light/40 hover:text-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          ${this.isLoggingOut ? "Kirjaudutaan ulos..." : "Kirjaudu ulos"}
        </button>
      </nav>
    `;
  }
}

customElements.define("app-navigation", AppNavigation);
