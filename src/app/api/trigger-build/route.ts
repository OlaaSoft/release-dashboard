import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { appId, workflowId, branch } = await request.json();

    const apiToken = process.env.CODEMAGIC_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "CODEMAGIC_API_TOKEN is not configured" },
        { status: 500 }
      );
    }

    if (!appId) {
      return NextResponse.json(
        { error: "appId is required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.codemagic.io/builds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": apiToken,
      },
      body: JSON.stringify({
        appId,
        workflowId: workflowId || "ios-release",
        branch: branch || "main",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Codemagic API error: ${response.status} — ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      buildId: data.buildId,
      status: "queued",
      message: "Build triggered successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to trigger build: ${message}` },
      { status: 500 }
    );
  }
}
