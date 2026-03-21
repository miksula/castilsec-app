import {
  createBaseLogger,
  LogLevel,
  PowerSyncDatabase,
  SyncClientImplementation,
  WASQLiteOpenFactory,
  WASQLiteVFS,
} from "@powersync/web";
import { wrapPowerSyncWithKysely } from "@powersync/kysely-driver";
import { AppSchema, Database } from "@/schema.ts";
import { SupabaseConnector } from "@/services/db/connector.ts";

const logger = createBaseLogger();
logger.useDefaults();
logger.setLevel(LogLevel.DEBUG);

/**
 * Default configuration AccessHandlePoolVFS - uses IndexedDB
 * ✅ Use this for: Simple setup, most browsers
 * ❌ Avoid if: You need Safari support or have stability issues
 */
// export const powerSync = new PowerSyncDatabase({
//   schema: AppSchema,
//   database: {
//     dbFilename: 'example.db'
//   },
//   logger: logger
// });

/**
 * Alternative configuration with OPFS storage (Origin Private File System)
 *
 * 🚀 RECOMMENDED: Use OPFSCoopSyncVFS for production apps
 *
 * ✅ When to use:
 * - You need multi-tab support across ALL browsers (including Safari)
 * - Better performance than IndexedDB
 * - Safari/iOS compatibility is important
 *
 * ❌ When NOT to use:
 * - Safari incognito mode (known issues)
 * - You prefer simpler setup
 *
 * Alternative: Change to WASQLiteVFS.AccessHandlePoolVFS for single-tab apps with best performance
 *
 * 📚 Learn more: https://docs.powersync.com/client-sdk-references/javascript-web#sqlite-virtual-file-systems
 */
export const powersync = new PowerSyncDatabase({
  database: new WASQLiteOpenFactory({
    dbFilename: "castilsec-app.db",
    vfs: WASQLiteVFS.OPFSCoopSyncVFS, // Use AccessHandlePoolVFS for single-tab only
    flags: {
      enableMultiTabs: typeof SharedWorker !== "undefined",
    },
  }),
  flags: {
    enableMultiTabs: typeof SharedWorker !== "undefined",
    externallyUnload: true,
  },
  schema: AppSchema,
  logger: logger,
});

export const supabase = new SupabaseConnector();

// Establish connection between PowerSync and the Supabase connector
powersync.connect(supabase, {
  // Rust based implementation is more efficient and faster than the JavaScript implementation
  clientImplementation: SyncClientImplementation.RUST,
  crudUploadThrottleMs: 5000,
});

export const db = wrapPowerSyncWithKysely<Database>(powersync);
