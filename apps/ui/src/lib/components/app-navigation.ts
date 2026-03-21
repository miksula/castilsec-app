import { html, LitElement } from "lit";
import "@tailwindplus/elements";
import type Router from "@app/router";
import { noShadow } from "../mixins/noShadow.ts";
import { useRouter } from "../mixins/useRouter.ts";
import { useSupabase } from "../mixins/useSupabase.ts";

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

    this.router?.onRouteCheck((path: string) => {
      this.activePath = path;
      this.requestUpdate();
    });
  }

  private handleSearchFocus = () => {
    if (!this.router.path.startsWith("/tasks")) {
      this.router.navigate("/tasks");
    }
  };

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

  private renderNavLinks(mobile = false) {
    return navigationItems.map((item) =>
      html`
        <nav-link
          text="${item.text}"
          to="${item.to}"
          ?mobile="${mobile}"
          ?active="${this.activePath === item.to}"
        ></nav-link>
      `
    );
  }

  override render() {
    return html`
      <header
        class="relative bg-white shadow-sm after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gray-200/70"
      >
        <div
          class="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8"
        >
          <div class="relative flex h-16 justify-between">
            <div class="relative z-10 flex px-2 lg:px-0">
              <button
                type="button"
                @click="${() => this.router.navigate("/")}"
                class="flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <img src="/logo.svg" alt="CastilSec" class="h-8 w-8 rounded-lg" />
                <span
                  class="hidden text-sm font-semibold tracking-[0.18em] text-gray-900 sm:inline-block"
                >
                  CASTILSEC
                </span>
              </button>
            </div>

            <div
              class="relative z-0 hidden flex-1 items-center justify-center px-2 md:flex md:absolute md:inset-0"
            >
              <div class="grid w-full grid-cols-1 sm:max-w-xs">
                <input
                  name="search"
                  placeholder="Search"
                  @focus="${this.handleSearchFocus}"
                  class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-brand sm:text-sm/6"
                />
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
                >
                  <path
                    d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div class="relative z-10 flex items-center lg:hidden">
              <button
                type="button"
                command="--toggle"
                commandfor="mobile-menu"
                class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-brand-100 hover:text-brand-dark focus:outline-2 focus:-outline-offset-1 focus:outline-brand"
              >
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open menu</span>
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

            <div class="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
              <button
                type="button"
                class="relative shrink-0 rounded-full p-1 text-gray-400 hover:text-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand"
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

              <el-dropdown class="relative ml-4 shrink-0">
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
                  class="w-56 origin-top-right rounded-md bg-white py-1 shadow-lg outline-1 outline-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
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
                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 focus:bg-brand-100 focus:text-brand-dark focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    ${this.isLoggingOut
                      ? "Kirjaudutaan ulos..."
                      : "Kirjaudu ulos"}
                  </button>
                </el-menu>
              </el-dropdown>
            </div>
          </div>

          <nav aria-label="Global" class="hidden lg:flex lg:space-x-2 lg:py-2">
            ${this.renderNavLinks()}
          </nav>
        </div>

        <el-disclosure id="mobile-menu" hidden class="contents lg:hidden">
          <nav aria-label="Global">
            <div class="space-y-1 px-2 pt-2 pb-3">
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
                  class="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand"
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
              <div class="mt-3 grid grid-cols-1 px-4">
                <input
                  name="mobile-search"
                  placeholder="Search"
                  @focus="${this.handleSearchFocus}"
                  class="block w-full rounded-md bg-white py-1.5 pr-3 pl-4 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-brand sm:text-sm/6"
                />
              </div>
              <div class="mt-3 space-y-1 px-2">
                <button
                  type="button"
                  ?disabled="${this.isLoggingOut}"
                  @click="${this.handleLogout}"
                  class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-500 hover:bg-brand-100 hover:text-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
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
