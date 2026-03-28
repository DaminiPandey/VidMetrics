const API_KEY = process.env.YOUTUBE_API_KEY!;
const BASE = "https://www.googleapis.com/youtube/v3";

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  customUrl: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
}

/** Resolve a channel URL/handle/ID to a channel ID */
export async function resolveChannelId(input: string): Promise<string | null> {
  // Clean up the input
  let cleaned = input.trim().replace(/\/+$/, "");

  // Handle @handle format
  const handleMatch = cleaned.match(/@([\w.-]+)/);
  if (handleMatch) {
    const res = await fetch(
      `${BASE}/channels?part=id&forHandle=${handleMatch[1]}&key=${API_KEY}`
    );
    const data = await res.json();
    return data.items?.[0]?.id ?? null;
  }

  // Handle /channel/UC... format
  const channelIdMatch = cleaned.match(/\/channel\/(UC[\w-]+)/);
  if (channelIdMatch) return channelIdMatch[1];

  // Handle /c/customname or /user/username
  const customMatch = cleaned.match(/\/(c|user)\/([\w.-]+)/);
  if (customMatch) {
    const res = await fetch(
      `${BASE}/search?part=snippet&q=${customMatch[2]}&type=channel&maxResults=1&key=${API_KEY}`
    );
    const data = await res.json();
    return data.items?.[0]?.snippet?.channelId ?? null;
  }

  // Try as direct channel ID
  if (cleaned.startsWith("UC") && cleaned.length >= 20) {
    return cleaned;
  }

  // Try as handle without @
  const res = await fetch(
    `${BASE}/channels?part=id&forHandle=${cleaned}&key=${API_KEY}`
  );
  const data = await res.json();
  if (data.items?.[0]?.id) return data.items[0].id;

  // Try as search query
  const searchRes = await fetch(
    `${BASE}/search?part=snippet&q=${encodeURIComponent(cleaned)}&type=channel&maxResults=1&key=${API_KEY}`
  );
  const searchData = await searchRes.json();
  return searchData.items?.[0]?.snippet?.channelId ?? null;
}

/** Fetch channel details */
export async function getChannelInfo(
  channelId: string
): Promise<ChannelInfo | null> {
  const res = await fetch(
    `${BASE}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
  );
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;

  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default?.url,
    subscriberCount: item.statistics.subscriberCount,
    videoCount: item.statistics.videoCount,
    viewCount: item.statistics.viewCount,
    customUrl: item.snippet.customUrl ?? "",
  };
}

/** Fetch recent videos from a channel */
export async function getChannelVideos(
  channelId: string,
  maxResults = 50
): Promise<VideoInfo[]> {
  // Get video IDs from search
  const searchRes = await fetch(
    `${BASE}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${maxResults}&key=${API_KEY}`
  );
  const searchData = await searchRes.json();

  if (!searchData.items?.length) return [];

  const videoIds = searchData.items
    .map((item: { id: { videoId: string } }) => item.id.videoId)
    .join(",");

  // Get video stats
  const statsRes = await fetch(
    `${BASE}/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
  );
  const statsData = await statsRes.json();

  return (statsData.items ?? []).map(
    (item: {
      id: string;
      snippet: {
        title: string;
        thumbnails: { medium?: { url: string }; default: { url: string } };
        publishedAt: string;
      };
      statistics: {
        viewCount?: string;
        likeCount?: string;
        commentCount?: string;
      };
      contentDetails: { duration: string };
    }) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail:
        item.snippet.thumbnails.medium?.url ??
        item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: parseInt(item.statistics.viewCount ?? "0", 10),
      likeCount: parseInt(item.statistics.likeCount ?? "0", 10),
      commentCount: parseInt(item.statistics.commentCount ?? "0", 10),
      duration: item.contentDetails.duration,
    })
  );
}
