import { normalizeDatabaseUrl, createLocalDatabaseClient, asDrizzleTable } from '@astrojs/db/runtime';
import '@astrojs/db/dist/runtime/virtual.js';
export { renderers } from '../../renderers.mjs';

const dbUrl = normalizeDatabaseUrl(process.env.ASTRO_DATABASE_FILE, "file:///Users/gvagdas/Documents/Dev/money-trooper/.astro/content.db");
const db = createLocalDatabaseClient({ dbUrl });
const Expense = asDrizzleTable("Expense", { "columns": { "id": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Expense", "primaryKey": true } }, "description": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "description", "collection": "Expense", "primaryKey": false, "optional": false } }, "amount": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "amount", "collection": "Expense", "primaryKey": false, "optional": false } }, "date": { "type": "date", "schema": { "optional": false, "unique": false, "deprecated": false, "name": "date", "collection": "Expense" } }, "category": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "category", "collection": "Expense", "primaryKey": false, "optional": false } } }, "deprecated": false, "indexes": {} }, false);

const GET = async () => {
  const expenses = await db.select().from(Expense).all();
  return new Response(JSON.stringify(expenses), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { description, amount, category, date } = body;
    await db.insert(Expense).values({
      description,
      amount,
      category,
      date: new Date(date)
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Failed to add expense:", err);
    return new Response(JSON.stringify({ error: "Failed to add expense" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
