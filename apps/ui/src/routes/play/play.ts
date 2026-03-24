import { html, LitElement } from "lit";

export function Play() {
  return html`
    <play-route></play-route>
  `;
}

class PlayRoute extends LitElement {
  override createRenderRoot() {
    return this;
  }

  override render() {
    return html`
      <main>Play</main>
    `;
  }
}

customElements.define("play-route", PlayRoute);
