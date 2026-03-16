import type { Filter, TodoItem } from "@/lib/types.ts";
import { action } from "@/state/action.ts";
import * as queries from "@/services/db/queries.ts";
import * as storage from "@/services/db/storage.ts";

export type Tasks = {
  items: TodoItem[];
  filter: Filter;
};

const initialState: Tasks = {
  items: [],
  filter: storage.getFilter(), // defaults "all" if not set
};

class TasksStore {
  public state: Tasks = initialState;

  constructor() {
    const watchedTasks = queries.watchTasks();

    watchedTasks.registerListener({
      onData: (tasks) => {
        console.log("Received tasks", tasks);
        this.updateItems([...tasks]);
      },
    });
  }

  getState() {
    return {
      items: this.state.items,
      filter: storage.getFilter(),
    };
  }

  /**
   * Updates the task items state for the UI.
   * @param items - Updated task items
   */
  @action
  updateItems(items: TodoItem[]) {
    this.state.items = items;
  }

  /**
   * Sets the current filter for tasks.
   * @param filter - The filter to set (e.g., "all", "active", "completed").
   */
  @action
  setFilter(filter: Filter) {
    storage.setFilter(filter);
  }

  /**
   * Adds a new task to the database.
   * @param text - The task description.
   */
  async add(text: string) {
    await queries.createTask(text);
  }

  /**
   * Removes a task from the database by its ID.
   * @param id - The ID of the task to delete.
   */
  async delete(id: string) {
    await queries.deleteTask(id);
  }

  /**
   * Updates the completion status of a task.
   * @param id - The ID of the task to update.
   * @param completed - The new completion status (0 or 1).
   */
  async completed(id: string, completed: 0 | 1) {
    await queries.updateTask(id, completed);
  }

  /**
   * Edits the text of a task.
   * @param id - The ID of the task to edit.
   * @param text - The new text for the task.
   */
  async edit(id: string, text: string) {
    await queries.updateTask(id, undefined, text);
  }
}

export default new TasksStore();
