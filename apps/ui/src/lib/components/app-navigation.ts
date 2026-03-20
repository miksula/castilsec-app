import { html, LitElement } from "lit";
import { noShadow } from "../mixins/noShadow.ts";
import { useRouter } from "../mixins/useRouter.ts";

import "./nav-link.ts";

class AppNavigation extends useRouter(noShadow(LitElement)) {
  private activePath: string = "/";

  override connectedCallback() {
    super.connectedCallback();

    this.router?.onRouteCheck((path) => {
      this.activePath = path;
      this.requestUpdate();
    });
  }

  override render() {
    return html`
      <nav
        class="px-8 flex items-center h-14 border-b border-b-gray-200"
      >
        <img src="/logo.svg" alt="Castle Logo" class="w-6 h-6" />
        <span class="mx-2 font-semibold text-gray-800 tracking-wide">castilsec</span>
        <ul class="mx-8 p-0 flex justify-between list-none">
          <nav-link text="Työpöytä" to="/" ?active="${this.activePath ==
            "/"}"></nav-link>
          <nav-link text="Kohteet" to="/kohteet" ?active="${this.activePath ==
            "/kohteet"}"></nav-link>
          <nav-link text="Tehtävät" to="/tehtavat" ?active="${this.activePath ==
            "/tehtavat"}"></nav-link>
          <nav-link text="Riskit" to="/riskit" ?active="${this.activePath ==
            "/riskit"}"></nav-link>
        </ul>
      </nav>
    `;
  }
}

customElements.define("app-navigation", AppNavigation);
