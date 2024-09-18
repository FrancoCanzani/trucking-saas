import React from "react";
import { ThumbsUp, ThumbsDown, Meh } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (ready === null || !ready) return null;

  if (!result) {
    return (
      <Alert>
        <AlertTitle>Ready</AlertTitle>
        <AlertDescription>Waiting for tweet to analyze</AlertDescription>
      </Alert>
    );
  }

  const getResultColor = (label: string) => {
    switch (label.toLowerCase()) {
      case "positive":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
      case "negative":
        return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300";
      default:
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300";
    }
  };

  const getResultIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "positive":
        return <ThumbsUp className="w-6 h-6" />;
      case "negative":
        return <ThumbsDown className="w-6 h-6" />;
      default:
        return <Meh className="w-6 h-6" />;
    }
  };

  const colorClass = getResultColor(result.label);

  return (
    <Alert className={colorClass}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          {getResultIcon(result.label)}
          <AlertTitle className="text-2xl font-bold capitalize">
            {result.label}
          </AlertTitle>
        </div>
        <div className="text-right">
          <AlertDescription className="text-sm font-medium">
            Confidence
          </AlertDescription>
          <AlertTitle className="text-3xl font-bold">
            {(result.score * 100).toFixed(0)}%
          </AlertTitle>
        </div>
      </div>
    </Alert>
  );
}
