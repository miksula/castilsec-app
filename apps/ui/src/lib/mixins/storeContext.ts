import { createContext } from "@lit/context";
import RootStore from "@/state/stores/root.ts";
export type StoreType = ReturnType<typeof RootStore>;
export const storeContext = createContext<StoreType>("store");
