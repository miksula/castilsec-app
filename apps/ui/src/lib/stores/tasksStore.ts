import type { Todo, TodoList } from "@/lib/types.ts";
import { action } from "@/lib/action.ts";
import * as queries from "@/lib/db/queries.ts";
import type { TodoListRow } from "@/lib/db/queries.ts";

const initialState: TodoList[] = [];

class TaskListsStore {
  public state: TodoList[] = initialState;

  constructor() {
    const watchedTaskLists = queries.watchTaskLists();

    watchedTaskLists.registerListener({
      onData: (rows) => {
        this.updateLists(this.groupRows(rows));
      },
    });
  }

  getState() {
    return this.state;
  }

  @action
  updateLists(lists: TodoList[]) {
    this.state = lists;
  }

  private groupRows(rows: TodoListRow[]): TodoList[] {
    const grouped = new Map<string, TodoList>();

    for (const row of rows) {
      let list = grouped.get(row.listId);
      if (!list) {
        list = {
          id: row.listId,
          name: row.listName,
          ownerId: row.listOwnerId,
          createdAt: row.listCreatedAt,
          todos: [],
        };
        grouped.set(row.listId, list);
      }

      if (!row.todoId) {
        continue;
      }

      const todo: Todo = {
        id: row.todoId,
        description: row.todoDescription ?? "",
        completed: row.todoCompleted,
        createdAt: row.todoCreatedAt ?? "",
        completedAt: row.todoCompletedAt,
        createdBy: row.todoCreatedBy,
        completedBy: row.todoCompletedBy,
        listId: row.listId,
      };
      list.todos.push(todo);
    }

    return [...grouped.values()];
  }
}

export default new TaskListsStore();
