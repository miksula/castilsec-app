import { html } from "lit";
import { useState } from "@/state/hooks.ts";

export function Section(title: string, slug: string, count: number) {
  const [active, setActive] = useState(false);

  return html`
    <section
      @click="${() => setActive(!active)}"
      class="group flex bg-gray-100 hover:bg-gray-200 hover:cursor-pointer transition-[background-color] rounded-3xl px-4 py-6 outline-brand-blue [&.active]:outline-2 ${active
        ? "active"
        : ""}"
    >
      <div class="pr-3">
        <h2 class="font:(--heading2) mt-0 mb-1">
          ${title}
        </h2>
        <p class="slug m-0">
          ${slug}
        </p>
      </div>

      <div
        class="group-hover:bg-brand-blue bg-brand-blue-light text-brand-blue-dark group-hover:text-white font-medium flex h-8 w-8 justify-center rounded-full transition-[background-color]"
      >
        <span class="group-hover:text-white self-center">${count}</span>
      </div>
    </section>
  `;
}
