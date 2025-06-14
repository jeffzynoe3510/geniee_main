import { getSession, validateSession } from '../../utilities/session';

async function handler({
  exerciseId,
  duration,
  sets,
  reps,
  weight,
  notes
}) {
  try {
  const session = getSession();
    validateSession(session);

  try {
      const [savedWorkout] = await sql`
        INSERT INTO workout_history (
          user_id,
          exercise_id,
          duration,
          sets,
          reps,
          weight,
          notes
        ) VALUES (
          ${session.user.id},
          ${exerciseId},
          ${duration},
          ${sets},
          ${reps},
          ${weight},
          ${notes}
        )
      RETURNING *
    `;

      return { workout: savedWorkout };
    } catch (error) {
      console.error('Database error:', error);
      return { error: "Failed to save workout" };
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