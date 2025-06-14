import { getSession, validateSession } from '../../utilities/session';

async function handler({
  difficultyPreference,
  workoutFrequency,
  preferredWorkoutTimes,
  fitnessGoals,
  equipmentAvailability,
  healthConditions
}) {
  try {
  const session = getSession();
    validateSession(session);

  try {
    const userId = session.user.id;

    const existingPrefs = await sql`
      SELECT id FROM coach_preferences 
      WHERE user_id = ${userId}
    `;

    if (existingPrefs.length === 0) {
      const result = await sql`
        INSERT INTO coach_preferences (
          user_id,
          difficulty_preference,
          workout_frequency,
            preferred_workout_times,
            fitness_goals,
            equipment_availability,
            health_conditions
        ) VALUES (
          ${userId},
          ${difficultyPreference},
          ${workoutFrequency},
            ${preferredWorkoutTimes},
            ${fitnessGoals},
            ${equipmentAvailability},
            ${healthConditions}
        )
        RETURNING *
      `;
      return { preferences: result[0] };
    } else {
      const result = await sql`
        UPDATE coach_preferences
        SET 
          difficulty_preference = ${difficultyPreference},
            workout_frequency = ${workoutFrequency},
            preferred_workout_times = ${preferredWorkoutTimes},
            fitness_goals = ${fitnessGoals},
            equipment_availability = ${equipmentAvailability},
          health_conditions = ${healthConditions},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
        RETURNING *
      `;
      return { preferences: result[0] };
    }
  } catch (error) {
      console.error('Preferences error:', error);
      return { error: "Failed to update coach preferences" };
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