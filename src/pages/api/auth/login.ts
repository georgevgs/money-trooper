import type { APIRoute } from 'astro';
import { db, User, eq } from 'astro:db';
import { comparePassword, generateToken } from '@/authUtils';

export const POST: APIRoute = async ({ request }) => {
  const { username, password } = await request.json();

  try {
    const users = await db
      .select()
      .from(User)
      .where(eq(User.username, username))
      .all();

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = users[0];

    if (!(await comparePassword(password, user.passwordHash))) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = generateToken(user.id);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login failed:', error);
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
