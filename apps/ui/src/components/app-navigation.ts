import "@vaadin/avatar";
import "@vaadin/icon";
import "@vaadin/icons";
import { html, LitElement } from "lit";
import { useRouter } from "@/lib/mixins/useRouter.ts";
import { useSupabase } from "@/lib/mixins/useSupabase.ts";
import Logo from "@/components/icons/LogoCastleSolidIcon.ts";

// import "./nav-link.ts";

const navigationItems = [
  { text: "Työpöytä", to: "/" },
  { text: "Kohteet", to: "/kohteet" },
  { text: "Tehtävät", to: "/tasks" },
  { text: "Riskit", to: "/riskit" },
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

  private renderNavLinks(mobile = false) {
    return navigationItems.map((item) =>
      html`
        <nav-link
          text="${item.text}"
          to="${item.to}"
          ?mobile="${mobile}"
          ?active="${this.isItemActive(item.to)}"
        ></nav-link>
      `
    );
  }

  override render() {
    return html`
      <nav class="flex min-h-16 px-4 border-b bg-white">
        <div class="flex items-center justify-start gap-2 shrink-0">
          <div class="h-7 w-7 text-(--aura-accent-color) opacity-80 mt-0">
            ${Logo()}
          </div>
          <div
            class="grid w-29.5 text-left text-sm leading-tight text-(--aura-accent-color)"
          >
            <span class="truncate font-medium">CastilSec</span>
            <span class="truncate text-xs">Tietoturva hallintaan</span>
          </div>
        </div>
        <div class="flex-1 flex items-center justify-start mx-4">
          <section class="flex gap-5">
            <span class="flex items-center gap-2">
              <vaadin-icon icon="vaadin:dashboard"></vaadin-icon>
              <span class="font-normal text-foreground uppercase">Työpöytä</span>
            </span>
            <span class="flex items-center gap-2">
              <vaadin-icon icon="vaadin:crosshairs"></vaadin-icon>
              <span class="font-normal text-foreground uppercase">Kohteet</span>
            </span>
            <span class="flex items-center gap-2">
              <vaadin-icon icon="vaadin:check"></vaadin-icon>
              <span class="font-normal text-foreground uppercase">Tehtävät</span>
            </span>
            <span class="flex items-center gap-2">
              <vaadin-icon icon="vaadin:fire"></vaadin-icon>
              <span class="font-normal text-foreground uppercase">Riskit</span>
            </span>
          </section>
        </div>
        <div class="w-1/6 flex items-center justify-end">
          <vaadin-avatar name="Mika Vallittu"></vaadin-avatar>
        </div>
      </nav>
    `;
  }
}

customElements.define("app-navigation", AppNavigation);
