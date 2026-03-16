# Test route — Playground

This folder contains a small playground used for experimenting with UI
components, DOM behaviors and quick prototypes. It isn't intended to be part of
the main application logic — instead it's a safe place to try ideas, debug
animations, test event handling patterns, and experiment with DOM reconciliation
or LitElement features.

## Files

- `Test.ts`
  - Route entry point for the playground. When browsing the app, this component
    is mounted on `/test` and renders the example components below.
- `components/counter-element.ts`
  - A simple LitElement that keeps a local counter and demonstrates dispatching
    and handling of a `counter-change` event. Useful for testing event bubbling,
    small interactions and local state handling.
- `components/todo-list.ts`
  - A small list component that listens for `EVENT_DATA` (global state dispatch)
    and renders a list of todo items. This file contains a custom DOM
    reconciliation function to reuse, reorder and animate items efficiently —
    it's an experiment for list rendering optimizations.
- `styles/counter-element.css.ts` and `styles/todo-list.css.ts`
  - Styles scoped to the components above. Keep CSS local here while
    prototyping.

## How to use

1. Start the dev server (Vite) and open the app in your browser.
2. Visit `/test` to try the playground components in the app UI.
3. To simulate application state updates for the `todo-list`, dispatch a global
   `EVENT_DATA` event with a `State` payload. Example from the browser console:

```js
dispatchEvent(
  new CustomEvent("EVENT_DATA", {
    detail: {
      tasks: {
        items: [
          { id: "1", text: "Sample #1", completed: 0 },
          { id: "2", text: "Sample #2", completed: 1 },
        ],
        filter: "all",
      },
    },
  }),
);
```

Alternatively, you can trigger a state load with
`dispatchEvent(new CustomEvent('EVENT_LOAD'))`, which will cause the app's store
to load the state (if configured) and broadcast `EVENT_DATA`.

## Notes & suggestions

- This folder is a good place to add quick POCs before moving code to `shared`
  components. Keep experiments small and temporary; when a pattern or component
  becomes production-ready, move it to a suitable shared folder and add tests.
- Be mindful of event names like `EVENT_DATA` and `EVENT_ACTION` — they are
  defined in `src/lib/constants.ts` and used throughout the app's store for
  broadcasting updates.
- If you're experimenting with list rendering or DOM algorithms (like the one in
  `todo-list.ts`), prefer unit tests or tiny visual test cases under `test/`
  before promoting them to core features.

Happy prototyping! 🎉
