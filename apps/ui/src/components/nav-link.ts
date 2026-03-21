import { html, LitElement } from "lit";
import { classMap } from "lit/directives/class-map.js";

import { noShadow, useRouter } from "@/lib/mixins/index.ts";

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
      "inline-flex items-center border-b-2 px-1 pt-1 text-sm": !isMobile,
      "block border-l-4 py-2 pr-4 pl-3 text-base": isMobile,
      "border-brand text-gray-900": !!this.active && !isMobile,
      "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700":
        !this.active && !isMobile,
      "border-brand bg-brand-100/60 text-brand-dark": !!this.active && isMobile,
      "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700":
        !this.active && isMobile,
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
