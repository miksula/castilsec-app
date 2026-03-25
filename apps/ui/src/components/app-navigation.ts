import "@vaadin/avatar";
import { html, LitElement } from "lit";
import { useRouter } from "@/lib/mixins/useRouter.ts";
import { useSupabase } from "@/lib/mixins/useSupabase.ts";
import Logo from "@/components/icons/LogoCastleSolidIcon.ts";

import "./nav-link.ts";

const navigationItems = [
  { text: "Työpöytä", to: "/", icon: "vaadin:dashboard" },
  { text: "Kohteet", to: "/kohteet", icon: "vaadin:crosshairs" },
  { text: "Tehtävät", to: "/tasks", icon: "vaadin:check" },
  { text: "Riskit", to: "/riskit", icon: "vaadin:fire" },
];

class AppNavigation extends useSupabase(useRouter(LitElement)) {
  private activePath: string = "/";
  private isLoggingOut = false;

  override connectedCallback() {
    super.connectedCallback();

    this.activePath = this.router?.path ?? "/";

    this.router?.onRouteCheck((path: string) => {
      this.activePath = path;
      this.requestUpdate();
    });
  }

  private handleLogout = async (event: Event) => {
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
  };

  private getUserEmail() {
    return this.supabase?.currentSession?.user?.email ?? "signed-in user";
  }

  private getUserInitials() {
    const email = this.getUserEmail();
    if (!email || email === "signed-in user") {
      return "CS";
    }
    return email.slice(0, 2).toUpperCase();
  }

  private isItemActive(path: string) {
    if (path === "/") {
      return this.activePath === "/";
    }

    return this.activePath === path || this.activePath.startsWith(`${path}/`);
  }

  private renderNavLinks() {
    return navigationItems.map((item) =>
      html`
        <nav-link
          text="${item.text}"
          to="${item.to}"
          icon="${item.icon}"
          ?active="${this.isItemActive(item.to)}"
        ></nav-link>
      `
    );
  }

  protected override createRenderRoot() {
    return this; // no shadow DOM
  }

  override render() {
    return html`
      <nav class="flex min-h-16 px-6">
        <div class="flex items-center justify-start gap-2 shrink-0">
          <div class="h-7 w-7 text-(--color-black) opacity-80 mt-0">
            ${Logo()}
          </div>
          <div
            class="grid w-29.5 text-left text-sm leading-tight text-(--color-black)"
          >
            <span class="truncate font-medium">CastilSec</span>
            <span class="truncate text-xs">Tietoturvan hallinta</span>
          </div>
        </div>
        <div
          class="flex-1 flex items-center justify-start mx-4"
          style="visibility: hidden;"
        >
          <section class="flex gap-5">
            ${this.renderNavLinks()}
          </section>
        </div>
        <div class="w-1/6 flex items-center justify-end">
          <vaadin-avatar name="Mika Vallittu" @click="${this
            .handleLogout}"></vaadin-avatar>
        </div>
      </nav>
    `;
  }
}

customElements.define("app-navigation", AppNavigation);
