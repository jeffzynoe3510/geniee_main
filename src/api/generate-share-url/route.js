import { getSession, validateSession } from '../../utilities/session';

async function handler({ tryOnId }) {
  try {
    const session = getSession();
    validateSession(session);

    const tryOnRecord = await sql`
      SELECT * FROM virtual_tryon_history 
      WHERE id = ${tryOnId} AND user_id = ${session.user.id}
    `;

    if (!tryOnRecord?.length) {
      return { error: "Try-on record not found" };
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/virtual-tryon/${tryOnId}`;

    await sql`
      UPDATE virtual_tryon_history 
      SET share_url = ${shareUrl}, is_public = true 
      WHERE id = ${tryOnId} AND user_id = ${session.user.id}
    `;

    return { shareUrl };
  } catch (error) {
    if (error.name === 'SessionError') {
      return { error: error.message, code: error.code };
    }
    return { error: "Failed to generate share URL" };
  }
}

export async function POST(request) {
  return handler(await request.json());
}