import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { repoFullName, version, buildNumber } = await request.json();

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN is not configured" },
        { status: 500 }
      );
    }

    if (!repoFullName || !version || buildNumber === undefined) {
      return NextResponse.json(
        { error: "repoFullName, version, and buildNumber are required" },
        { status: 400 }
      );
    }

    const headers = {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };

    const filePath = "pubspec.yaml";
    const branch = "main";

    // 1. Get current file content from the repo
    const getFileUrl = `https://api.github.com/repos/${repoFullName}/contents/${filePath}?ref=${branch}`;
    const fileResponse = await fetch(getFileUrl, { headers });

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      return NextResponse.json(
        { error: `Failed to get pubspec.yaml: ${fileResponse.status} - ${errorText}` },
        { status: fileResponse.status }
      );
    }

    const fileData = await fileResponse.json();
    const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
    const fileSha = fileData.sha;

    // 2. Update the version line
    const versionString = `${version}+${buildNumber}`;
    const updatedContent = currentContent.replace(
      /^version:\s*.+$/m,
      `version: ${versionString}`
    );

    if (updatedContent === currentContent) {
      return NextResponse.json(
        { error: "Could not find version line in pubspec.yaml" },
        { status: 400 }
      );
    }

    // 3. Commit the updated file
    const updateFileUrl = `https://api.github.com/repos/${repoFullName}/contents/${filePath}`;
    const commitMessage = `chore(app): bump version to ${versionString}`;

    const updateResponse = await fetch(updateFileUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(updatedContent).toString("base64"),
        sha: fileSha,
        branch,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      return NextResponse.json(
        { error: `Failed to update pubspec.yaml: ${updateResponse.status} - ${errorText}` },
        { status: updateResponse.status }
      );
    }

    const updateData = await updateResponse.json();

    return NextResponse.json({
      success: true,
      version: versionString,
      commitSha: updateData.commit?.sha,
      message: `Version bumped to ${versionString}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to bump version: ${message}` },
      { status: 500 }
    );
  }
}
