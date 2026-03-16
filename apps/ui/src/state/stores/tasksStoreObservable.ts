import type { Filter, TodoItem } from "@/lib/types.ts";
import { createBaseLogger, PowerSyncDatabase } from "@powersync/web";
import { AppSchema } from "@/schema.ts";
import { SupabaseConnector } from "@/services/db/connector.ts";

createBaseLogger().useDefaults();

export type Tasks = {
  items: TodoItem[];
  filter: Filter;
};

const initialState: Tasks = {
  items: [],
  filter: "all",
};

let db: PowerSyncDatabase;

const openDatabase = async () => {
  db = new PowerSyncDatabase({
    schema: AppSchema,
    database: { dbFilename: "tasks.sqlite" },
    flags: {
      externallyUnload: true,
    },
  });

  await db.init();

  watchTasksList();

  await db.connect(new SupabaseConnector());
};

const watchTasksList = () => {
  const watchedTasks = db.query({
    sql: `
      SELECT id, text, completed, created_at
      FROM tasks
      ORDER BY created_at DESC, id DESC
    `,
    mapper: (row) => ({
      id: String(row.id),
      text: String(row.text ?? ""),
      completed: Boolean(row.completed ?? false),
      createdAt: String(row.created_at ?? ""),
    }),
  }).watch({
    placeholderData: [],
  });

  watchedTasks.registerListener({
    onData: (tasks) => {
      console.log("Received tasks", tasks);
    },
    onError: (error) => {
      console.error("Failed to read tasks", error);
    },
    onStateChange: (state) => {
      console.log("Task query state changed", state);
    },
  });
};

class TasksStoreObservable {
  public initialState = initialState;

  constructor() {
    openDatabase().catch((error) => {
      console.error("Failed to open database", error);
    });
  }

  async load(): Promise<Tasks> {
    console.warn(
      "TasksStoreObservable.load is currently a no-op and returns the initial state.",
    );
    return Promise.resolve({
      items: [],
      filter: "all",
    });
  }
}

export default new TasksStoreObservable();
