"use client";

import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import type { ChannelInfo } from "@/lib/youtube";

export default function ChannelCard({ channel }: { channel: ChannelInfo }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
      <Image
        src={channel.thumbnail}
        alt={channel.title}
        width={80}
        height={80}
        className="rounded-full"
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold truncate">{channel.title}</h2>
        {channel.customUrl && (
          <p className="text-sm text-gray-400">{channel.customUrl}</p>
        )}
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {channel.description}
        </p>
      </div>
      <div className="flex gap-6 text-center shrink-0">
        <Stat label="Subscribers" value={formatNumber(parseInt(channel.subscriberCount))} />
        <Stat label="Videos" value={formatNumber(parseInt(channel.videoCount))} />
        <Stat label="Total Views" value={formatNumber(parseInt(channel.viewCount))} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
