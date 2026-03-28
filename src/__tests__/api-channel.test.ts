import { NextRequest } from "next/server";

// Mock the youtube module
jest.mock("@/lib/youtube", () => ({
  resolveChannelId: jest.fn(),
  getChannelInfo: jest.fn(),
  getChannelVideos: jest.fn(),
}));

import { GET } from "@/app/api/channel/route";
import { resolveChannelId, getChannelInfo, getChannelVideos } from "@/lib/youtube";

const mockResolveChannelId = resolveChannelId as jest.MockedFunction<typeof resolveChannelId>;
const mockGetChannelInfo = getChannelInfo as jest.MockedFunction<typeof getChannelInfo>;
const mockGetChannelVideos = getChannelVideos as jest.MockedFunction<typeof getChannelVideos>;

function createRequest(query: string | null): NextRequest {
  const url = query
    ? `http://localhost:3000/api/channel?q=${encodeURIComponent(query)}`
    : "http://localhost:3000/api/channel";
  return new NextRequest(url);
}

describe("GET /api/channel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when no query is provided", async () => {
    const res = await GET(createRequest(null));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("returns 404 when channel is not found", async () => {
    mockResolveChannelId.mockResolvedValue(null);

    const res = await GET(createRequest("nonexistent_channel"));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain("Could not find");
  });

  it("returns 404 when channel info fetch fails", async () => {
    mockResolveChannelId.mockResolvedValue("UC_test");
    mockGetChannelInfo.mockResolvedValue(null);
    mockGetChannelVideos.mockResolvedValue([]);

    const res = await GET(createRequest("test_channel"));
    expect(res.status).toBe(404);
  });

  it("returns channel and videos on success", async () => {
    const mockChannel = {
      id: "UC_test",
      title: "Test Channel",
      description: "A test channel",
      thumbnail: "https://example.com/thumb.jpg",
      subscriberCount: "1000",
      videoCount: "50",
      viewCount: "100000",
      customUrl: "@test",
    };
    const mockVideos = [
      {
        id: "vid1",
        title: "Test Video",
        thumbnail: "https://example.com/vid.jpg",
        publishedAt: "2024-01-01T00:00:00Z",
        viewCount: 5000,
        likeCount: 200,
        commentCount: 50,
        duration: "PT5M30S",
      },
    ];

    mockResolveChannelId.mockResolvedValue("UC_test");
    mockGetChannelInfo.mockResolvedValue(mockChannel);
    mockGetChannelVideos.mockResolvedValue(mockVideos);

    const res = await GET(createRequest("@test"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.channel).toEqual(mockChannel);
    expect(body.videos).toEqual(mockVideos);
  });

  it("returns 500 on unexpected error", async () => {
    mockResolveChannelId.mockRejectedValue(new Error("API quota exceeded"));

    const res = await GET(createRequest("test"));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toContain("Something went wrong");
  });
});
