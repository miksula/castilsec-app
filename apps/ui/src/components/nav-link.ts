import "@vaadin/icon";
import { html, LitElement } from "lit";
import cls from "@/lib/cls.ts";

import { useRouter } from "@/lib/mixins/index.ts";

const props = {
  text: { type: String },
  to: { type: String },
  icon: { type: String },
  active: { type: Boolean },
};

class NavLink extends useRouter(LitElement) {
  static override properties = props;

  /** The text content of the link. */
  public text: string;
  /** The target route/path of the link. */
  public to: string;
  /** The icon to display for the link. */
  public icon: string;
  /** Whether the link is currently active. */
  public active?: boolean;

  constructor() {
    super();
    this.text = "";
    this.to = "/";
    this.icon = "";
    this.active = false;
  }

  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    return this; // no shadow DOM
  }

  override render() {
    const classes = cls(
      "text-black",
      "flex",
      "underline-offset-4",
      { "items-center": true, "gap-2": true },
      { underline: this.active, "no-underline": !this.active },
    );

    return html`
      <a
        class="${classes}"
        href="${this.to}"
        @click="${this.handleClick}"
        aria-current="${this.active ? "page" : "false"}"
      >
        <vaadin-icon .icon="${this.icon}" class="hidden"></vaadin-icon>
        <span class="font-normal uppercase">
          ${this.text}
        </span>
      </a>
    `;
  }

  private handleClick = (event: Event) => {
    event.preventDefault();
    this.router?.navigate(this.to);
  };
}

customElements.define("nav-link", NavLink);
