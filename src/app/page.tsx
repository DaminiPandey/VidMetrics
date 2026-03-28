"use client";

import { useState } from "react";
import ChannelCard from "@/components/ChannelCard";
import VideoTable from "@/components/VideoTable";
import PerformanceChart from "@/components/PerformanceChart";
import type { ChannelInfo, VideoInfo } from "@/lib/youtube";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [showChart, setShowChart] = useState(true);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setChannel(null);
    setVideos([]);

    try {
      const res = await fetch(
        `/api/channel?q=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setChannel(data.channel);
      setVideos(data.videos);
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* YouTube-inspired logo */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yt-red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="10,8 16,12 10,16" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              VidMetrics
            </span>
            <span className="hidden sm:inline-block rounded-full bg-accent-dim px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/DaminiPandey/VidMetrics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Hero + Search */}
      <section className="mx-auto max-w-[1280px] px-6 pt-16 pb-12 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            YouTube Competitor
            <span className="text-accent"> Analysis</span>
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Paste a channel URL and instantly see which videos are crushing it.
            Sort by views, engagement, and more.
          </p>

          {/* Search Bar */}
          <div className="mt-10 flex gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="Paste a YouTube channel URL, @handle, or name..."
                className="w-full rounded-xl border border-border bg-bg-surface py-3.5 pl-12 pr-5 text-text-primary placeholder-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent-glow"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="shrink-0 rounded-xl bg-accent px-8 py-3.5 font-semibold text-text-inverse transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-danger">{error}</p>
          )}
        </div>
      </section>

      {/* Results */}
      {channel && (
        <section className="mx-auto max-w-[1280px] space-y-8 px-6 pb-20">
          <ChannelCard channel={channel} />

          {/* Chart toggle */}
          {videos.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChart(!showChart)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  showChart
                    ? "bg-accent text-text-inverse"
                    : "border border-border text-text-secondary hover:border-border-hover hover:text-text-primary"
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m7 17 4-8 4 4 4-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {showChart ? "Hide Charts" : "Show Charts"}
              </button>
            </div>
          )}

          {showChart && videos.length > 0 && (
            <PerformanceChart videos={videos} />
          )}

          {videos.length > 0 && <VideoTable videos={videos} />}
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-text-muted">
        Built with Next.js, Tailwind CSS & YouTube Data API
      </footer>
    </div>
  );
}
