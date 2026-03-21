/**
 * @module localStorage wrapper for tasks filter.
 */
import type { Filter } from "../../lib/types.ts";

export function getFilter(): Filter {
  const result = localStorage.getItem("tasks.filter") as
    | Filter
    | null;
  return result || "all";
}

export function setFilter(filter: Filter): void {
  localStorage.setItem("tasks.filter", filter);
}
