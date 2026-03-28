"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import type { VideoInfo } from "@/lib/youtube";

export default function PerformanceChart({ videos }: { videos: VideoInfo[] }) {
  // Show top 10 videos by views
  const data = [...videos]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10)
    .map((v) => ({
      name: v.title.length > 30 ? v.title.slice(0, 30) + "..." : v.title,
      views: v.viewCount,
      likes: v.likeCount,
      comments: v.commentCount,
    }));

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Top 10 Videos by Views
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              type="number"
              tickFormatter={(v) => formatNumber(v)}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={180}
              stroke="#6b7280"
              fontSize={11}
              tick={{ fill: "#9ca3af" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "12px",
                fontSize: "13px",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => formatNumber(Number(value))}
              labelStyle={{ color: "#e5e7eb" }}
            />
            <Bar dataKey="views" fill="#6366f1" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
