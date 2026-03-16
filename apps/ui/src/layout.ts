import { html, type TemplateResult } from "lit";
import "@/lib/components/app-navigation.ts";

export default function Layout(content: TemplateResult | null) {
  return html`
    <div>
      <app-navigation></app-navigation>
      <main class="mx-4 mt-16">${content}</main>
    </div>
  `;
}
