async function handler({ category, type } = {}) {
  let queryText = "SELECT * FROM outfits WHERE 1=1";
  const values = [];
  let paramCount = 1;

  if (category) {
    queryText += ` AND category = $${paramCount}`;
    values.push(category);
    paramCount++;
  }

  if (type) {
    queryText += ` AND type = $${paramCount}`;
    values.push(type);
    paramCount++;
  }

  queryText += " ORDER BY created_at DESC";

  try {
    const outfits = await sql(queryText, values);
    return { outfits };
  } catch (error) {
    return { error: "Failed to fetch outfits" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}