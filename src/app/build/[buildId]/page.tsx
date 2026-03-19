"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface PipelineStep {
  name: string;
  status: "success" | "failed" | "running" | "pending" | "skipped";
  startedAt: string | null;
  finishedAt: string | null;
}

interface BuildDetail {
  _id: string;
  appId: string;
  workflowId: string;
  branch: string;
  status: "success" | "failed" | "building" | "queued" | "canceled";
  startedAt: string;
  finishedAt: string | null;
  commit: {
    hash: string;
    message: string;
  } | null;
  pipeline: PipelineStep[] | null;
}

export default function BuildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const buildId = params.buildId as string;

  const [build, setBuild] = useState<BuildDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuild = useCallback(async () => {
    try {
      const response = await fetch(`/api/build-detail?buildId=${buildId}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch build");
      }
      const data = await response.json();
      setBuild(data.build);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch build");
    } finally {
      setIsLoading(false);
    }
  }, [buildId]);

  useEffect(() => {
    fetchBuild();
  }, [fetchBuild]);

  // Poll every 5 seconds while build is in progress
  useEffect(() => {
    if (!build) return;
    const isActive = build.status === "building" || build.status === "queued";
    if (!isActive) return;

    const interval = setInterval(fetchBuild, 5000);
    return () => clearInterval(interval);
  }, [build, fetchBuild]);

  const isActive = build?.status === "building" || build?.status === "queued";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border bg-card-bg/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-lg border border-card-border px-3 py-2 text-sm text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Build Details</h1>
            <p className="text-xs text-muted font-mono">{buildId}</p>
          </div>
          {isActive && (
            <div className="flex items-center gap-2 text-sm text-warning">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Live
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchBuild} />
        ) : build ? (
          <div className="space-y-6">
            {/* Build Overview Card */}
            <div className="rounded-xl border border-card-border bg-card-bg p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Overview</h2>
                <BuildStatusBadge status={build.status} />
              </div>

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <DetailItem label="Workflow" value={build.workflowId || "Default"} />
                <DetailItem label="Branch" value={build.branch || "main"} mono />
                <DetailItem
                  label="Started"
                  value={build.startedAt ? formatDateTime(build.startedAt) : "Pending"}
                />
                <DetailItem
                  label="Duration"
                  value={getDuration(build.startedAt, build.finishedAt)}
                />
              </div>

              {build.commit && (
                <div className="mt-6 border-t border-card-border pt-4">
                  <p className="mb-1 text-xs text-muted">Commit</p>
                  <div className="flex items-start gap-3">
                    <code className="shrink-0 rounded bg-background px-2 py-1 text-xs text-accent font-mono">
                      {build.commit.hash ? build.commit.hash.slice(0, 7) : "---"}
                    </code>
                    <p className="text-sm text-foreground">{build.commit.message || "No message"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pipeline Steps */}
            <div className="rounded-xl border border-card-border bg-card-bg p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">Build Pipeline</h2>

              {build.pipeline && build.pipeline.length > 0 ? (
                <div className="space-y-1">
                  {build.pipeline.map((step, index) => (
                    <PipelineStepRow
                      key={index}
                      step={step}
                      isLast={index === build.pipeline!.length - 1}
                    />
                  ))}
                </div>
              ) : (
                <SimpleBuildProgress status={build.status} />
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function PipelineStepRow({
  step,
  isLast,
}: {
  step: PipelineStep;
  isLast: boolean;
}) {
  const duration = step.startedAt
    ? getDuration(step.startedAt, step.finishedAt)
    : null;

  return (
    <div className="flex items-stretch gap-4">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <StepStatusIcon status={step.status} />
        {!isLast && (
          <div
            className={`mt-1 w-0.5 flex-1 ${
              step.status === "success"
                ? "bg-success/30"
                : step.status === "failed"
                ? "bg-danger/30"
                : step.status === "running"
                ? "bg-warning/30"
                : "bg-card-border"
            }`}
          />
        )}
      </div>

      {/* Step content */}
      <div className={`flex flex-1 items-center justify-between rounded-lg px-4 py-3 ${
        step.status === "running"
          ? "bg-warning/5 border border-warning/20"
          : "bg-background/50"
      } ${!isLast ? "mb-1" : ""}`}>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium ${
              step.status === "success"
                ? "text-foreground"
                : step.status === "failed"
                ? "text-danger"
                : step.status === "running"
                ? "text-warning"
                : step.status === "skipped"
                ? "text-muted/60"
                : "text-muted"
            }`}
          >
            {step.name}
          </span>
          {step.status === "running" && (
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-warning animate-pulse-dot" />
          )}
        </div>
        <div className="flex items-center gap-3">
          {duration && (
            <span className="text-xs text-muted font-mono">{duration}</span>
          )}
          <StepStatusLabel status={step.status} />
        </div>
      </div>
    </div>
  );
}

function StepStatusIcon({ status }: { status: string }) {
  const baseClass = "flex h-6 w-6 shrink-0 items-center justify-center rounded-full";

  switch (status) {
    case "success":
      return (
        <div className={`${baseClass} bg-success/10 text-success`}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      );
    case "failed":
      return (
        <div className={`${baseClass} bg-danger/10 text-danger`}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    case "running":
      return (
        <div className={`${baseClass} bg-warning/10 text-warning`}>
          <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      );
    case "skipped":
      return (
        <div className={`${baseClass} bg-muted/10 text-muted/50`}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811V8.69zM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061a1.125 1.125 0 01-1.683-.977V8.69z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`${baseClass} border-2 border-card-border bg-background`}>
          <div className="h-2 w-2 rounded-full bg-card-border" />
        </div>
      );
  }
}

function StepStatusLabel({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    success: { label: "Done", color: "text-success", bg: "bg-success/10" },
    failed: { label: "Failed", color: "text-danger", bg: "bg-danger/10" },
    running: { label: "Running", color: "text-warning", bg: "bg-warning/10" },
    skipped: { label: "Skipped", color: "text-muted/60", bg: "bg-muted/5" },
    pending: { label: "Pending", color: "text-muted", bg: "bg-muted/10" },
  };

  const c = config[status] || config.pending;

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.bg} ${c.color}`}>
      {c.label}
    </span>
  );
}

function SimpleBuildProgress({ status }: { status: string }) {
  const stages = ["Queued", "Preparing", "Building", "Finishing"];
  const activeIndex =
    status === "queued"
      ? 0
      : status === "building"
      ? 2
      : status === "success"
      ? 4
      : status === "failed"
      ? -1
      : 0;

  return (
    <div className="space-y-3">
      <p className="mb-4 text-sm text-muted">
        Detailed pipeline steps are not available for this build. Showing simplified progress.
      </p>
      {stages.map((stage, index) => {
        let stepStatus: string;
        if (status === "failed" && index <= 2) {
          stepStatus = index < 2 ? "success" : "failed";
        } else if (status === "canceled") {
          stepStatus = "skipped";
        } else if (index < activeIndex) {
          stepStatus = "success";
        } else if (index === activeIndex) {
          stepStatus = "running";
        } else {
          stepStatus = "pending";
        }

        return (
          <PipelineStepRow
            key={stage}
            step={{
              name: stage,
              status: stepStatus as PipelineStep["status"],
              startedAt: null,
              finishedAt: null,
            }}
            isLast={index === stages.length - 1}
          />
        );
      })}
    </div>
  );
}

function BuildStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    success: { label: "Success", color: "text-success", bg: "bg-success/10" },
    failed: { label: "Failed", color: "text-danger", bg: "bg-danger/10" },
    building: { label: "Building", color: "text-warning", bg: "bg-warning/10" },
    queued: { label: "Queued", color: "text-accent", bg: "bg-accent/10" },
    canceled: { label: "Canceled", color: "text-muted", bg: "bg-muted/10" },
  };

  const c = config[status] || config.canceled;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${c.bg} ${c.color}`}>
      {status === "building" && (
        <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {c.label}
    </span>
  );
}

function DetailItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function getDuration(startedAt: string | null, finishedAt: string | null): string {
  if (!startedAt) return "--";
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

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-card-border bg-card-bg p-6">
        <div className="mb-6 h-6 w-24 animate-pulse rounded bg-card-border" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="mb-2 h-3 w-16 animate-pulse rounded bg-card-border" />
              <div className="h-5 w-24 animate-pulse rounded bg-card-border" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-card-border bg-card-bg p-6">
        <div className="mb-6 h-6 w-32 animate-pulse rounded bg-card-border" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-background/50" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-card-border bg-card-bg py-16">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="mb-2 text-sm font-medium text-foreground">Failed to load build</p>
      <p className="mb-6 text-sm text-muted">{error}</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Retry
      </button>
    </div>
  );
}
