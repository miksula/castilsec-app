import tasksStore from "./tasksStore.ts";
import { EVENT_ACTION, EVENT_DATA, EVENT_LOAD } from "@/lib/constants.ts";
import { Action } from "@/lib/types.ts";

export interface State {
  tasks: typeof tasksStore.state;
}

const initialState = {
  tasks: tasksStore.state,
};

export default function RootStore() {
  const appState: State = initialState;

  addEventListener(EVENT_LOAD, () => updateState());

  addEventListener(EVENT_ACTION, (e: CustomEvent<Action>) => {
    const { name } = e.detail;
    updateState(name);
  });

  function updateState(_action?: string) {
    appState.tasks = tasksStore.getState();
    notify();
  }

  function notify() {
    dispatchEvent(
      new CustomEvent(EVENT_DATA, {
        detail: appState,
        bubbles: false,
        composed: true,
      }),
    );
  }

  return {
    /** @returns The current application state */
    getState() {
      return appState;
    },

    /** Reference to tasks store */
    tasks: tasksStore,
  };
}
