import { getSession, validateSession } from '../../utilities/session';

async function handler({ outfitId }) {
  try {
    const session = getSession();
    validateSession(session);

    const measurements = await sql`
      SELECT measurements, fit_preferences 
      FROM user_measurements 
      WHERE user_id = ${session.user.id}
    `;

    if (!measurements.length) {
      return { error: "User measurements not found" };
    }

    const outfit = await sql`
      SELECT sizing_data, detailed_measurements 
      FROM outfits 
      WHERE id = ${outfitId}
    `;

    if (!outfit.length) {
      return { error: "Outfit not found" };
    }

    const userMeasurements = measurements[0].measurements;
    const userPreferences = measurements[0].fit_preferences;
    const outfitSizing = outfit[0].sizing_data;
    const outfitMeasurements = outfit[0].detailed_measurements;

    const fitScores = {};
    const fitIssues = [];
    const recommendations = [];

    for (const [key, value] of Object.entries(outfitMeasurements)) {
      if (userMeasurements[key]) {
        const difference = Math.abs(userMeasurements[key] - value);
        const tolerance = userPreferences?.tolerances?.[key] || 2;
        const score = Math.max(0, 100 - (difference / tolerance) * 100);

        fitScores[key] = score;

        if (score < 70) {
          fitIssues.push({
            area: key,
            issue: userMeasurements[key] > value ? "too tight" : "too loose",
            difference: difference.toFixed(1),
          });
        }
      }
    }

    const overallFitScore =
      Object.values(fitScores).reduce((a, b) => a + b, 0) /
      Object.values(fitScores).length;

    if (overallFitScore < 70) {
      recommendations.push("Consider a different size");
    }

    if (fitIssues.length > 2) {
      recommendations.push("This style may not be optimal for your body type");
    }

    const suggestedSize = Object.entries(outfitSizing).reduce(
      (best, [size, measurements]) => {
        const sizeFit = Object.entries(measurements).reduce(
          (total, [key, value]) => {
            if (userMeasurements[key]) {
              return total + Math.abs(userMeasurements[key] - value);
            }
            return total;
          },
          0
        );

        return sizeFit < best.fit ? { size, fit: sizeFit } : best;
      },
      { size: null, fit: Infinity }
    ).size;

    return {
      overallFitScore: Math.round(overallFitScore),
      fitScores,
      fitIssues,
      recommendations,
      suggestedSize,
      userMeasurements,
      outfitMeasurements,
    };
  } catch (error) {
    if (error.name === 'SessionError') {
      return { error: error.message, code: error.code };
    }
    return { error: "Failed to analyze fit" };
  }
}

export async function POST(request) {
  return handler(await request.json());
}