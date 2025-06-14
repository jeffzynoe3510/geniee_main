import { getSession, validateSession } from '../../utilities/session';

async function handler({ preferences }) {
  try {
  const session = getSession();
    validateSession(session);

    try {
      const [updatedProfile] = await sql`
        UPDATE user_profiles 
        SET 
          preferences = ${preferences},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${session.user.id}
        RETURNING *
      `;

      return { profile: updatedProfile };
    } catch (error) {
      console.error('Database error:', error);
      return { error: "Failed to update preferences" };
    }
  } catch (error) {
    if (error.name === 'SessionError') {
      return { error: error.message, code: error.code };
    }
    return { error: "Internal server error" };
  }
}

export async function POST(request) {
  return handler(await request.json());
}