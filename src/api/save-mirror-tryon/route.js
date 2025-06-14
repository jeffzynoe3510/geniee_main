import { getSession, validateSession } from '../../utilities/session';

async function handler({
  outfitData,
  imageUrl,
  confidenceScore,
  feedback
}) {
  try {
    const session = getSession();
    validateSession(session);

    try {
      const [savedTryOn] = await sql`
        INSERT INTO mirror_tryon_history (
          user_id,
          outfit_data,
          image_url,
          confidence_score,
          feedback
        ) VALUES (
          ${session.user.id},
          ${outfitData},
          ${imageUrl},
          ${confidenceScore},
          ${feedback}
        )
        RETURNING *
      `;

      return { tryOn: savedTryOn };
    } catch (error) {
      console.error('Database error:', error);
      return { error: "Failed to save mirror try-on" };
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