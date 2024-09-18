import React from "react";

interface ClassificationResult {
  label: string;
  score: number;
}

interface SentimentResultProps {
  result: ClassificationResult | null;
  ready: boolean | null;
  error: string | null;
}

export default function SentimentResult({
  result,
  ready,
  error,
}: SentimentResultProps) {
  if (error) {
    return <pre className="bg-red-100 text-red-500 p-2 rounded">{error}</pre>;
  }

  if (ready === null) return null;

  return (
    <pre className="bg-gray-100 p-2 rounded">
      {!ready
        ? "Loading sentiment analysis model..."
        : result
        ? `Sentiment: ${result.label} (Score: ${result.score.toFixed(2)})`
        : "Ready for classification"}
    </pre>
  );
}
