"use client";

import { useState, useEffect, useRef } from "react";

interface BumpVersionModalProps {
  isOpen: boolean;
  appName: string;
  currentVersion: string;
  currentBuildNumber: number;
  onClose: () => void;
  onConfirm: (version: string, buildNumber: number) => void;
  isLoading: boolean;
}

export default function BumpVersionModal({
  isOpen,
  appName,
  currentVersion,
  currentBuildNumber,
  onClose,
  onConfirm,
  isLoading,
}: BumpVersionModalProps) {
  const [version, setVersion] = useState(currentVersion);
  const [buildNumber, setBuildNumber] = useState(currentBuildNumber + 1);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setVersion(currentVersion);
      setBuildNumber(currentBuildNumber + 1);
    }
  }, [isOpen, currentVersion, currentBuildNumber]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current && !isLoading) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(version, buildNumber);
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-card-border bg-card-bg p-6 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Build Configuration
          </h2>
          <p className="mt-1 text-sm text-muted">
            Set version and build number for{" "}
            <span className="font-medium text-foreground">{appName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current values */}
          <div className="mb-5 rounded-lg border border-card-border bg-background px-4 py-3">
            <p className="text-xs text-muted">Current</p>
            <p className="text-sm font-mono font-medium text-foreground">
              {currentVersion}+{currentBuildNumber}
            </p>
          </div>

          {/* Input fields */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="version"
                className="mb-1.5 block text-xs font-medium text-muted"
              >
                Version
              </label>
              <input
                id="version"
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-card-border bg-background px-3 py-2.5 text-sm font-mono text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                placeholder="1.0.0"
              />
            </div>
            <div>
              <label
                htmlFor="buildNumber"
                className="mb-1.5 block text-xs font-medium text-muted"
              >
                Build Number
              </label>
              <input
                id="buildNumber"
                type="number"
                min={1}
                value={buildNumber}
                onChange={(e) => setBuildNumber(parseInt(e.target.value) || 1)}
                disabled={isLoading}
                className="w-full rounded-lg border border-card-border bg-background px-3 py-2.5 text-sm font-mono text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
              />
            </div>
          </div>

          {/* New version preview */}
          <div className="mb-6 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
            <p className="text-xs text-accent">New Version</p>
            <p className="text-sm font-mono font-semibold text-accent">
              {version}+{buildNumber}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-card-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-foreground/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !version.trim()}
              className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
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
                  Bumping...
                </>
              ) : (
                <>
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
                      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                    />
                  </svg>
                  Build
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
