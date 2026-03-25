import "@vaadin/avatar";
import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/tabs";

import { html, type TemplateResult } from "lit";
import Logo from "@/components/icons/LogoCastleSolidIcon.ts";

export default function Layout(content: TemplateResult | null) {
  return html`
    <div class="flex min-h-screen flex-col">
      <nav class="flex min-h-16 px-4 border-b">
        <div class="flex items-center justify-start gap-2 shrink-0">
          <div class="h-7 w-7 text-(--aura-accent-color) opacity-80 mt-0">
            ${Logo()}
          </div>
          <div
            class="grid w-29.5 text-left text-sm leading-tight text-(--aura-accent-color)"
          >
            <span class="truncate font-medium">CastilSec</span>
            <span class="truncate text-xs">Tietoturva hallintaan</span>
          </div>
        </div>
        <div class="flex-1 flex items-center justify-start mx-4">
          <section class="flex gap-5">
            <span class="flex items-center gap-2">
              <vaadin-icon icon="vaadin:dashboard"></vaadin-icon>
              <span class="font-normal text-foreground uppercase">Työpöytä</span>
            </span>
            <span class="flex items-center gap-2">
              <vaadin-icon icon="vaadin:crosshairs"></vaadin-icon>
              <span class="font-normal text-foreground uppercase">Kohteet</span>
            </span>
            <span class="flex items-center gap-2">
              <vaadin-icon icon="vaadin:check"></vaadin-icon>
              <span class="font-normal text-foreground uppercase">Tehtävät</span>
            </span>
            <span class="flex items-center gap-2">
              <vaadin-icon icon="vaadin:fire"></vaadin-icon>
              <span class="font-normal text-foreground uppercase">Riskit</span>
            </span>
          </section>
        </div>
        <div class="w-1/6 flex items-center justify-end">
          <vaadin-avatar name="Mika Vallittu"></vaadin-avatar>
        </div>
      </nav>
      <main>${content}</main>
    </div>
  `;
}
