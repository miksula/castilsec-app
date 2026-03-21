import type { State } from "@/state/stores/root.ts";

export type { State };

export type Todo = {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date | string;
  completedAt: Date | string | null;
  createdBy: string | null;
  completedBy: string | null;
  listId: string;
};

export type TodoList = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date | string;
  todos: Todo[];
};

export type Action = {
  name: string;
};

declare global {
  interface GlobalEventHandlersEventMap {
    EVENT_LOAD: CustomEvent;
    EVENT_DATA: CustomEvent<State>;
    EVENT_ACTION: CustomEvent<Action>;
  }
}
