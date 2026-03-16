import { html } from "lit";

export function NotFound(path: string) {
  return html`
    <div>
      Not found - ${path}
    </div>
  `;
}
