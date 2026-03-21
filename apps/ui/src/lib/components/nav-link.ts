import { html, LitElement } from "lit";
import { classMap } from "lit/directives/class-map.js";

import { noShadow } from "../mixins/noShadow.ts";
import { useRouter } from "../mixins/useRouter.ts";

const props = {
  text: { type: String },
  to: { type: String },
  active: { type: Boolean },
  mobile: { type: Boolean },
};

class NavLink extends useRouter(noShadow(LitElement)) {
  static override properties = props;

  /** The text content of the link. */
  public text: string;
  /** The target route/path of the link. */
  public to: string;
  /** Whether the link is currently active. */
  public active?: boolean;
  /** Whether the link is rendered in mobile nav. */
  public mobile?: boolean;

  constructor() {
    super();
    this.text = "";
    this.to = "/";
    this.active = false;
    this.mobile = false;
  }

  override render() {
    const isMobile = !!this.mobile;
    const linkClasses = classMap({
      "font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand":
        true,
      "inline-flex items-center rounded-md px-3 py-2 text-sm": !isMobile,
      "block rounded-md px-3 py-2 text-base": isMobile,
      "bg-brand-light text-brand-dark": !!this.active,
      "text-gray-900 hover:bg-brand-100 hover:text-brand-dark": !this.active,
    });

    return html`
      <a
        href="${this.to}"
        @click="${this.handleClick}"
        aria-current="${this.active ? "page" : "false"}"
        class="${linkClasses}"
      >${this.text}</a>
    `;
  }

  private handleClick = (event: Event) => {
    event.preventDefault();
    this.router?.navigate(this.to);
  };
}

customElements.define("nav-link", NavLink);
