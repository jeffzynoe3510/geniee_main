import { getSession, validateSession } from '../../utilities/session';

async function handler({ measurements, fitPreferences, confidenceScores }) {
  try {
  const session = getSession();
    validateSession(session);

    try {
      const [savedMeasurements] = await sql`
      INSERT INTO user_measurements (
        user_id,
        measurements,
        fit_preferences,
          confidence_scores
        ) VALUES (
        ${session.user.id},
        ${measurements},
        ${fitPreferences},
          ${confidenceScores}
        )
      RETURNING *
    `;

      return { measurements: savedMeasurements };
    } catch (error) {
      console.error('Database error:', error);
      return { error: "Failed to save measurements" };
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