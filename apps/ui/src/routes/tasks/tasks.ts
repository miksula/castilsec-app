import "@vaadin/text-field";
import "@vaadin/button";
import "@vaadin/icon";

import { html, LitElement } from "lit";

const rows = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  {
    name: "Courtney Henry",
    title: "Designer",
    email: "courtney.henry@example.com",
    role: "Admin",
  },
  {
    name: "Tom Cook",
    title: "Director of Product",
    email: "tom.cook@example.com",
    role: "Member",
  },
] as const;

export function Tasks() {
  return html`
    <tasks-route></tasks-route>
  `;
}

class TasksRoute extends LitElement {
  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    return this; // no shadow DOM
  }

  override render() {
    return html`
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-1">
          <h2 class="text-2xl font-semibold tracking-tight">Tehtävät</h2>
          <p class="text-gray-500">Tässä on lista kaikista tehtävistä.</p>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <div class="flex flex-1 items-center gap-2">
              <vaadin-text-field
                placeholder="Suodata tehtäviä..."
              ></vaadin-text-field>
              <span></span>
              <span></span>
            </div>
            <div class="flex items-center gap-2">
              <vaadin-button>
                <vaadin-icon
                  icon="vaadin:cloud-download-o"
                  slot="prefix"
                ></vaadin-icon>
                Raportti
              </vaadin-button>
              <vaadin-button theme="primary">Lisää tehtävä</vaadin-button>
            </div>
          </div>
          <div>
            <div>
              <div class="flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                  >
                    <div
                      class="overflow-hidden outline-1 outline-black/5 sm:rounded-lg dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                    >
                      <table
                        class="relative min-w-full divide-y divide-gray-300 dark:divide-white/15"
                      >
                        <thead class="bg-gray-50 dark:bg-gray-800/75">
                          <tr>
                            <th
                              scope="col"
                              class="py-2 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-gray-200"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              class="px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                            >
                              Title
                            </th>
                            <th
                              scope="col"
                              class="px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              class="px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                            >
                              Role
                            </th>
                            <th scope="col" class="py-3.5 pr-4 pl-3 sm:pr-6">
                              <span class="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          class="divide-y divide-gray-200 bg-white dark:divide-white/10 dark:bg-gray-800/50"
                        >
                          ${rows.map(
                            (row) =>
                              html`
                                <tr>
                                  <td
                                    class="py-2 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 dark:text-white"
                                  >
                                    ${row.name}
                                  </td>
                                  <td
                                    class="px-3 py-2 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
                                  >
                                    ${row.title}
                                  </td>
                                  <td
                                    class="px-3 py-2 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
                                  >
                                    ${row.email}
                                  </td>
                                  <td
                                    class="px-3 py-2 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
                                  >
                                    ${row.role}
                                  </td>
                                  <td
                                    class="py-2 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6"
                                  >
                                    <a href="#">Edit<span class="sr-only">, ${row
                                      .name}</span></a>
                                  </td>
                                </tr>
                              `,
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    `;
  }
}

customElements.define("tasks-route", TasksRoute);
