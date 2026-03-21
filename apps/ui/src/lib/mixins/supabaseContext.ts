import { createContext } from "@lit/context";
import { SupabaseConnector } from "@/services/db/connector.ts";
export type { SupabaseConnector };
export const supabaseContext = createContext<SupabaseConnector>("supabase");
