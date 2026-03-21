import { html, type TemplateResult } from "lit";

export default function Layout(content: TemplateResult | null) {
  return html`
    <div>
      <main class="mx-4 mt-16">${content}</main>
    </div>
  `;
}
