"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import TweetForm from "./tweet-form";
import SentimentResult from "./sentiment-result";
import { Tweet as TweetType } from "react-tweet/api";
import { Tweet } from "react-tweet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type WorkerStatus = "initiate" | "ready" | "complete";

interface WorkerMessage {
  status: WorkerStatus;
  output?: any[];
}

interface ClassificationResult {
  label: string;
  score: number;
}

export default function SentimentAnalysisContainer() {
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [ready, setReady] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tweetData, setTweetData] = useState<TweetType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  console.log(tweetData);

  const workerRef = useRef<Worker | null>(null);

  const classify = useCallback((text: string) => {
    if (workerRef.current) {
      setIsAnalyzing(true);
      workerRef.current.postMessage({ text });
    }
  }, []);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("@/app/worker.js", import.meta.url),
        {
          type: "module",
        }
      );
    }

    const onMessageReceived = (e: MessageEvent<WorkerMessage>) => {
      switch (e.data.status) {
        case "initiate":
          setReady(false);
          break;
        case "ready":
          setReady(true);
          setError(null);
          break;
        case "complete":
          if (e.data.output && e.data.output.length > 0) {
            setResult(e.data.output[0] as ClassificationResult);
          }
          setIsAnalyzing(false);
          break;
      }
    };

    const onError = (e: ErrorEvent) => {
      console.error("Worker error:", e);
      setError("An error occurred in the worker thread.");
      setIsAnalyzing(false);
    };

    workerRef.current.addEventListener("message", onMessageReceived);
    workerRef.current.addEventListener("error", onError);

    return () => {
      workerRef.current?.removeEventListener("message", onMessageReceived);
      workerRef.current?.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    if (tweetData && tweetData.text) {
      classify(tweetData.text);
    }
  }, [tweetData, classify]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Tweet Sentiment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TweetForm setTweetData={setTweetData} tweetData={tweetData} />
        {isAnalyzing ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Analyzing sentiment...</p>
          </div>
        ) : (
          <SentimentResult result={result} ready={ready} error={error} />
        )}
        {tweetData && (
          <div className="w-full mx-auto">
            <div className="tweet-wrapper [&>div]:w-full [&>div]:max-w-full [&_.react-tweet]:w-full [&_.react-tweet]:max-w-full">
              <Tweet id={tweetData.id_str} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
