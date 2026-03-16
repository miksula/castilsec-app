import { db } from "./client.ts";

// Maps task rows from the database to the TodoItem type
const mapTask = (row: Record<string, unknown>) => {
  const id = String(row.id);
  const text = String(row.text ?? "");
  const completed = (row.completed ?? 0) === 1 ? 1 : 0 as 0 | 1;
  const created_at = new Date(row.created_at as string);

  return {
    id,
    text,
    completed,
    created_at,
  };
};

export function watchTasks() {
  return db.query({
    sql: `SELECT id, text, completed, created_at FROM tasks`,
    mapper: mapTask,
  }).watch({
    placeholderData: [],
  });
}

export async function createTask(text: string) {
  await db.execute("INSERT INTO tasks(id, text) VALUES(uuid(), ?)", [text]);
}

export async function deleteTask(id: string) {
  await db.execute("DELETE FROM tasks WHERE id = ?", [id]);
}

export async function updateTask(id: string, completed?: 0 | 1, text?: string) {
  console.log("Updating task", { id, completed, text });
  if (completed !== undefined) {
    await db.execute("UPDATE tasks SET completed = ? WHERE id = ?", [
      completed,
      id,
    ]);
  }
  if (text !== undefined) {
    await db.execute("UPDATE tasks SET text = ? WHERE id = ?", [text, id]);
  }
}
