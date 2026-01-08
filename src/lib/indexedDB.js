// lib/indexedDb.js
import Dexie from "dexie";

export const db = new Dexie("POSDatabase");

db.version(1).stores({
  pendingInvoices: "++id, timestamp, status",
});

db.version(2)
  .stores({})
  .upgrade((tx) => {});
