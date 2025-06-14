import { getSession, validateSession } from '../../utilities/session';
import { sql } from '@vercel/postgres';

async function handler() {
  try {
  const session = getSession();
    validateSession(session);

  try {
    const [profile] = await sql`
      SELECT 
        up.id,
        up.user_id,
        up.preferences,
        up.created_at,
        up.updated_at,
        au.name,
        au.email,
        au.image
      FROM user_profiles up
      LEFT JOIN auth_users au ON au.id = up.user_id
      WHERE up.user_id = ${session.user.id}
    `;

    if (!profile) {
      const [newProfile] = await sql`
        INSERT INTO user_profiles (user_id, preferences)
        VALUES (${session.user.id}, '{}')
        RETURNING *
      `;
        return Response.json({ profile: newProfile });
    }

      return Response.json({ profile });
    } catch (error) {
      console.error('Database error:', error);
      return Response.json({ error: "Failed to fetch user profile" }, { status: 500 });
    }
  } catch (error) {
    if (error.name === 'SessionError') {
      return Response.json({ error: error.message, code: error.code }, { status: 401 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  return handler(await request.json());
}