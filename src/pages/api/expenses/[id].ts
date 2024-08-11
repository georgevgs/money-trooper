import type { APIRoute } from 'astro';
import { db, Expense, eq, and } from 'astro:db';
import { verifyToken } from '@/authUtils';

const authenticateUser = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    throw new Error('Invalid token');
  }
  return payload.userId;
};

export const DELETE: APIRoute = async ({ request, params }) => {
  try {
    const userId = await authenticateUser(request);
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const expenseId = parseInt(id);

    // Check if the expense belongs to the authenticated user
    const expense = await db
      .select()
      .from(Expense)
      .where(and(eq(Expense.id, expenseId), eq(Expense.userId, userId)))
      .get();

    if (!expense) {
      return new Response(
        JSON.stringify({ error: 'Expense not found or not authorized' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    await db.delete(Expense).where(eq(Expense.id, expenseId));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to delete expense:', error);
    if (
      error instanceof Error &&
      (error.message === 'No token provided' ||
        error.message === 'Invalid token')
    ) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return new Response(JSON.stringify({ error: 'Failed to delete expense' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
