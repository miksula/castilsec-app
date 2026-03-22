import { html, LitElement } from "lit";

import "@tailwindplus/elements";

export function Play() {
  return html`
    <header class="w-full">
      <div class="flex h-12 items-center border-b border-gray-200 px-6">
        <button>
          <img src="/logo.svg" alt="CastilSec" class="h-7 w-7 opacity-85" />
        </button>
        <nav class="mx-2">
          <a
            href="/play"
            class="inline-flex h-8 justify-center items-center px-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-sm transition"
          >Työpöytä</a>
          <a
            href="/play"
            class="inline-flex h-8 justify-center items-center px-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-sm transition"
          >Kohteet</a>
          <a
            href="/play"
            class="inline-flex h-8 justify-center items-center px-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-sm transition"
          >Tehtävät</a>
          <a
            href="/play"
            class="inline-flex h-8 justify-center items-center px-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-sm transition"
          >Riskit</a>
        </nav>
        <div class="flex-1 flex items-center justify-end gap-2">
          <el-dropdown class="relative ml-3" style="--button-width: 32px;">
            <button
              class="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            >
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">Open user menu</span>
              <span
                class="grid size-7 place-items-center rounded-full bg-black text-xs font-semibold text-white outline -outline-offset-1 outline-black/5"
              >
                MV
              </span>
            </button>

            <el-menu
              anchor="bottom end"
              popover="manual"
              class="w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
              id="menu-0"
              role="menu"
            >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden dark:text-gray-300 dark:focus:bg-white/5"
                id="item-2"
                role="menuitem"
                tabindex="-1"
              >Your profile</a>
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden dark:text-gray-300 dark:focus:bg-white/5"
                id="item-3"
                role="menuitem"
                tabindex="-1"
              >Settings</a>
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden dark:text-gray-300 dark:focus:bg-white/5"
                id="item-4"
                role="menuitem"
                tabindex="-1"
              >Sign out</a>
            </el-menu>
          </el-dropdown>
        </div>
      </div>
    </header>
  `;
}
