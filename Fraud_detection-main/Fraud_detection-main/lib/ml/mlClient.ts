export interface MLPredictionResponse {
  fraud_probability: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
}

export async function getMLPrediction(features: Record<string, number>) {
  const response = await fetch("http://127.0.0.1:8001/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(features),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ML service error: ${error}`);
  }

  return (await response.json()) as MLPredictionResponse;
}