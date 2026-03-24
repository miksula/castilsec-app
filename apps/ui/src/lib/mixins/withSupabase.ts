import { LitElement } from "lit";
import { ContextProvider } from "@lit/context";

import { supabase } from "@/lib/db/client.ts";
import { supabaseContext } from "./supabaseContext.ts";

// deno-lint-ignore no-explicit-any
type Constructor<T = Record<string, never>> = new (...args: any[]) => T;

export function withSupabase<T extends Constructor<LitElement>>(Base: T) {
  return class WithSupabaseMixin extends Base {
    private supabaseInstance = supabase;

    protected get supabase() {
      return this.supabaseInstance;
    }

    private _supabaseProvider = new ContextProvider(this, {
      context: supabaseContext,
      initialValue: this.supabase,
    });
  };
}
