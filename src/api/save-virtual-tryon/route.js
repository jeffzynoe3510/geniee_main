import { getSession, validateSession } from '../../utilities/session';

async function handler({ outfitData, imageUrl }) {
  try {
    const session = getSession();
    validateSession(session);

    try {
      const [savedTryOn] = await sql`
        INSERT INTO virtual_tryon_history (
          user_id,
          outfit_data,
          image_url
        ) VALUES (
          ${session.user.id},
          ${outfitData},
          ${imageUrl}
        )
        RETURNING *
      `;

      return { tryOn: savedTryOn };
    } catch (error) {
      console.error('Database error:', error);
      return { error: "Failed to save virtual try-on" };
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