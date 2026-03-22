import { html, LitElement } from "lit";

import type { State, Todo, TodoList } from "@/lib/types.ts";
import { EVENT_DATA } from "@/lib/constants.ts";
import { noShadow } from "@/lib/mixins/noShadow.ts";
import { useStore } from "@/lib/mixins/useStore.ts";

export function Tasks() {
  return html`
    <tasks-route></tasks-route>
  `;
}

class TasksRoute extends useStore(noShadow(LitElement)) {
  private lists: TodoList[] = [];

  private readonly handleStateChange = (event: CustomEvent<State>) => {
    console.log("Received state change event:", event.detail);
    this.lists = event.detail.taskLists;
    this.requestUpdate();
  };

  override connectedCallback() {
    super.connectedCallback();
    this.lists = this.store?.getState().taskLists ?? [];
    console.log("Initial task lists:", this.lists);
    addEventListener(EVENT_DATA, this.handleStateChange as EventListener);
  }

  override disconnectedCallback() {
    removeEventListener(EVENT_DATA, this.handleStateChange as EventListener);
    super.disconnectedCallback();
  }

  override render() {
    const todoCount = this.lists.reduce(
      (count, list) => count + list.todos.length,
      0,
    );

    return html`
      <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          class="mb-8 flex items-end justify-between gap-4 border-b border-gray-200 pb-5"
        >
          <div>
            <p
              class="text-sm font-medium uppercase tracking-[0.16em] text-brand-blue"
            >
              Task Lists
            </p>
            <h1 class="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              Tehtävälistat
            </h1>
            <p class="mt-2 text-sm text-gray-600">
              Näkymä näyttää todo-listat ja niiden sisältämät tehtävät paikallisesta
              synkronoidusta tietokannasta.
            </p>
          </div>
          <div
            class="rounded-full bg-brand-blue-light px-4 py-2 text-sm font-medium text-brand-blue-dark"
          >
            ${this.lists.length} ${this.lists.length === 1
              ? "lista"
              : "listaa"}, ${todoCount} ${todoCount === 1
              ? "tehtävä"
              : "tehtävää"}
          </div>
        </div>

        ${this.lists.length === 0
          ? html`
            <div
              class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500 shadow-sm"
            >
              Ei tehtävälistoja vielä.
            </div>
          `
          : html`
            <div class="space-y-6">
              ${this.lists.map((list) => this.renderList(list))}
            </div>
          `}
      </section>
    `;
  }

  private renderList(list: TodoList) {
    const createdAt = list.createdAt instanceof Date
      ? list.createdAt
      : new Date(list.createdAt);

    return html`
      <section class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div
          class="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4"
        >
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              ${list.name || "Nimetön lista"}
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              Luotu ${Number.isNaN(createdAt.getTime())
                ? "-"
                : createdAt.toLocaleString("fi-FI")}
            </p>
          </div>
          <span
            class="rounded-full bg-brand-blue-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue-dark"
          >
            ${list.todos.length} ${list.todos.length === 1
              ? "tehtävä"
              : "tehtävää"}
          </span>
        </div>

        ${list.todos.length === 0
          ? html`
            <p
              class="mt-4 rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500"
            >
              Lista ei sisällä vielä tehtäviä.
            </p>
          `
          : html`
            <ul class="mt-4 m-0 space-y-3 p-0">
              ${list.todos.map((todo) => this.renderTodo(todo))}
            </ul>
          `}
      </section>
    `;
  }

  private renderTodo(todo: Todo) {
    const createdAt = todo.createdAt instanceof Date
      ? todo.createdAt
      : new Date(todo.createdAt);

    return html`
      <li class="list-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-base font-medium text-gray-900 ${todo.completed
              ? "line-through text-gray-400"
              : ""}">
              ${todo.description || "Nimetön tehtävä"}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              Luotu ${Number.isNaN(createdAt.getTime())
                ? "-"
                : createdAt.toLocaleString("fi-FI")}
            </p>
          </div>
          <span
            class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${todo
                .completed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"}"
          >
            ${todo.completed ? "Valmis" : "Kesken"}
          </span>
        </div>
      </li>
    `;
  }
}

customElements.define("tasks-route", TasksRoute);
