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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">
              V
            </div>
            <span className="text-lg font-semibold">VidMetrics</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Hero + Search */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          YouTube Competitor
          <span className="text-indigo-500"> Analysis</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Paste a channel URL and instantly see which videos are crushing it.
          Sort by views, engagement, and more.
        </p>

        <div className="mt-8 mx-auto flex max-w-2xl gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="Paste a YouTube channel URL, @handle, or name..."
            className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-5 py-3.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-8 py-3.5 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
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
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}
      </section>

      {/* Results */}
      {channel && (
        <section className="mx-auto max-w-7xl px-6 pb-20 space-y-8">
          <ChannelCard channel={channel} />

          {/* Toggle chart */}
          {videos.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChart(!showChart)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  showChart
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {showChart ? "Hide Chart" : "Show Chart"}
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
      <footer className="border-t border-gray-800/50 py-6 text-center text-sm text-gray-500">
        Built with Next.js, Tailwind CSS & YouTube Data API
      </footer>
    </div>
  );
}
