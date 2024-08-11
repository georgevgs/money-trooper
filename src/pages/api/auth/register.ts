import type { APIRoute } from 'astro';
import { db, User, eq } from 'astro:db';
import { hashPassword } from '@/authUtils';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.username, username))
      .get();

    if (existingUser) {
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

    // Generate a unique ID
    const id = crypto.randomUUID();

    // Insert new user
    const newUser = await db
      .insert(User)
      .values({
        id,
        username,
        passwordHash,
      })
      .returning()
      .get();

    return new Response(JSON.stringify({ success: true, userId: newUser.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Registration failed:', error);
    return new Response(
      JSON.stringify({
        error: 'Registration failed',
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
