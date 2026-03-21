// deno-lint-ignore-file no-explicit-any
import { dispatchActionEvent } from "./action.ts";

let callIndex = 0;
let stateValues: any[] = [];
let lastPath = "";

/**
 * Prepares the hook system for a new render cycle.
 * Should be called before the app renders.
 */
export const prepareHooks = (currentPath: string = location.pathname) => {
  // If the route has changed, clear the state to avoid collisions between pages
  if (currentPath !== lastPath) {
    stateValues = [];
    lastPath = currentPath;
  }
  // Always reset the cursor index at the start of a render
  callIndex = 0;
};

export const useState = <T>(initialValue: T): [T, (newVal: T) => void] => {
  const currentCallIndex = callIndex;
  callIndex++;

  if (stateValues[currentCallIndex] === undefined) {
    stateValues[currentCallIndex] = initialValue;
  }

  const setValue = (newValue: T) => {
    stateValues[currentCallIndex] = newValue;
    // Trigger a global update which will eventually call prepareHooks() again
    dispatchActionEvent({ name: "useState" });
  };

  return [stateValues[currentCallIndex], setValue];
};
