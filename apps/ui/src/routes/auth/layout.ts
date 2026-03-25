import { html, type TemplateResult } from "lit";

export default function Layout(content: TemplateResult | null) {
  return html`
    <div class="flex min-h-screen flex-col">
      <main class="mx-4 mt-16">${content}</main>
    </div>
  `;
}
