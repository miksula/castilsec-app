import { html } from "lit";

export function Task(taskId: string) {
  return html`
    <div>Task - ${taskId}</div>
  `;
}
