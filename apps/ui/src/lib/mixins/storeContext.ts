import { createContext } from "@lit/context";
import RootStore from "@/state/stores/root.ts";
export type Store = ReturnType<typeof RootStore>;
export const storeContext = createContext<Store>("store");
