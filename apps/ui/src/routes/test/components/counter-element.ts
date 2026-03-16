import { html, LitElement } from "lit";
import { styles } from "../styles/counter-element.css.ts";

export default class CounterElement extends LitElement {
  static override styles = styles;

  private _value: number = 0;

  override render() {
    return html`
      <span class="value"></span>
      <button class="increment">Increment</button>
      <button class="decrement">Decrement</button>
    `;
  }

  override firstUpdated() {
    const el = this.renderRoot;

    el.addEventListener("counter-change", (event: Event) => {
      this._value = (event as CustomEvent<number>).detail;
      _update();
    });

    el.querySelector(".increment")?.addEventListener("click", () => {
      el.dispatchEvent(
        new CustomEvent("counter-change", {
          detail: this._value + 1,
          bubbles: true,
          composed: false,
        }),
      );
    });

    el.querySelector(".decrement")?.addEventListener("click", () => {
      el.dispatchEvent(
        new CustomEvent("counter-change", {
          detail: this._value - 1,
          bubbles: true,
          composed: false,
        }),
      );
    });

    const _update = () => {
      el.querySelector(".value")!.textContent = this._value.toString();
    };

    // Initial update
    _update();
  }
}

customElements.define("counter-element", CounterElement);
