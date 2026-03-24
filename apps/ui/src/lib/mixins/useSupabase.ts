import { LitElement } from "lit";
import { ContextConsumer } from "@lit/context";

import { supabaseContext } from "./supabaseContext.ts";

export const useSupabase = (superClass: typeof LitElement) =>
  class UseSupabaseMixin extends superClass {
    // Consume the supabase context
    private supabaseInstance = new ContextConsumer(this, {
      context: supabaseContext,
      subscribe: true,
    });

    protected supabase = this.supabaseInstance.value;
  };
