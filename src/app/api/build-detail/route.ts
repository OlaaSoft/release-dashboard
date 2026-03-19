import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buildId = searchParams.get("buildId");

    const apiToken = process.env.CODEMAGIC_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "CODEMAGIC_API_TOKEN is not configured" },
        { status: 500 }
      );
    }

    if (!buildId) {
      return NextResponse.json(
        { error: "buildId query parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.codemagic.io/builds/${buildId}`,
      {
        headers: {
          "x-auth-token": apiToken,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Codemagic API error: ${response.status} — ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const build = data.build;

    if (!build) {
      return NextResponse.json(
        { error: "Build not found" },
        { status: 404 }
      );
    }

    const result = {
      _id: build._id,
      appId: build.appId,
      workflowId: build.workflowId,
      branch: build.branch,
      status: mapBuildStatus(build.status),
      startedAt: build.startedAt,
      finishedAt: build.finishedAt || null,
      commit: build.commit
        ? {
            hash: build.commit.hash || build.commit.commitHash || "",
            message: build.commit.message || build.commit.commitMessage || "",
          }
        : null,
      pipeline: Array.isArray(build.pipeline)
        ? build.pipeline.map(
            (step: Record<string, unknown>) => ({
              name: step.name || "Unknown step",
              status: mapStepStatus(step.status as string),
              startedAt: step.startedAt || null,
              finishedAt: step.finishedAt || null,
            })
          )
        : null,
    };

    return NextResponse.json({ build: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch build detail: ${message}` },
      { status: 500 }
    );
  }
}

function mapBuildStatus(status: string): string {
  switch (status) {
    case "finished":
      return "success";
    case "failed":
    case "error":
      return "failed";
    case "building":
    case "preparing":
    case "testing":
    case "publishing":
    case "fetching":
      return "building";
    case "queued":
      return "queued";
    case "canceled":
    case "cancelled":
      return "canceled";
    default:
      return status;
  }
}

function mapStepStatus(status: string): string {
  switch (status) {
    case "success":
    case "finished":
      return "success";
    case "failed":
    case "error":
      return "failed";
    case "building":
    case "running":
    case "in_progress":
      return "running";
    case "skipped":
      return "skipped";
    case "queued":
    case "pending":
    case "not_run":
    default:
      return "pending";
  }
}
