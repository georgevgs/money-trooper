import { d as db, E as Expense } from '../../chunks/_astro_db_CZz79lts.mjs';
export { renderers } from '../../renderers.mjs';

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
