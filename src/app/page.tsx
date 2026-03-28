"use client";

import { useState } from "react";
import ChannelCard from "@/components/ChannelCard";
import VideoTable from "@/components/VideoTable";
import PerformanceChart from "@/components/PerformanceChart";
import CompareChannels from "@/components/CompareChannels";
import type { ChannelInfo, VideoInfo } from "@/lib/youtube";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [showChart, setShowChart] = useState(true);
  const [showCompare, setShowCompare] = useState(false);

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
    <div className="flex min-h-screen flex-col bg-bg-base">
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-bg-base/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yt-red shadow-[0_0_12px_rgba(255,0,0,0.3)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="10,8 16,12 10,16" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              VidMetrics
            </span>
            <span className="hidden sm:inline-block rounded-full bg-accent-dim border border-accent/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
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
      <section
        className={`relative mx-auto w-full max-w-[1280px] px-6 text-center ${
          !channel
            ? "flex flex-1 flex-col items-center justify-center py-12"
            : "pt-16 pb-12"
        }`}
      >
        {/* Background Effects — only on landing */}
        {!channel && (
          <>
            {/* Radial gradient glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* Teal glow — top center */}
              <div className="absolute top-[-20%] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]" />
              {/* Red glow — offset right */}
              <div className="absolute top-[-10%] left-[60%] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-yt-red/[0.04] blur-[100px]" />
            </div>

            {/* Dot grid pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </>
        )}

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Eyebrow badge */}
          {!channel && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface/50 px-4 py-1.5 text-sm text-text-secondary backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Analyze any YouTube channel instantly
            </div>
          )}

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            See What&#39;s Winning
            <br />
            <span className="bg-gradient-to-r from-accent via-teal-300 to-accent bg-clip-text text-transparent">
              on YouTube
            </span>
          </h1>
          <p className="mt-5 text-lg text-text-secondary sm:text-xl">
            Drop a channel link. Get instant insights on their top-performing content.
          </p>

          {/* Search Bar */}
          <div className="mt-10 flex gap-3">
            <div className="group relative flex-1">
              {/* Glow effect behind input */}
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-accent/20 via-accent/5 to-yt-red/10 opacity-0 blur transition-opacity group-focus-within:opacity-100" />
              <div className="relative">
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
                  className="w-full rounded-xl border border-border bg-bg-surface py-3.5 pl-12 pr-5 text-text-primary placeholder-text-muted transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent-glow"
                />
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="shrink-0 rounded-xl bg-accent px-8 py-3.5 font-semibold text-text-inverse shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
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

          {/* Trust indicators */}
          {!channel && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Views &amp; engagement metrics
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m7 17 4-8 4 4 4-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Performance charts
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" x2="12" y1="15" y2="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                CSV export
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {channel && (
        <section className="mx-auto max-w-[1280px] space-y-8 px-6 pb-20">
          <ChannelCard
            channel={channel}
            onCompare={() => setShowCompare(!showCompare)}
            isComparing={showCompare}
          />

          {/* Channel Comparison — right after channel card */}
          {showCompare && videos.length > 0 && (
            <CompareChannels primaryChannel={channel} primaryVideos={videos} />
          )}

          {/* Action buttons */}
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
      <footer className="mt-auto border-t border-border/50 py-6 text-center text-sm text-text-muted">
        Built with Next.js, Tailwind CSS & YouTube Data API
      </footer>
    </div>
  );
}
