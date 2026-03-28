"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { formatNumber, formatDuration, timeAgo, engagementRate } from "@/lib/utils";
import type { VideoInfo } from "@/lib/youtube";

type SortKey = "viewCount" | "likeCount" | "commentCount" | "publishedAt" | "engagement";
type DateFilter = "all" | "week" | "month" | "3months";

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "week", label: "7 days" },
  { value: "month", label: "30 days" },
  { value: "3months", label: "3 months" },
];

export default function VideoTable({ videos }: { videos: VideoInfo[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("viewCount");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let list = [...videos];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((v) => v.title.toLowerCase().includes(q));
    }

    if (dateFilter !== "all") {
      const now = Date.now();
      const cutoffs: Record<string, number> = {
        week: 7 * 86400000,
        month: 30 * 86400000,
        "3months": 90 * 86400000,
      };
      const cutoff = now - cutoffs[dateFilter];
      list = list.filter((v) => new Date(v.publishedAt).getTime() >= cutoff);
    }

    list.sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortKey === "publishedAt") {
        aVal = new Date(a.publishedAt).getTime();
        bVal = new Date(b.publishedAt).getTime();
      } else if (sortKey === "engagement") {
        aVal = engagementRate(a.viewCount, a.likeCount, a.commentCount);
        bVal = engagementRate(b.viewCount, b.likeCount, b.commentCount);
      } else {
        aVal = a[sortKey];
        bVal = b[sortKey];
      }
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });

    return list;
  }, [videos, sortKey, sortDir, dateFilter, search]);

  // Reset page when filters change
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((paginatedPage - 1) * perPage, paginatedPage * perPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="ml-1 text-text-muted">&#8597;</span>;
    return <span className="ml-1 text-accent">{sortDir === "desc" ? "↓" : "↑"}</span>;
  };

  const topIds = useMemo(() => {
    const sorted = [...videos].sort((a, b) => b.viewCount - a.viewCount);
    return new Set(sorted.slice(0, 3).map((v) => v.id));
  }, [videos]);

  const handleExport = () => {
    const header = "Title,Views,Likes,Comments,Engagement Rate,Published,Duration,URL\n";
    const rows = filtered
      .map(
        (v) =>
          `"${v.title.replace(/"/g, '""')}",${v.viewCount},${v.likeCount},${v.commentCount},${engagementRate(v.viewCount, v.likeCount, v.commentCount).toFixed(2)}%,${v.publishedAt},${formatDuration(v.duration)},https://youtube.com/watch?v=${v.id}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vidmetrics-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Controls */}
      <div className="mb-5 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-auto">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
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
            placeholder="Search videos..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full sm:w-56 rounded-lg border border-border bg-bg-surface py-2 pl-9 pr-4 text-sm text-text-primary placeholder-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent-glow"
          />
        </div>

        {/* Date Filter Pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {DATE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setDateFilter(f.value); setPage(1); }}
              className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                dateFilter === f.value
                  ? "bg-accent text-text-inverse"
                  : "border border-border text-text-secondary hover:border-border-hover hover:text-text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex sm:ml-auto items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-sm text-text-muted">
            {filtered.length} video{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" x2="12" y1="15" y2="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            No videos match your filters.
          </div>
        )}
        {paginated.map((video) => {
          const eng = engagementRate(video.viewCount, video.likeCount, video.commentCount);
          const isTrending = topIds.has(video.id);
          return (
            <a
              key={video.id}
              href={`https://youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-border bg-bg-surface p-3 transition-colors hover:border-border-hover"
            >
              <div className="flex gap-3">
                <div className="relative shrink-0">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={100}
                    height={56}
                    className="rounded-lg object-cover"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-semibold text-white font-mono">
                    {formatDuration(video.duration)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary line-clamp-2">{video.title}</p>
                  {isTrending && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent-dim px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent">
                      Trending
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="font-mono text-xs font-semibold text-text-primary">{formatNumber(video.viewCount)}</p>
                  <p className="text-[10px] text-text-muted">Views</p>
                </div>
                <div>
                  <p className="font-mono text-xs font-semibold text-text-secondary">{formatNumber(video.likeCount)}</p>
                  <p className="text-[10px] text-text-muted">Likes</p>
                </div>
                <div>
                  <p className="font-mono text-xs font-semibold text-text-secondary">{formatNumber(video.commentCount)}</p>
                  <p className="text-[10px] text-text-muted">Comments</p>
                </div>
                <div>
                  <p className={`font-mono text-xs font-semibold ${
                    eng >= 5 ? "text-blue-400" : eng >= 2 ? "text-amber-400" : "text-rose-400"
                  }`}>{eng.toFixed(1)}%</p>
                  <p className="text-[10px] text-text-muted">Eng.</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-surface text-left">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted w-[40%]">
                Video
              </th>
              <th
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted"                onClick={() => toggleSort("viewCount")}
              >
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Views <SortIcon col="viewCount" />
                </span>
              </th>
              <th
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted"                onClick={() => toggleSort("likeCount")}
              >
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M7 10v12" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Likes <SortIcon col="likeCount" />
                </span>
              </th>
              <th
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted"                onClick={() => toggleSort("commentCount")}
              >
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Comments <SortIcon col="commentCount" />
                </span>
              </th>
              <th
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted"                onClick={() => toggleSort("engagement")}
              >
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Eng. Rate <SortIcon col="engagement" />
                </span>
              </th>
              <th
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted"                onClick={() => toggleSort("publishedAt")}
              >
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Published <SortIcon col="publishedAt" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((video) => {
              const eng = engagementRate(video.viewCount, video.likeCount, video.commentCount);
              const isTrending = topIds.has(video.id);
              return (
                <tr
                  key={video.id}
                  className="border-b border-border/50 transition-colors hover:bg-bg-surface-hover"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`https://youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3"
                    >
                      <div className="relative shrink-0">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          width={120}
                          height={68}
                          className="rounded-lg object-cover"
                        />
                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white font-mono">
                          {formatDuration(video.duration)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-medium text-text-primary transition-colors group-hover:text-accent">
                          {video.title}
                        </p>
                        {isTrending && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent-dim px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round" />
                              <polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Trending
                          </span>
                        )}
                      </div>
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-text-primary">
                    {formatNumber(video.viewCount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-text-secondary">
                    {formatNumber(video.likeCount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-text-secondary">
                    {formatNumber(video.commentCount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-sm font-medium ${
                        eng >= 5
                          ? "bg-blue-500/15 text-blue-400"
                          : eng >= 2
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {eng.toFixed(2)}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                    {timeAgo(video.publishedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            No videos match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs sm:text-sm text-text-muted">
            {paginatedPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={paginatedPage <= 1}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    p === paginatedPage
                      ? "bg-accent text-text-inverse"
                      : "border border-border text-text-muted hover:border-border-hover hover:text-text-primary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={paginatedPage >= totalPages}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
