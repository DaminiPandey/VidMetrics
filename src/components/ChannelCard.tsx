"use client";

import Image from "next/image";
import { GitCompareArrows } from "lucide-react";
import Logo from "@/components/Logo";
import { formatNumber } from "@/lib/utils";
import type { ChannelInfo } from "@/lib/youtube";

export default function ChannelCard({
  channel,
  onCompare,
  isComparing,
}: {
  channel: ChannelInfo;
  onCompare?: () => void;
  isComparing?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-4 sm:p-6 transition-colors hover:border-border-hover">
      <div className="flex flex-col gap-4 md:gap-5 md:flex-row md:items-center">
        {/* Channel Info */}
        <div className="flex flex-1 items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <Image
              src={channel.thumbnail}
              alt={channel.title}
              width={72}
              height={72}
              className="rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md bg-yt-red">
              <Logo size={12} />
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-text-primary">
              {channel.title}
            </h2>
            {channel.customUrl && (
              <p className="text-sm text-text-muted">{channel.customUrl}</p>
            )}
            <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
              {channel.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex w-full md:w-auto justify-between md:justify-start gap-3 md:gap-6 shrink-0">
          <Stat
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="Subscribers"
            value={formatNumber(parseInt(channel.subscriberCount))}
          />
          <Stat
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7" strokeLinecap="round" strokeLinejoin="round" />
                <rect width="15" height="14" x="1" y="5" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="Videos"
            value={formatNumber(parseInt(channel.videoCount))}
          />
          <Stat
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="Total Views"
            value={formatNumber(parseInt(channel.viewCount))}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex w-full md:w-auto shrink-0 items-center gap-2">
          {onCompare && (
            <button
              onClick={onCompare}
              className={`flex flex-1 md:flex-none items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isComparing
                  ? "bg-accent text-text-inverse"
                  : "border border-border text-text-secondary hover:border-accent hover:text-accent"
              }`}
            >
              <GitCompareArrows className="h-3.5 w-3.5" />
              Compare
            </button>
          )}
          <a
            href={`https://youtube.com/${channel.customUrl || `channel/${channel.id}`}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-full border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent-dim whitespace-nowrap"
          >
            View Channel
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="10" x2="21" y1="14" y2="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5 text-text-muted mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="font-mono text-lg font-bold text-text-primary">{value}</div>
    </div>
  );
}
