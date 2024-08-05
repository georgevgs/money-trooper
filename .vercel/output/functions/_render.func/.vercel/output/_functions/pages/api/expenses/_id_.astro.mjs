import { normalizeDatabaseUrl, createLocalDatabaseClient, asDrizzleTable } from '@astrojs/db/runtime';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';
export { renderers } from '../../../renderers.mjs';

const dbUrl = normalizeDatabaseUrl(process.env.ASTRO_DATABASE_FILE, "file:///Users/gvagdas/Documents/Dev/money-trooper/.astro/content.db");
const db = createLocalDatabaseClient({ dbUrl });
const Expense = asDrizzleTable("Expense", { "columns": { "id": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Expense", "primaryKey": true } }, "description": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "description", "collection": "Expense", "primaryKey": false, "optional": false } }, "amount": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "amount", "collection": "Expense", "primaryKey": false, "optional": false } }, "date": { "type": "date", "schema": { "optional": false, "unique": false, "deprecated": false, "name": "date", "collection": "Expense" } }, "category": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "category", "collection": "Expense", "primaryKey": false, "optional": false } } }, "deprecated": false, "indexes": {} }, false);

const DELETE = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    await db.delete(Expense).where(eq(Expense.id, parseInt(id)));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete expense" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
