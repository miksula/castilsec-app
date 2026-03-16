import { html } from "lit";
import { useState } from "@/lib/hooks.ts";

export default function ReactState() {
  const [countA, setCountA] = useState(1);
  const [countB, setCountB] = useState(-1);

  return html`
    <section>
      <div>
        <h1>Count A: ${countA}</h1>
        <button @click="${() => setCountA(countA + 1)}">Increment A</button>
        <button @click="${() => setCountA(countA - 1)}">Decrement A</button>
      </div>
      <div>
        <h1>Count B: ${countB}</h1>
        <button @click="${() => setCountB(countB + 1)}">Increment B</button>
        <button @click="${() => setCountB(countB - 1)}">Decrement B</button>
      </div>
    </section>
  `;
}
