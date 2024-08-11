import type { APIRoute } from 'astro';
import { db, User, eq } from 'astro:db';
import { hashPassword } from '@/authUtils';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(User)
      .where(eq(User.username, username))
      .all();

    if (existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Username already exists' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Insert new user
    await db.insert(User).values({
      username,
      passwordHash,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Registration failed:', error);
    return new Response(JSON.stringify({ error: 'Registration failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
