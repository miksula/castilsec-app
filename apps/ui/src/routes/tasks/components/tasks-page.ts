import { html, LitElement, PropertyValues } from "lit";
import { repeat } from "lit/directives/repeat.js";

import type { Filter, State, TodoItem } from "@/lib/types.ts";
import { useStore } from "@/lib/mixins/useStore.ts";
import { noShadow } from "@/lib/mixins/noShadow.ts";
import { DeleteDialog } from "./deleteDialog.ts";

import "./task-item.ts";
import "./filter-button.ts";

const FILTER_MAP = {
  all: () => true,
  active: (todo: TodoItem) => !todo.completed,
  completed: (todo: TodoItem) => todo.completed,
};

type DeleteEvent = CustomEvent<{ id: number }>;

export default class TasksPage extends useStore(noShadow(LitElement)) {
  static override properties = {
    data: {},
  };

  /** The tasks store state. */
  declare public data: State["tasks"];

  private input?: HTMLInputElement;
  private newId?: number;
  private modalOpen?: boolean;
  private idToDelete?: string;

  override firstUpdated() {
    this.input = this.renderRoot?.querySelector("input") || undefined;
  }

  keyboardAction(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        this.saveTask(event);
        break;
      case "Escape":
        this.clear();
        break;
    }
  }

  saveTask(e: Event) {
    e.preventDefault();
    if (this.input) {
      const text = this.input.value.trim();
      if (!text) {
        return;
      }
      this.input.value = "";
      this.input.focus();
      this.store?.tasks.add(text);
    }
  }

  clear() {
    if (this.input) {
      this.input.value = "";
      this.input.blur();
    }
  }

  override willUpdate(changedProperties: PropertyValues) {
    const data = changedProperties.get("data") as State["tasks"] | undefined;
    if (data) {
      const previousItems = data.items;
      const currentItems = this.data.items;

      if (currentItems.length - previousItems.length == 1) {
        // A new item was added
        const newItem = currentItems.find(
          (item) => !previousItems.some((prev) => prev.id === item.id),
        );
        if (newItem) {
          this.newId = Number(newItem.id);
        }
      }
    }
  }

  override render() {
    const { items, filter } = this.data;

    const filteredItems = items.filter(FILTER_MAP[filter]);

    const filterButtons = (Object.keys(FILTER_MAP) as Filter[]).map(
      function mapNameToBtn(name) {
        return html`
          <filter-button
            name="${name}"
            ?active="${name == filter}"
          ></filter-button>
        `;
      },
    );

    const count = filteredItems.length;
    const itemsCountText = `${count} task${count == 1 ? "" : "s"}`;

    return html`
      <section class="tasks-page">
        <h1>Tasks</h1>
        <p>What needs to be done?</p>

        <div class="input-group">
          <input
            type="text"
            id="new-task-input"
            @keyup="${this.keyboardAction}"
          />
          <button class="action" @click="${this.saveTask}">Add Task</button>
        </div>

        <p class="label">Filter by</p>

        <div class="filter-by-group">
          ${filterButtons}
        </div>

        <ul>
          ${repeat(
            filteredItems,
            (item: TodoItem) => item.id,
            (item) =>
              html`
                <task-item
                  .item="${item}"
                  ?new="${item.id == this.newId}"
                  @delete-task="${this.onDeleteTask}"
                ></task-item>
              `,
          )}
        </ul>

        <p class="label">${itemsCountText}</p>

        ${DeleteDialog(
          this.modalOpen,
          () => this.handleDelete(),
          () => this.openModal(false),
        )}
      </section>
    `;
  }

  onDeleteTask(event: DeleteEvent) {
    this.idToDelete = String(event.detail.id);
    this.openModal();
  }

  handleDelete() {
    if (this.idToDelete) {
      this.store?.tasks.delete(this.idToDelete);
      this.idToDelete = undefined;
    }
    this.openModal(false);
  }

  openModal(open = true) {
    this.modalOpen = open;
    this.requestUpdate();
  }
}

customElements.define("tasks-page", TasksPage);
