"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { AppConfig, BuildInfo } from "@/types";
import BumpVersionModal from "./BumpVersionModal";

interface AppCardProps {
  app: AppConfig;
  latestBuild?: BuildInfo;
  onTriggerBuild: (app: AppConfig) => Promise<string | undefined>;
  isTriggering: boolean;
  onBuildStatusChange?: () => void;
}

export default function AppCard({
  app,
  latestBuild,
  onTriggerBuild,
  isTriggering,
  onBuildStatusChange,
}: AppCardProps) {
  const nextReleaseDate = getNextReleaseDate(
    app.lastReleaseDate,
    app.releaseCycleDays
  );
  const daysUntilRelease = getDaysUntil(nextReleaseDate);
  const urgency = getUrgency(daysUntilRelease);

  // Track active build for polling
  const [activeBuildId, setActiveBuildId] = useState<string | null>(null);
  const [activeBuildStatus, setActiveBuildStatus] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const buildStartRef = useRef<number | null>(null);

  // Modal state
  const [showBumpModal, setShowBumpModal] = useState(false);
  const [isBumping, setIsBumping] = useState(false);

  // Detect if latestBuild is currently active
  const isLatestBuildActive =
    latestBuild &&
    (latestBuild.status === "building" || latestBuild.status === "queued");

  // If latestBuild becomes active (e.g., from page refresh), start polling it
  useEffect(() => {
    if (isLatestBuildActive && !activeBuildId) {
      setActiveBuildId(latestBuild._id);
      setActiveBuildStatus(latestBuild.status);
    }
  }, [isLatestBuildActive, latestBuild, activeBuildId]);

  // Poll active build status
  const pollBuildStatus = useCallback(async () => {
    if (!activeBuildId) return;

    try {
      const response = await fetch(`/api/build-detail?buildId=${activeBuildId}`);
      if (!response.ok) return;

      const data = await response.json();
      const build = data.build;
      if (!build) return;

      setActiveBuildStatus(build.status);

      // If build finished, stop polling and refresh parent
      if (build.status !== "building" && build.status !== "queued") {
        setActiveBuildId(null);
        setActiveBuildStatus(null);
        buildStartRef.current = null;
        setElapsedTime(0);
        if (onBuildStatusChange) {
          onBuildStatusChange();
        }
      }
    } catch {
      // Silently fail, will retry on next poll
    }
  }, [activeBuildId, onBuildStatusChange]);

  // Start/stop polling interval
  useEffect(() => {
    if (activeBuildId) {
      pollRef.current = setInterval(pollBuildStatus, 5000);
      // Start elapsed timer
      if (!buildStartRef.current) {
        buildStartRef.current = Date.now();
      }
      timerRef.current = setInterval(() => {
        if (buildStartRef.current) {
          setElapsedTime(Math.floor((Date.now() - buildStartRef.current) / 1000));
        }
      }, 1000);
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeBuildId, pollBuildStatus]);

  const handleTriggerClick = () => {
    setShowBumpModal(true);
  };

  const handleBumpAndBuild = async (version: string, buildNumber: number) => {
    setIsBumping(true);
    try {
      // 1. Bump version via API
      const bumpResponse = await fetch("/api/bump-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoFullName: app.repoFullName,
          version,
          buildNumber,
        }),
      });

      if (!bumpResponse.ok) {
        const data = await bumpResponse.json();
        throw new Error(data.error || "Failed to bump version");
      }

      // 2. Trigger the build
      const buildId = await onTriggerBuild(app);
      if (buildId) {
        setActiveBuildId(buildId);
        setActiveBuildStatus("queued");
        buildStartRef.current = Date.now();
        setElapsedTime(0);
      }

      setShowBumpModal(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Error: ${message}`);
    } finally {
      setIsBumping(false);
    }
  };

  const isBuilding = !!activeBuildId || isLatestBuildActive;
  const currentBuildId = activeBuildId || latestBuild?._id;
  const displayStatus = activeBuildStatus || latestBuild?.status || "unknown";

  const buildStatus = isBuilding ? displayStatus : (latestBuild?.status || "unknown");
  const lastBuildDate = latestBuild?.startedAt
    ? formatDate(latestBuild.startedAt)
    : "No builds yet";

  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-6 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <PlatformIcon platform={app.platform} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{app.name}</h3>
            <p className="text-sm text-muted">{app.bundleId}</p>
          </div>
        </div>
        <StatusBadge status={buildStatus} />
      </div>

      {/* Active Build Indicator */}
      {isBuilding && currentBuildId && (
        <Link href={`/build/${currentBuildId}`}>
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 transition-colors hover:bg-warning/10 cursor-pointer">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-warning">
                {displayStatus === "queued" ? "Build Queued" : "Building..."}
              </p>
              <p className="text-xs text-muted">
                {elapsedTime > 0 ? formatElapsed(elapsedTime) : "Starting..."}
                {" \u00b7 "}Click for details
              </p>
            </div>
            <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Link>
      )}

      {/* Info Grid */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <InfoItem label="Version" value={`${app.currentVersion} (${app.buildNumber})`} />
        <InfoItem label="Last Build" value={lastBuildDate} />
        <InfoItem label="Next Release" value={formatDate(nextReleaseDate.toISOString())} />
        <InfoItem
          label="Days Left"
          value={daysUntilRelease <= 0 ? "Overdue!" : `${daysUntilRelease} days`}
          valueClassName={urgency}
        />
      </div>

      {/* Progress bar showing cycle progress */}
      <div className="mb-5">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>Release cycle</span>
          <span>{Math.max(0, app.releaseCycleDays - daysUntilRelease)}/{app.releaseCycleDays} days</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-card-border">
          <div
            className={`h-1.5 rounded-full transition-all ${
              daysUntilRelease <= 0
                ? "bg-danger"
                : daysUntilRelease <= 3
                ? "bg-warning"
                : "bg-accent"
            }`}
            style={{
              width: `${Math.min(
                100,
                ((app.releaseCycleDays - daysUntilRelease) /
                  app.releaseCycleDays) *
                  100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleTriggerClick}
          disabled={isTriggering || isBuilding}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isTriggering ? (
            <>
              <Spinner />
              Triggering...
            </>
          ) : isBuilding ? (
            <>
              <Spinner />
              Build in Progress
            </>
          ) : (
            <>
              <RocketIcon />
              Trigger Build
            </>
          )}
        </button>
        <a
          href={app.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-card-border px-3 py-2.5 text-sm text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
          title="Open repository"
        >
          <GithubIcon />
        </a>
      </div>

      {/* Bump Version Modal */}
      <BumpVersionModal
        isOpen={showBumpModal}
        appName={app.name}
        currentVersion={app.currentVersion}
        currentBuildNumber={app.buildNumber}
        onClose={() => setShowBumpModal(false)}
        onConfirm={handleBumpAndBuild}
        isLoading={isBumping}
      />
    </div>
  );
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function InfoItem({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`text-sm font-medium ${valueClassName || "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    success: { bg: "bg-success/10", text: "text-success", label: "Success" },
    failed: { bg: "bg-danger/10", text: "text-danger", label: "Failed" },
    building: { bg: "bg-warning/10", text: "text-warning", label: "Building" },
    queued: { bg: "bg-accent/10", text: "text-accent", label: "Queued" },
    canceled: { bg: "bg-muted/10", text: "text-muted", label: "Canceled" },
    unknown: { bg: "bg-muted/10", text: "text-muted", label: "No Data" },
  };

  const c = config[status] || config.unknown;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}
    >
      {status === "building" && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" />
      )}
      {c.label}
    </span>
  );
}

function getNextReleaseDate(lastRelease: string, cycleDays: number): Date {
  const last = new Date(lastRelease);
  const next = new Date(last);
  next.setDate(next.getDate() + cycleDays);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  while (next < today) {
    next.setDate(next.getDate() + cycleDays);
  }
  return next;
}

function getDaysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgency(days: number): string {
  if (days <= 0) return "text-danger font-bold";
  if (days <= 3) return "text-warning";
  return "text-success";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "ios") {
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.523 2.223l-1.89 3.27c1.932 1.089 3.244 3.073 3.244 5.383H5.123c0-2.31 1.312-4.294 3.244-5.383L6.477 2.223a.4.4 0 01.148-.546.4.4 0 01.546.148l1.932 3.346A7.896 7.896 0 0112 4.573c1.199 0 2.327.273 3.338.754l-.003-.006 1.932-3.346a.4.4 0 01.546-.148.4.4 0 01.148.546l-.438-.15zM9.5 8.073a.75.75 0 100-1.5.75.75 0 000 1.5zm5 0a.75.75 0 100-1.5.75.75 0 000 1.5zM5.123 11.376h13.754v7.5a2.25 2.25 0 01-2.25 2.25H7.373a2.25 2.25 0 01-2.25-2.25v-7.5z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
