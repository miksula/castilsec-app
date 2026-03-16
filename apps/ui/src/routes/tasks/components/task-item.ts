import { html, LitElement } from "lit";
import { classMap } from "lit/directives/class-map.js";

import { type TodoItem } from "@/lib/types.ts";
import { useStore } from "@/lib/mixins/useStore.ts";
import { noShadow } from "@/lib/mixins/noShadow.ts";
import { EditIcon } from "@/lib/icons/EditIcon.ts";
import { DeleteIcon } from "@/lib/icons/DeleteIcon.ts";

export class TaskItem extends useStore(noShadow(LitElement)) {
  static override properties = {
    item: { type: Object },
    new: { type: Boolean },
    removeItem: { type: Function },
  };

  /** The todo item to display and manage. */
  declare public item: TodoItem;
  /** Indicates if this is the latest added task. */
  declare public new: boolean;

  private isEditing = false;
  private newText = "";

  setEditing(isEditing: boolean, update = true) {
    this.isEditing = isEditing;
    if (update) {
      this.requestUpdate();
    }
    this.updateComplete.then(() => {
      if (isEditing) {
        const input = this.renderRoot.querySelector(
          'input[name="task-edit"]',
        ) as HTMLInputElement;
        input?.focus();
        // input?.select();
      }
    });
  }

  toggleCompleted(item: TodoItem) {
    this.store?.tasks.completed(
      String(item.id),
      !item.completed ? 1 : 0,
    );
  }

  removeTask(item: TodoItem) {
    this.store?.tasks.delete(String(item.id));
  }

  editTask(item: Omit<TodoItem, "completed" | "created_at">) {
    console.log("Editing task from UI:", item);
    this.store?.tasks.edit(String(item.id), item.text);
  }

  handleChange(event: KeyboardEvent, item: TodoItem) {
    this.newText = (event.target as HTMLInputElement)?.value;
    if (event.key == "Enter") {
      this.handleSubmit(event, item);
    }
  }

  handleSubmit(event: InputEvent | KeyboardEvent, item: TodoItem) {
    event.preventDefault();
    if (!this.newText.trim()) {
      return;
    }
    this.setEditing(false);
    this.editTask({ id: String(item.id), text: this.newText });
    this.newText = "";
  }

  override render() {
    const item = this.item;

    const viewTemplate = html`
      <li class="viewing ${this.new ? "new" : ""}">
        <div>
          <input
            type="checkbox"
            ?checked="${item.completed}"
            @click="${() => this.toggleCompleted(item)}"
            @keypress="${(e: KeyboardEvent) => {
              if (e.key === "Enter") {
                this.toggleCompleted(item);
              }
            }}"
          />
          <span class="${classMap({ "completed": item.completed })}"> ${item
            .text} </span>
        </div>
        <div class="action-buttons">
          <button title="Edit" @click="${() => this.setEditing(true)}">
            ${EditIcon()}
          </button>
          <button title="Remove" @click="${() => this.removeTask(item)}">
            ${DeleteIcon()}
          </button>
        </div>
      </li>
    `;

    const editingTemplate = html`
      <form class="editing" @submit="${(event: InputEvent) =>
        this.handleSubmit(event, item)}">
        <input
          name="task-edit"
          type="text"
          .value="${this.newText || item.text}"
          @input="${(event: KeyboardEvent) => this.handleChange(event, item)}"
        />
        <div class="buttons">
          <button
            @click="${() => this.setEditing(false)}"
          >
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    `;

    return this.isEditing ? editingTemplate : viewTemplate;
  }
}

customElements.define("task-item", TaskItem);
