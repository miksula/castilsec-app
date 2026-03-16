import { createContext } from "@lit/context";
import Router from "@app/router";
export type { Router };
export const routerContext = createContext<Router>("router");
