"use client";

import Link from "next/link";
import { BuildInfo } from "@/types";

interface BuildHistoryProps {
  builds: BuildInfo[];
  isLoading: boolean;
}

export default function BuildHistory({ builds, isLoading }: BuildHistoryProps) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Build History
          </h2>
          <p className="text-sm text-muted">Recent builds from Codemagic</p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </div>
        )}
      </div>

      {builds.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card-border">
            <svg
              className="h-6 w-6 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>
          <p className="text-sm text-muted">No builds found</p>
          <p className="text-xs text-muted/60">
            Trigger a build to see it appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {builds.map((build) => (
            <BuildRow key={build._id} build={build} />
          ))}
        </div>
      )}
    </div>
  );
}

function BuildRow({ build }: { build: BuildInfo }) {
  const statusConfig: Record<
    string,
    { icon: React.ReactNode; color: string; bg: string }
  > = {
    success: {
      icon: <CheckIcon />,
      color: "text-success",
      bg: "bg-success/10",
    },
    failed: {
      icon: <XIcon />,
      color: "text-danger",
      bg: "bg-danger/10",
    },
    building: {
      icon: <SpinnerIcon />,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    queued: {
      icon: <ClockIcon />,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    canceled: {
      icon: <MinusIcon />,
      color: "text-muted",
      bg: "bg-muted/10",
    },
  };

  const config = statusConfig[build.status] || statusConfig.canceled;
  const duration = getBuildDuration(build.startedAt, build.finishedAt);

  return (
    <Link href={`/build/${build._id}`}>
      <div className="group flex items-center gap-4 rounded-lg bg-background/50 px-4 py-3 transition-colors hover:bg-background/70 cursor-pointer">
        {/* Status icon */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bg} ${config.color}`}
        >
          {config.icon}
        </div>

        {/* Build info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {build.workflowId || "Build"}
            </span>
            <span className="rounded bg-card-border px-1.5 py-0.5 text-xs text-muted">
              {build.branch || "main"}
            </span>
          </div>
          {build.commit?.message && (
            <p className="mt-0.5 truncate text-xs text-muted">
              {build.commit.message}
            </p>
          )}
        </div>

        {/* Duration & time */}
        <div className="shrink-0 text-right">
          <p className="text-sm text-foreground">
            {duration || "--"}
          </p>
          <p className="text-xs text-muted">
            {build.startedAt
              ? formatRelativeTime(build.startedAt)
              : "Pending"}
          </p>
        </div>

        {/* Status label */}
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}
        >
          {build.status.charAt(0).toUpperCase() + build.status.slice(1)}
        </span>

        {/* Arrow indicator */}
        <svg
          className="h-4 w-4 shrink-0 text-muted/40 transition-colors group-hover:text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  );
}

function getBuildDuration(
  startedAt?: string,
  finishedAt?: string
): string | null {
  if (!startedAt) return null;
  const start = new Date(startedAt);
  const end = finishedAt ? new Date(finishedAt) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
  );
}
