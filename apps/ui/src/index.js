import { PowerSyncDatabase, createBaseLogger } from '@powersync/web';
import { AppSchema } from './schema.ts';
import { SupabaseConnector } from './services/db/connector.ts';

createBaseLogger().useDefaults();

let powerSync;
let disposeStatusListener;
let watchedTodos;
let disposeTodoListener;

const watchTodoList = () => {
  watchedTodos = powerSync.query({
    sql: `
      SELECT id, content, created_at
      FROM todos
      ORDER BY created_at DESC, id DESC
    `,
    mapper: (row) => ({
      id: String(row.id),
      content: String(row.content ?? ''),
      createdAt: String(row.created_at ?? '')
    })
  }).watch({
    placeholderData: []
  });

  disposeTodoListener = watchedTodos.registerListener({
    onData: (todos) => {
      console.log('Received todos', todos);
    },
    onError: (error) => {
      console.error('Failed to read todos', error);
    },
    onStateChange: (state) => {
      console.log('Todo query state changed', state);
    }
  });
};

const appState = {
  todos: [],
  errorMessage: '',
};

const applySyncStatus = (status) => {
  // const { uploading = false, downloading = false, uploadError, downloadError } = status.dataFlowStatus ?? {};

  console.log('Sync status changed', status);
};


const render = () => {
  console.log('Rendering UI with state', appState);
};

const setError = (message = '') => {
  appState.errorMessage = message;
  render();
};

const closeDatabase = async () => {
  if (disposeTodoListener) {
    disposeTodoListener();
    disposeTodoListener = null;
  }

  if (disposeStatusListener) {
    disposeStatusListener();
    disposeStatusListener = null;
  }

  if (!powerSync) {
    return;
  }

  const database = powerSync;
  powerSync = undefined;

  await database.close();
};

const openDatabase = async () => {
  powerSync = new PowerSyncDatabase({
    schema: AppSchema,
    database: { dbFilename: 'todos.sqlite' },
    flags: {
      externallyUnload: true
    }
  });

  await powerSync.init();

  watchTodoList();
  applySyncStatus(powerSync.currentStatus);
  render();

  disposeStatusListener = powerSync.registerListener({
    statusChanged: (status) => {
      applySyncStatus(status);
      render();
    }
  });

  await powerSync.connect(new SupabaseConnector());
};

window.addEventListener('pagehide', () => {
  void closeDatabase();
});

document.addEventListener('DOMContentLoaded', () => {
  render();

  void openDatabase().catch((error) => {
    setError(`Failed to start todo-sync app: ${normalizeError(error, 'Unknown error')}`);
    console.error('Failed to start todo-sync app', error);
  });
});
