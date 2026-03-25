import "@vaadin/app-layout";
import "@vaadin/app-layout/vaadin-drawer-toggle";
import "@vaadin/horizontal-layout";
import "@vaadin/split-layout";
import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/scroller";
import "@vaadin/side-nav";
import { css, html, LitElement } from "lit";

export function Play() {
  return html`
    <play-route></play-route>
  `;
}

class PlayRoute extends LitElement {
  static override styles = css`
    h1 {
      font-size: 1.125rem;
      left: var(--lumo-space-l);
      margin: 0;
      position: absolute;
    }

    vaadin-tabs {
      margin: auto;
    }
  `;

  override createRenderRoot() {
    return this;
  }

  override render() {
    return html`
      <vaadin-split-layout orientation="horizontal" class="min-h-dvh">
        <div>Osa 1</div>
        <div>Osa 2</div>
      </vaadin-split-layout>
    `;
  }
}

customElements.define("play-route", PlayRoute);
