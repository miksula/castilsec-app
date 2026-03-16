import { EVENT_ACTION } from "@/lib/constants.ts";
import type { Action } from "@/lib/types.ts";

export function dispatchActionEvent(
  detail: Action,
  bubbles = true,
  composed = true,
) {
  globalThis.dispatchEvent(
    new CustomEvent<Action>(EVENT_ACTION, {
      detail,
      bubbles,
      composed,
    }),
  );
}

/**
 * @action Decorator applied to async Store class methods to dispatch
 * action event.
 *
 * @example
 * ```ts
 * import { asyncAction } from "@/lib/asyncAction.ts";
 *
 * class TaskStore {
 *  `@asyncAction`
 *   async completeTask(id: string) {
 *     // update state and trigger EVENT_ACTION afterwards
 *   }
 * }
 * ```
 */
export function asyncAction<This, Args extends unknown[], Return>(
  value: (this: This, ...args: Args) => Promise<Return>,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Promise<Return>
  >,
) {
  if (context.kind == "method") {
    return async function (this: This, ...args: Args): Promise<Return> {
      const result = await value.apply(this, args);
      dispatchActionEvent({ name: "tasks:" + String(context.name) });
      return result;
    };
  }
}

/**
 * @action Decorator applied to synchronous Store class methods to dispatch
 * action event.
 *
 * @example
 * ```ts
 * import { action } from "@/lib/action.ts";
 *
 * class TaskStore {
 *  `@action`
 *   updateItems(items: string[]) {
 *     // update state and trigger EVENT_ACTION afterwards
 *   }
 * }
 * ```
 */
export function action<This, Args extends unknown[], Return>(
  value: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >,
) {
  if (context.kind == "method") {
    return function (this: This, ...args: Args): Return {
      const result = value.apply(this, args);
      dispatchActionEvent({ name: "tasks:" + String(context.name) });
      return result;
    };
  }
}
