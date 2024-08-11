import type { APIRoute } from 'astro';
import { db, Expense, User, eq } from 'astro:db';
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

export const GET: APIRoute = async ({ request }) => {
  try {
    const userId = await authenticateUser(request);
    const expenses = await db
      .select()
      .from(Expense)
      .where(eq(Expense.userId, userId))
      .all();
    return new Response(JSON.stringify(expenses), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const userId = await authenticateUser(request);
    const body = await request.json();
    const { description, amount, category, date } = body;

    await db.insert(Expense).values({
      description,
      amount,
      category,
      date: new Date(date),
      userId,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to add expense:', error);
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
    return new Response(JSON.stringify({ error: 'Failed to add expense' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
