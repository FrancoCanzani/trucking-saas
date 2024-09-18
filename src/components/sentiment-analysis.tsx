"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import TweetForm from "./tweet-form";
import SentimentResult from "./sentiment-result";
import { Tweet as TweetType } from "react-tweet/api";
import { Tweet } from "react-tweet";

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

  const workerRef = useRef<Worker | null>(null);

  const classify = useCallback((text: string) => {
    if (workerRef.current) {
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
          break;
      }
    };

    const onError = (e: ErrorEvent) => {
      console.error("Worker error:", e);
      setError("An error occurred in the worker thread.");
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
    <div className="space-y-4">
      <TweetForm setTweetData={setTweetData} tweetData={tweetData} />
      <SentimentResult result={result} ready={ready} error={error} />
      {tweetData && <Tweet id={tweetData.id_str} />}
    </div>
  );
}
