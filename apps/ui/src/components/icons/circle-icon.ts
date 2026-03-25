import { css, html, LitElement } from "lit";

// https://www.shadcn.io/icon/lucide-circle-alert
class CircleIcon extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
  `;

  override render() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="opacity:1;"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4m0 4h.01" />
      </svg>
    `;
  }
}

customElements.define("circle-icon", CircleIcon);
