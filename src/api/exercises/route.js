async function handler({ category, difficulty, equipment }) {
  let queryText = "SELECT * FROM exercises WHERE 1=1";
  const values = [];
  let paramCount = 0;

  if (category) {
    paramCount++;
    queryText += ` AND category = $${paramCount}`;
    values.push(category);
  }

  if (difficulty) {
    paramCount++;
    queryText += ` AND difficulty_level = $${paramCount}`;
    values.push(difficulty);
  }

  if (equipment) {
    paramCount++;
    queryText += ` AND $${paramCount} = ANY(equipment_needed)`;
    values.push(equipment);
  }

  queryText += " ORDER BY name ASC";

  try {
    const exercises = await sql(queryText, values);
    return { exercises };
  } catch (error) {
    return { error: "Failed to fetch exercises" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}