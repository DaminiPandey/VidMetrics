import { resolveChannelId } from "@/lib/youtube";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("resolveChannelId", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("extracts channel ID from /channel/UC... URL", async () => {
    const id = await resolveChannelId(
      "https://www.youtube.com/channel/UCq-Fj5jknLsUf-MWSy4_brA"
    );
    expect(id).toBe("UCq-Fj5jknLsUf-MWSy4_brA");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("resolves @handle format via API", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ items: [{ id: "UC_test_id" }] }),
    });

    const id = await resolveChannelId("@MrBeast");
    expect(id).toBe("UC_test_id");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toContain("forHandle=MrBeast");
  });

  it("resolves @handle in URL format", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ items: [{ id: "UC_handle_id" }] }),
    });

    const id = await resolveChannelId("https://youtube.com/@mkbhd");
    expect(id).toBe("UC_handle_id");
    expect(mockFetch.mock.calls[0][0]).toContain("forHandle=mkbhd");
  });

  it("returns null when channel not found", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ items: [] }),
    });
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ items: [] }),
    });

    const id = await resolveChannelId("nonexistent_channel_xyz");
    expect(id).toBeNull();
  });

  it("resolves direct channel ID starting with UC", async () => {
    const id = await resolveChannelId("UCq-Fj5jknLsUf-MWSy4_brA");
    expect(id).toBe("UCq-Fj5jknLsUf-MWSy4_brA");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("handles /c/customname URL via search", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        items: [{ snippet: { channelId: "UC_custom_id" } }],
      }),
    });

    const id = await resolveChannelId("https://youtube.com/c/pewdiepie");
    expect(id).toBe("UC_custom_id");
  });

  it("trims whitespace and trailing slashes", async () => {
    const id = await resolveChannelId(
      "  https://www.youtube.com/channel/UCq-Fj5jknLsUf-MWSy4_brA/  "
    );
    expect(id).toBe("UCq-Fj5jknLsUf-MWSy4_brA");
  });
});
