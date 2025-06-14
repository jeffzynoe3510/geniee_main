import { getSession, validateSession } from '../../utilities/session';

async function handler() {
  try {
  const session = getSession();
    validateSession(session);

  try {
    const history = await sql`
        SELECT *
        FROM virtual_tryon_history
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
        LIMIT 10
    `;

      return { history };
    } catch (error) {
      console.error('Database error:', error);
      return { error: "Failed to fetch virtual try-on history" };
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