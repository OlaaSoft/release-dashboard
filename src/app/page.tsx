"use client";

import { useEffect, useState, useCallback } from "react";
import AppCard from "@/components/AppCard";
import ReleaseCalendar from "@/components/ReleaseCalendar";
import BuildHistory from "@/components/BuildHistory";
import { AppConfig, BuildInfo } from "@/types";
import appsData from "@/data/apps.json";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const apps = appsData as AppConfig[];
  const [builds, setBuilds] = useState<BuildInfo[]>([]);
  const [isLoadingBuilds, setIsLoadingBuilds] = useState(true);
  const [triggeringApps, setTriggeringApps] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchBuilds = useCallback(async () => {
    try {
      const allBuilds: BuildInfo[] = [];
      for (const app of apps) {
        const response = await fetch(
          `/api/build-status?appId=${app.codemagicAppId}`
        );
        if (response.ok) {
          const data = await response.json();
          allBuilds.push(...(data.builds || []));
        }
      }
      allBuilds.sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
      setBuilds(allBuilds);
    } catch {
      // Silently fail — builds will show empty
    } finally {
      setIsLoadingBuilds(false);
    }
  }, [apps]);

  useEffect(() => {
    fetchBuilds();
    const interval = setInterval(fetchBuilds, 30000);
    return () => clearInterval(interval);
  }, [fetchBuilds]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleTriggerBuild = async (app: AppConfig): Promise<string | undefined> => {
    setTriggeringApps((prev) => new Set(prev).add(app.codemagicAppId));

    try {
      const response = await fetch("/api/trigger-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: app.codemagicAppId,
          workflowId: "ios-release",
          branch: "main",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(
          `Build triggered for ${app.name}!`,
          "success"
        );
        // Refresh builds after a short delay
        setTimeout(fetchBuilds, 3000);
        return data.buildId;
      } else {
        showToast(data.error || "Failed to trigger build", "error");
        return undefined;
      }
    } catch {
      showToast("Network error — could not trigger build", "error");
      return undefined;
    } finally {
      setTriggeringApps((prev) => {
        const next = new Set(prev);
        next.delete(app.codemagicAppId);
        return next;
      });
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  const getLatestBuild = (appId: string): BuildInfo | undefined => {
    return builds.find((b) => b.appId === appId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 max-w-md rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "border border-success/20 bg-success/10 text-success"
              : "border border-danger/20 bg-danger/10 text-danger"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-card-border bg-card-bg/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                OlaaSoft Release Dashboard
              </h1>
              <p className="text-xs text-muted">
                Manage builds and releases across all apps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBuilds}
              className="flex items-center gap-2 rounded-lg border border-card-border px-3 py-2 text-sm text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <svg
                className={`h-4 w-4 ${isLoadingBuilds ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                />
              </svg>
              Refresh
            </button>
            <span className="text-xs text-muted">
              {apps.length} app{apps.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-2 text-sm text-muted transition-colors hover:border-danger/30 hover:text-danger"
              title="Logout"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3h-9m9 0l-3-3m3 3l-3 3"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats bar */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total Apps"
            value={apps.length.toString()}
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3"
                />
              </svg>
            }
          />
          <StatCard
            label="Active Builds"
            value={
              builds
                .filter(
                  (b) => b.status === "building" || b.status === "queued"
                )
                .length.toString()
            }
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.42 15.17l-5.1-5.1m0 0L12 4.37m-5.68 5.7h15.36"
                />
              </svg>
            }
          />
          <StatCard
            label="Success Rate"
            value={getSuccessRate(builds)}
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            label="Next Release"
            value={getNextReleaseDays(apps)}
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            }
          />
        </div>

        {/* App cards */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Apps</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <AppCard
                key={app.codemagicAppId}
                app={app}
                latestBuild={getLatestBuild(app.codemagicAppId)}
                onTriggerBuild={handleTriggerBuild}
                isTriggering={triggeringApps.has(app.codemagicAppId)}
                onBuildStatusChange={fetchBuilds}
              />
            ))}
          </div>
        </section>

        {/* Calendar and Build History side by side on large screens */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ReleaseCalendar apps={apps} />
          <BuildHistory builds={builds} isLoading={isLoadingBuilds} />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-card-border py-4 text-center text-xs text-muted">
        OlaaSoft Release Dashboard
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-4">
      <div className="mb-2 flex items-center gap-2 text-muted">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function getSuccessRate(builds: BuildInfo[]): string {
  const completed = builds.filter(
    (b) => b.status === "success" || b.status === "failed"
  );
  if (completed.length === 0) return "--";
  const successful = completed.filter((b) => b.status === "success").length;
  return `${Math.round((successful / completed.length) * 100)}%`;
}

function getNextReleaseDays(apps: AppConfig[]): string {
  let minDays = Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const app of apps) {
    const lastRelease = new Date(app.lastReleaseDate);
    const next = new Date(lastRelease);
    next.setDate(next.getDate() + app.releaseCycleDays);
    while (next < today) {
      next.setDate(next.getDate() + app.releaseCycleDays);
    }
    const days = Math.ceil(
      (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < minDays) minDays = days;
  }

  if (minDays === Infinity) return "--";
  if (minDays === 0) return "Today";
  if (minDays === 1) return "Tomorrow";
  return `${minDays} days`;
}
