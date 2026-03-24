import { LitElement } from "lit";
import { ContextConsumer } from "@lit/context";

import { supabaseContext } from "./supabaseContext.ts";

// deno-lint-ignore no-explicit-any
type Constructor<T = Record<string, never>> = new (...args: any[]) => T;

export function useSupabase<T extends Constructor<LitElement>>(Base: T) {
  return class UseSupabaseMixin extends Base {
    private supabaseInstance = new ContextConsumer(this, {
      context: supabaseContext,
      subscribe: true,
    });

    protected get supabase() {
      const supabase = this.supabaseInstance.value;

      if (!supabase) {
        throw new Error("Supabase context is not available.");
      }

      return supabase;
    }
  };
}
