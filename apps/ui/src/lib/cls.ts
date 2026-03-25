import { classMap } from "lit/directives/class-map.js";

/**
 * Sets a list of classes to an element based on string arguments or an object.
 *
 * @example
 * ```
 * const classes = cls("text-black", "flex", { "items-center": true, "gap-2": true });
 * // classes will be "text-black flex items-center gap-2"
 * ```
 *
 * @param args - A list of string class names or an object where keys are class names and values are booleans indicating whether the class should be included.
 * @returns A directive result to be applied to an element class attribute.
 */
export default function cls(
  ...args: (string | Record<string, boolean | undefined>)[]
): ReturnType<typeof classMap> {
  const classObject: Record<string, boolean> = {};

  for (const arg of args) {
    if (typeof arg === "string") {
      classObject[arg] = true;
    } else if (typeof arg === "object" && arg !== null) {
      Object.assign(classObject, arg);
    }
  }

  return classMap(classObject);
}
