"use client";

import { FormEvent, useState, Dispatch, SetStateAction } from "react";
import { Tweet as TweetType } from "react-tweet/api";
import extractTweetId from "@/lib/helpers/extract-tweet-id";
import fetchTweet from "@/lib/actions/fetch-tweet";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface TweetFormProps {
  tweetData: TweetType | null;
  setTweetData: Dispatch<SetStateAction<TweetType | null>>;
}
export default function TweetForm({ tweetData, setTweetData }: TweetFormProps) {
  const [tweet, setTweet] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const tweetId = extractTweetId(tweet);

    if (tweetId) {
      try {
        const data = await fetchTweet(tweetId);
        if (data.error) {
          setError(data.error);
        } else if (data.tweet) {
          setTweetData(data.tweet);
          setError(null);
        }
      } catch (err) {
        setError("An error occurred while fetching the tweet.");
      }
    } else {
      setError("Invalid tweet URL");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="tweetUrl" className="text-sm font-medium">
          Tweet URL
        </Label>
        <Input
          type="text"
          id="tweetUrl"
          name="tweetUrl"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          required
          placeholder="https://twitter.com/username/status/1234567890"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" variant={"outline"}>
        Analyze Tweet
      </Button>
    </form>
  );
}
