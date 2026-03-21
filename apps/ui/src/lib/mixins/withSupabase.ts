import { LitElement } from "lit";
import { ContextProvider } from "@lit/context";

import { supabase } from "@/lib/db/client.ts";
import { supabaseContext } from "./supabaseContext.ts";

export const withSupabase = (superClass: typeof LitElement) =>
  class WithSupabaseMixin extends superClass {
    protected supabase = supabase;

    private _supabaseProvider = new ContextProvider(this, {
      context: supabaseContext,
      initialValue: this.supabase,
    });
  };
