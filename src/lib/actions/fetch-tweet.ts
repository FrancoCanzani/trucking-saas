"use server";

import { getTweet, Tweet } from "react-tweet/api";

export default async function fetchTweet(
  tweetId: string
): Promise<{ tweet?: Tweet; error?: string }> {
  try {
    const tweet = await getTweet(tweetId);

    if (!tweet) {
      return { error: "Tweet not found" };
    }
    return { tweet };
  } catch (error) {
    console.error("Error fetching tweet:", error);
    return { error: "Failed to fetch tweet" };
  }
}
