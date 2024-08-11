import type { APIRoute } from 'astro';
import { db, User, eq } from 'astro:db';
import { comparePassword, generateToken } from '@/authUtils';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    const { username, password } = body;

    if (!username || !password) {
      console.error('Missing username or password');
      return new Response(
        JSON.stringify({ error: 'Username and password are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    console.log('Querying database for username:', username);

    const user = await db
      .select()
      .from(User)
      .where(eq(User.username, username))
      .get();

    console.log('Database query result:', user);

    if (!user) {
      console.log('User not found for username:', username);
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!(await comparePassword(password, user.passwordHash))) {
      console.log('Invalid password for username:', username);
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = generateToken(user.id);

    return new Response(
      JSON.stringify({ token, userId: user.id, username: user.username }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Login failed:', error);
    return new Response(
      JSON.stringify({
        error: 'Login failed',
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
