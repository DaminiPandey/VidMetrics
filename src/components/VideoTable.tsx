"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { formatNumber, formatDuration, timeAgo, engagementRate } from "@/lib/utils";
import type { VideoInfo } from "@/lib/youtube";

type SortKey = "viewCount" | "likeCount" | "commentCount" | "publishedAt" | "engagement";
type DateFilter = "all" | "week" | "month" | "3months";

export default function VideoTable({ videos }: { videos: VideoInfo[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("viewCount");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...videos];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((v) => v.title.toLowerCase().includes(q));
    }

    // Date filter
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

    // Sort
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

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-gray-600 ml-1">&#8597;</span>;
    return <span className="text-indigo-400 ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>;
  };

  // Determine top 3 by views for "trending" badges
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
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none w-64"
        />

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
        >
          <option value="all">All time</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="3months">Last 3 months</option>
        </select>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {filtered.length} video{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={handleExport}
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/80 text-left text-gray-400">
              <th className="px-4 py-3 font-medium w-[45%]">Video</th>
              <th
                className="px-4 py-3 font-medium cursor-pointer select-none whitespace-nowrap"
                onClick={() => toggleSort("viewCount")}
              >
                Views <SortIcon col="viewCount" />
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer select-none whitespace-nowrap"
                onClick={() => toggleSort("likeCount")}
              >
                Likes <SortIcon col="likeCount" />
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer select-none whitespace-nowrap"
                onClick={() => toggleSort("commentCount")}
              >
                Comments <SortIcon col="commentCount" />
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer select-none whitespace-nowrap"
                onClick={() => toggleSort("engagement")}
              >
                Eng. Rate <SortIcon col="engagement" />
              </th>
              <th
                className="px-4 py-3 font-medium cursor-pointer select-none whitespace-nowrap"
                onClick={() => toggleSort("publishedAt")}
              >
                Published <SortIcon col="publishedAt" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((video) => {
              const eng = engagementRate(video.viewCount, video.likeCount, video.commentCount);
              const isTrending = topIds.has(video.id);
              return (
                <tr
                  key={video.id}
                  className="border-b border-gray-800/50 transition hover:bg-gray-900/40"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`https://youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group"
                    >
                      <div className="relative shrink-0">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          width={120}
                          height={68}
                          className="rounded-lg object-cover"
                        />
                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          {formatDuration(video.duration)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white group-hover:text-indigo-400 transition line-clamp-2">
                          {video.title}
                        </p>
                        {isTrending && (
                          <span className="mt-1 inline-block rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-semibold text-orange-400">
                            TRENDING
                          </span>
                        )}
                      </div>
                    </a>
                  </td>
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    {formatNumber(video.viewCount)}
                  </td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {formatNumber(video.likeCount)}
                  </td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {formatNumber(video.commentCount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`font-medium ${
                        eng >= 5
                          ? "text-green-400"
                          : eng >= 2
                            ? "text-yellow-400"
                            : "text-gray-400"
                      }`}
                    >
                      {eng.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {timeAgo(video.publishedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No videos match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
