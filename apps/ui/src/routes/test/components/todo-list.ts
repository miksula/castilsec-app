import { html, LitElement, render } from "lit";
import { State, TodoItem } from "@/lib/types.ts";
import { EVENT_DATA } from "@/lib/constants.ts";
import { styles } from "../styles/todo-list.css.ts";

export default class TodoList extends LitElement {
  static override styles = styles;

  private items: TodoItem[] = [];

  override render() {
    return html`
      <div class="items">
        Todo items
      </div>
    `;
  }

  override firstUpdated() {
    const el = this.renderRoot;
    const container = el.querySelector(".items")!;

    addEventListener(EVENT_DATA, (event: CustomEvent<State>) => {
      this.items = event.detail.tasks.items;
      repeat();
    }, true);

    /**
     * Updates the DOM to reflect the current state of items in the todo list.
     *
     * This function efficiently reconciles the DOM by:
     * - Reusing existing DOM elements when items remain in the list (keyed by item.id)
     * - Creating new elements for new items
     * - Removing obsolete elements that are no longer needed
     * - Reordering elements to match the current items array
     *
     * The reconciliation process minimizes DOM mutations by tracking existing elements
     * via their `data-key` attribute and only making necessary changes to the container.
     *
     * @remarks
     * Each todo item is rendered as a div with class "todo-item".
     */
    const repeat = () => {
      const obsolete = new Set(container.children);
      const childrenByKey = new Map<string, HTMLElement>();

      // Map existing children by their data-key attribute
      obsolete.forEach((child) => {
        const key = (child as HTMLElement).dataset.key;
        if (key) {
          childrenByKey.set(key, child as HTMLElement);
        }
      });

      const children = this.items.map((item) => {
        let child = childrenByKey.get(item.id.toString());
        if (child) {
          // Reuse existing element
          obsolete.delete(child);
        } else {
          // Create new element
          child = document.createElement("div");
          child.classList.add("todo-item");
          child.dataset.key = item.id.toString();

          render(
            html`
              <input type="checkbox" ?checked="${item.completed === 1}" />
              <span>${item.text}</span>
            `,
            child,
          );

          return child;
        }
      });

      // Clear container
      obsolete.forEach((child) => child.remove());

      // Apply animations for insertions
      function insertChild(child: HTMLElement, before: ChildNode | null) {
        container.insertBefore(child, before);

        child.animate([
          { opacity: 0, transform: "translateY(-20px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], {
          duration: 300,
          easing: "ease-out",
          fill: "forwards",
        });
      }

      // Insert or reorder children
      children.forEach((child, indx) => {
        const existing = container.children[indx];
        if (child && existing !== child) {
          insertChild(child, existing);
        }
      });
    };
  }
}

customElements.define("todo-list", TodoList);
