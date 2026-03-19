import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get("appId");

    const apiToken = process.env.CODEMAGIC_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "CODEMAGIC_API_TOKEN is not configured" },
        { status: 500 }
      );
    }

    if (!appId) {
      return NextResponse.json(
        { error: "appId query parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.codemagic.io/builds?appId=${appId}`,
      {
        headers: {
          "x-auth-token": apiToken,
        },
        // Revalidate every 30 seconds
        next: { revalidate: 30 },
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

    // Codemagic returns { builds: [...] }
    const builds = (data.builds || []).slice(0, 20).map(
      (build: Record<string, unknown>) => ({
        _id: build._id,
        appId: build.appId,
        workflowId: build.workflowId,
        branch: build.branch,
        status: mapBuildStatus(build.status as string),
        startedAt: build.startedAt,
        finishedAt: build.finishedAt,
        commit: build.commit
          ? {
              hash: (build.commit as Record<string, unknown>).hash,
              message: (build.commit as Record<string, unknown>).message,
            }
          : undefined,
      })
    );

    return NextResponse.json({ builds });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch build status: ${message}` },
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
