import { html, LitElement } from "lit";
import { classMap } from "lit/directives/class-map.js";

import { noShadow } from "../mixins/noShadow.ts";
import { useRouter } from "../mixins/useRouter.ts";

const props = {
  text: { type: String },
  to: { type: String },
  active: { type: Boolean },
};

class NavLink extends useRouter(noShadow(LitElement)) {
  static override properties = props;

  /** The text content of the link. */
  public text: string;
  /** The target route/path of the link. */
  public to: string;
  /** Whether the link is currently active. */
  public active?: boolean;

  constructor() {
    super();
    this.text = "";
    this.to = "/";
    this.active = false;
  }

  override render() {
    return html`
      <li
        @click="${this
          .handleClick}"
        class="group transition-[background-color] cursor-pointer mx-2 px-4 py-2 rounded-full hover:bg-stone-200 [&.active]:bg-brand-blue-light ${classMap(
          {
            "active": !!this.active,
          },
        )}"
      >
        <a
          class="text-zinc-700 font-medium text-base group-[.active]:text-brand-blue"
          href="${this.to}"
        >${this.text}</a>
      </li>
    `;
  }

  private handleClick(event: Event) {
    event.preventDefault();
    this.router?.navigate(this.to);
  }
}

customElements.define("nav-link", NavLink);
