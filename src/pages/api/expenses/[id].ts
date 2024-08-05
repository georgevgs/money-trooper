import type { APIRoute } from 'astro';
import { db, Expense, eq } from 'astro:db';

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    await db.delete(Expense).where(eq(Expense.id, parseInt(id)));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete expense' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
