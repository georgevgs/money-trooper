import type { APIRoute } from 'astro';
import { db, Expense } from 'astro:db';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ test: 'This is a test response' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { description, amount, category, date } = body;

    await db.insert(Expense).values({
      description,
      amount,
      category,
      date: new Date(date),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Failed to add expense:', err);
    return new Response(JSON.stringify({ error: 'Failed to add expense' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
