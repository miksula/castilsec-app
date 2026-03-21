import { html, LitElement } from "lit";
import "@tailwindplus/elements";
import type Router from "@app/router";
import { noShadow } from "@/lib/mixins/noShadow.ts";
import { useRouter } from "@/lib/mixins/useRouter.ts";
import { useSupabase } from "@/lib/mixins/useSupabase.ts";

import "./nav-link.ts";

const navigationItems = [
  { text: "Työpöytä", to: "/" },
  { text: "Kohteet", to: "/kohteet" },
  { text: "Tehtävät", to: "/tasks" },
  { text: "Riskit", to: "/riskit" },
];

class AppNavigation extends useSupabase(useRouter(noShadow(LitElement))) {
  declare protected router: Router;

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
      <header
        class="relative bg-white shadow-sm after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gray-200/70"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between">
            <div class="flex min-w-0 items-center">
              <button
                type="button"
                @click="${() => this.router.navigate("/")}"
                class="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <img src="/logo.svg" alt="CastilSec" class="h-8 w-8 rounded-lg" />
                <span class="text-sm font-semibold tracking-[0.18em] text-gray-900">
                  CASTILSEC
                </span>
              </button>

              <nav
                aria-label="Global"
                class="hidden sm:ml-6 sm:flex sm:space-x-8"
              >
                ${this.renderNavLinks()}
              </nav>
            </div>

            <div class="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                type="button"
                class="relative rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-brand"
              >
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">View notifications</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                  class="size-6"
                >
                  <path
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <el-dropdown class="relative ml-3">
                <button
                  class="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span class="absolute -inset-1.5"></span>
                  <span class="sr-only">Open user menu</span>
                  <span
                    class="grid size-8 place-items-center rounded-full bg-brand text-xs font-semibold text-white outline -outline-offset-1 outline-black/5"
                  >
                    ${this.getUserInitials()}
                  </span>
                </button>

                <el-menu
                  anchor="bottom end"
                  popover
                  class="w-56 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div class="px-4 py-2">
                    <div class="text-sm font-semibold text-gray-900">CastilSec</div>
                    <div class="text-sm text-gray-500">${this
                      .getUserEmail()}</div>
                  </div>
                  <div class="my-1 h-px bg-gray-100"></div>
                  <button
                    type="button"
                    ?disabled="${this.isLoggingOut}"
                    @click="${this.handleLogout}"
                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    ${this.isLoggingOut
                      ? "Kirjaudutaan ulos..."
                      : "Kirjaudu ulos"}
                  </button>
                </el-menu>
              </el-dropdown>
            </div>

            <div class="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                command="--toggle"
                commandfor="mobile-menu"
                class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-2 focus:-outline-offset-1 focus:outline-brand"
              >
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                  class="size-6 in-aria-expanded:hidden"
                >
                  <path
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                  class="size-6 not-in-aria-expanded:hidden"
                >
                  <path
                    d="M6 18 18 6M6 6l12 12"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <el-disclosure id="mobile-menu" hidden class="block sm:hidden">
          <nav aria-label="Global">
            <div class="space-y-1 pt-2 pb-3">
              ${this.renderNavLinks(true)}
            </div>
            <div class="border-t border-gray-200 pt-4 pb-3">
              <div class="flex items-center px-4">
                <div class="shrink-0">
                  <span
                    class="grid size-10 place-items-center rounded-full bg-brand text-sm font-semibold text-white outline -outline-offset-1 outline-black/5"
                  >
                    ${this.getUserInitials()}
                  </span>
                </div>
                <div class="ml-3">
                  <div class="text-base font-medium text-gray-800">CastilSec</div>
                  <div class="text-sm font-medium text-gray-500">${this
                    .getUserEmail()}</div>
                </div>
                <button
                  type="button"
                  class="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-brand"
                >
                  <span class="absolute -inset-1.5"></span>
                  <span class="sr-only">View notifications</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    aria-hidden="true"
                    class="size-6"
                  >
                    <path
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div class="mt-3 space-y-1">
                <button
                  type="button"
                  ?disabled="${this.isLoggingOut}"
                  @click="${this.handleLogout}"
                  class="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  ${this.isLoggingOut
                    ? "Kirjaudutaan ulos..."
                    : "Kirjaudu ulos"}
                </button>
              </div>
            </div>
          </nav>
        </el-disclosure>
      </header>
    `;
  }
}

customElements.define("app-navigation", AppNavigation);
