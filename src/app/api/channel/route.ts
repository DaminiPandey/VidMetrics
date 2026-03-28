import { NextRequest, NextResponse } from "next/server";
import {
  resolveChannelId,
  getChannelInfo,
  getChannelVideos,
  QuotaExceededError,
} from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("q");

  if (!input) {
    return NextResponse.json(
      { error: "Missing channel URL or name" },
      { status: 400 }
    );
  }

  try {
    const channelId = await resolveChannelId(input);
    if (!channelId) {
      return NextResponse.json(
        { error: "Could not find that YouTube channel. Try a different URL or channel name." },
        { status: 404 }
      );
    }

    const [channel, videos] = await Promise.all([
      getChannelInfo(channelId),
      getChannelVideos(channelId),
    ]);

    if (!channel) {
      return NextResponse.json(
        { error: "Could not fetch channel details." },
        { status: 404 }
      );
    }

    return NextResponse.json({ channel, videos });
  } catch (err) {
    if (err instanceof QuotaExceededError) {
      return NextResponse.json(
        { error: "YouTube API daily quota exceeded. Please try again tomorrow or use a different API key." },
        { status: 429 }
      );
    }
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
