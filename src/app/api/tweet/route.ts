import { NextRequest, NextResponse } from "next/server";
import { getTweet } from "react-tweet/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tweetId = searchParams.get("tweetId");

  if (!tweetId) {
    return NextResponse.json(
      { error: "Tweet ID is required" },
      { status: 400 }
    );
  }

  try {
    const tweet = await getTweet(tweetId);

    if (!tweet) {
      return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
    }

    return NextResponse.json({ tweet });
  } catch (error) {
    console.error("Error fetching tweet:", error);
    return NextResponse.json(
      { error: "Failed to fetch tweet" },
      { status: 500 }
    );
  }
}
