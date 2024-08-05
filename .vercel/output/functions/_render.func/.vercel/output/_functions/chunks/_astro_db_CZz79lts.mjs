import { normalizeDatabaseUrl, createLocalDatabaseClient, asDrizzleTable } from '@astrojs/db/runtime';
import '@astrojs/db/dist/runtime/virtual.js';

const dbUrl = normalizeDatabaseUrl(process.env.ASTRO_DATABASE_FILE, "file:///Users/gvagdas/Documents/Dev/money-trooper/.astro/content.db");
const db = createLocalDatabaseClient({ dbUrl });
const Expense = asDrizzleTable("Expense", { "columns": { "id": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Expense", "primaryKey": true } }, "description": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "description", "collection": "Expense", "primaryKey": false, "optional": false } }, "amount": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "amount", "collection": "Expense", "primaryKey": false, "optional": false } }, "date": { "type": "date", "schema": { "optional": false, "unique": false, "deprecated": false, "name": "date", "collection": "Expense" } }, "category": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "category", "collection": "Expense", "primaryKey": false, "optional": false } } }, "deprecated": false, "indexes": {} }, false);

export { Expense as E, db as d };
