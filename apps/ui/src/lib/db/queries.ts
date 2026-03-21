import { db, powersync } from "./client.ts";

function mapTodoListRow(row: Record<string, unknown>): unknown {
  return {
    listId: row["list_id"] as string,
    listName: row["list_name"] as string,
    listOwnerId: row["list_owner_id"] as string,
    listCreatedAt: row["list_created_at"] as Date,
    todoId: row["todo_id"] as string | null,
    todoDescription: row["todo_description"] as string | null,
    todoCompleted: row["todo_completed"] as boolean | null,
    todoCreatedAt: row["todo_created_at"] as Date | null,
    todoCompletedAt: row["todo_completed_at"] as Date | null,
    todoCreatedBy: row["todo_created_by"] as string | null,
    todoCompletedBy: row["todo_completed_by"] as string | null,
  };
}

export function watchTaskLists() {
  return powersync.query({
    sql: `
      SELECT
        lists.id AS list_id,
        lists.created_at AS list_created_at,
        lists.name AS list_name,
        lists.owner_id AS list_owner_id,
        todos.id AS todo_id,
        todos.created_at AS todo_created_at,
        todos.completed_at AS todo_completed_at,
        todos.description AS todo_description,
        todos.completed AS todo_completed,
        todos.created_by AS todo_created_by,
        todos.completed_by AS todo_completed_by
      FROM lists
      LEFT JOIN todos ON todos.list_id = lists.id
      ORDER BY lists.created_at ASC, todos.created_at ASC
    `,
    mapper: mapTodoListRow,
  }).watch({
    placeholderData: [],
  });
}

// export async function getTasks() {
//   const rows = await db.selectFrom("tasks").selectAll().execute();
//   return rows.map(mapTask);
// }

// export async function createTask(text: string) {
//   await powersync.execute("INSERT INTO tasks(id, text) VALUES(uuid(), ?)", [
//     text,
//   ]);
// }

// export async function deleteTask(id: string) {
//   await powersync.execute("DELETE FROM tasks WHERE id = ?", [id]);
// }

// export async function updateTask(id: string, completed?: 0 | 1, text?: string) {
//   console.log("Updating task", { id, completed, text });
//   if (completed !== undefined) {
//     await powersync.execute("UPDATE tasks SET completed = ? WHERE id = ?", [
//       completed,
//       id,
//     ]);
//   }
//   if (text !== undefined) {
//     await powersync.execute("UPDATE tasks SET text = ? WHERE id = ?", [
//       text,
//       id,
//     ]);
//   }
// }
