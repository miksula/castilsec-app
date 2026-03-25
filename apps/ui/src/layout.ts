import { html, type TemplateResult } from "lit";
import "@/components/app-navigation.ts";

export default function Layout(content: TemplateResult | null) {
  return html`
    <div class="flex min-h-screen flex-col">
      <app-navigation></app-navigation>
      <main>${content}</main>
    </div>
  `;
}
