import { html } from "lit";
import { State } from "@/lib/types.ts";
import "./components/tasks-page.ts";

export function Tasks(data: State["tasks"]) {
  return html`
    <tasks-page .data="${data}"></tasks-page>
  `;
}
