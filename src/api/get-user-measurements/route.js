import { getSession, validateSession } from '../../utilities/session';

async function handler() {
  try {
  const session = getSession();
    validateSession(session);

  try {
      const measurements = await sql`
        SELECT measurements, fit_preferences, confidence_scores
      FROM user_measurements 
      WHERE user_id = ${session.user.id}
        ORDER BY created_at DESC
        LIMIT 1
      `;

      return { measurements: measurements[0] || null };
    } catch (error) {
      console.error('Database error:', error);
      return { error: "Failed to fetch user measurements" };
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