import { html } from "lit";
import { State, TodoItem } from "@/lib/types.ts";
import { Section } from "./components/section.ts";
const sections = [
  {
    title: "Total",
    slug: "Counts all your tasks.",
    filter: () => true,
  },
  {
    title: "Completed",
    slug: "Number of finished tasks.",
    filter: (todo: TodoItem) => todo.completed,
  },
  {
    title: "Left to-do",
    slug: "The tasks yet to be completed.",
    filter: (todo: TodoItem) => !todo.completed,
  },
];

export function Dashboard(data: State) {
  const items = data.tasks.items;

  const mappedSections = sections.map((section) => {
    const count = items.filter(section.filter).length;
    return { ...section, count };
  });

  return html`
    <div class="box-content mx-auto max-w-width">
      <h1>Dashboard</h1>

      <div class="py-6 flex flex-row gap-4 flex-wrap">
        ${mappedSections.map((section) =>
          Section(section.title, section.slug, section.count)
        )}
      </div>
    </div>
  `;
}
