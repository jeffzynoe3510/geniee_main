import { getSession, validateSession } from '../../utilities/session';

async function handler({ imageUrl, analysisResults, recommendations }) {
  try {
    const session = getSession();
    validateSession(session);

    try {
      const [savedAnalysis] = await sql`
        INSERT INTO skin_analysis_history (
          user_id,
          image_url,
          analysis_results,
          recommendations
        ) VALUES (
          ${session.user.id},
          ${imageUrl},
          ${analysisResults},
          ${recommendations}
        )
        RETURNING *
      `;

      return { analysis: savedAnalysis };
    } catch (error) {
      console.error('Database error:', error);
      return { error: "Failed to save skin analysis" };
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