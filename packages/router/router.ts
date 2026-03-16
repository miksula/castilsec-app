/// <reference lib="dom" />

export class RouteContext {
  public params: Record<string, string>;
  public path: string;
  private searchParams: URLSearchParams;

  constructor(path: string, params: Record<string, string | undefined> = {}) {
    this.path = path;
    // Filter out undefined values and convert to Record<string, string>
    this.params = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined),
    ) as Record<string, string>;
    this.searchParams = new URLSearchParams(location.search);
  }

  param(key?: string): string | Record<string, string> | undefined {
    if (key) {
      return this.params[key];
    }
    return this.params;
  }

  search(key?: string): string | Record<string, string> {
    if (key) {
      return this.searchParams.get(key) || "";
    }
    const result: Record<string, string> = {};
    this.searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}

type RouterOptions = {
  root?: string;
};

type RouteHandler = (context: RouteContext) => void;

type RouteItem = {
  pattern: URLPattern;
  handler: RouteHandler;
};

export default class Router {
  private routes: RouteItem[] = [];
  private root = "/";
  private routeCheckHandlers: ((path: string) => void)[] = [];

  constructor(options: RouterOptions = {}) {
    if (options.root) {
      this.root = this.clearSlashes(options.root);
    }
    globalThis.addEventListener("popstate", () => {
      this.check();
    });
  }

  clearSlashes(path: string) {
    return path.replace(/\/$/, "").replace(/^\//, "");
  }

  getPath() {
    let fragment = this.clearSlashes(
      decodeURI(location.pathname + location.search),
    );
    fragment = fragment.replace(/\?(.*)$/, "");
    return this.root + this.clearSlashes(fragment);
  }

  get path() {
    return this.getPath();
  }

  add(path: string, handler: RouteHandler) {
    if (!handler) {
      throw new Error("Handler is required");
    }

    // Append automatic trailing slash handling
    const patternPath = path.endsWith("/") ? path : `${path}{/}?`;

    try {
      // Create URLPattern with pathname only
      const pattern = new URLPattern({ pathname: patternPath });
      this.routes.push({ pattern, handler });
    } catch (error) {
      throw new Error(
        `Invalid URLPattern syntax for path "${path}": ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    return this;
  }

  check(f?: string) {
    const fragment = f || this.getPath();

    for (const route of this.routes) {
      // Test with full URL context
      const testUrl = `${location.protocol}//${location.host}${fragment}`;
      const result = route.pattern.exec(testUrl);

      if (result) {
        // Extract parameters from pathname groups
        const params = result.pathname.groups;
        const context = new RouteContext(fragment, params);
        const handlerResult = route.handler.apply({}, [context]);

        for (const handler of this.routeCheckHandlers) {
          handler(this.path);
        }

        return handlerResult;
      }
    }

    return null;
  }

  onRouteCheck(callback: (path: string) => void) {
    this.routeCheckHandlers.push(callback);
    return this;
  }

  navigate(path: string = "") {
    const page = this.root + this.clearSlashes(path);
    history.pushState({ route: page }, "", page);
    this.check();
    return this;
  }
}

export type RouterType = typeof Router;
