export interface AppConfig {
  name: string;
  displayName: string;
  bundleId: string;
  currentVersion: string;
  buildNumber: number;
  platform: "ios" | "android";
  codemagicAppId: string;
  repoUrl: string;
  releaseCycleDays: number;
  lastReleaseDate: string;
}

export interface BuildInfo {
  _id: string;
  appId: string;
  workflowId: string;
  branch: string;
  status: "success" | "failed" | "building" | "queued" | "canceled";
  startedAt: string;
  finishedAt?: string;
  commit?: {
    hash: string;
    message: string;
  };
}

export interface TriggerBuildResponse {
  buildId: string;
  status: string;
  message: string;
}

export type BuildStatus = "success" | "failed" | "building" | "queued" | "canceled";
