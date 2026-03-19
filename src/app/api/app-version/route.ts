import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const repoFullName = request.nextUrl.searchParams.get("repo");

  if (!repoFullName) {
    return NextResponse.json({ error: "repo is required" }, { status: 400 });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/contents/pubspec.yaml`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3.raw",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch pubspec.yaml" },
        { status: response.status }
      );
    }

    const content = await response.text();
    const versionMatch = content.match(/^version:\s*(.+)$/m);

    if (!versionMatch) {
      return NextResponse.json(
        { error: "version not found in pubspec.yaml" },
        { status: 404 }
      );
    }

    const versionString = versionMatch[1].trim();
    const [version, buildNumber] = versionString.split("+");

    return NextResponse.json({
      version: version || "0.0.0",
      buildNumber: parseInt(buildNumber || "0", 10),
      raw: versionString,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch version" },
      { status: 500 }
    );
  }
}
