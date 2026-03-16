import { column, Schema, Table } from '@powersync/web';
// OR: import { column, Schema, Table } from '@powersync/react-native';

const tasks = new Table(
  {
    // id column (text) is automatically included
    text: column.text,
    completed: column.integer,
    created_at: column.text,
    updated_at: column.text
  },
  { indexes: {} }
);

export const AppSchema = new Schema({
  tasks
});

export type Database = (typeof AppSchema)['types'];
