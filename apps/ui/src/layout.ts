import { html, type TemplateResult } from "lit";
import "@/components/app-navigation.ts";

export default function Layout(content: TemplateResult | null) {
  return html`
    <div class="flex min-h-screen flex-col">
      <app-navigation></app-navigation>
      <main class="bg-white flex-1 -mt-1 m-4 p-8 rounded-lg shadow-sm">${content}</main>
    </div>
  `;
}
