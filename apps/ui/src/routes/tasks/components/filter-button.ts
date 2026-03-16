import { css, html, LitElement } from "lit";
import { classMap } from "lit/directives/class-map.js";

import type { Filter } from "@/lib/types.ts";
import { CheckMarkIcon } from "@/lib/icons/CheckMarkIcon.ts";
import { useStore } from "@/lib/mixins/useStore.ts";

export class FilterButton extends useStore(LitElement) {
  static override properties = {
    name: { type: String },
    active: { type: Boolean },
  };

  static override styles = css`
    button {
      display: flex;
      background-color: var(--color-zinc-200);
      color: var(--color-zinc-700);
      font-size: var(--text-xs);
      font-family: var(--font-sans);
      font-weight: var(--font-weight-semibold);
      border-style: none;
      padding-inline: var(--spacing-3);
      padding-block: var(--spacing-2);
      border-radius: var(--spacing-2);
      cursor: pointer;

      svg {
        width: 1rem;
        height: 1rem;
        margin-left: -3px;
        margin-right: 3px;
        transform: scale(1.25);
      }

      span {
        text-transform: capitalize;
      }
    }

    button.active {
      background-color: var(--color-brand-blue-light);
      color: var(--color-brand-blue);
    }
  `;

  declare name: Filter;
  declare active: boolean;

  override render() {
    const classes = classMap({
      active: this.active,
    });

    return html`
      <button class="${classes}" @click="${this.setFilter}">
        ${this.active ? CheckMarkIcon() : ""}
        <span>${this.name}</span>
      </button>
    `;
  }

  private setFilter() {
    this.store?.tasks.setFilter(this.name);
  }
}

customElements.define("filter-button", FilterButton);
