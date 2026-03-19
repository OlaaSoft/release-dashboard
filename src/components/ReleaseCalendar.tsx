"use client";

import { AppConfig } from "@/types";

interface ReleaseCalendarProps {
  apps: AppConfig[];
}

export default function ReleaseCalendar({ apps }: ReleaseCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate 60 days of timeline (4 release cycles)
  const timelineDays = 60;
  const releases = generateReleases(apps, timelineDays);
  const weeks = generateWeeks(today, timelineDays);

  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-6">
      <h2 className="mb-1 text-lg font-semibold text-foreground">
        Release Calendar
      </h2>
      <p className="mb-5 text-sm text-muted">
        Upcoming releases based on {apps[0]?.releaseCycleDays || 15}-day cycle
      </p>

      {/* Timeline */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Month labels */}
          <div className="mb-2 flex">
            {getMonthLabels(today, timelineDays).map((m, i) => (
              <div
                key={i}
                className="text-xs font-medium text-muted"
                style={{ width: `${(m.days / timelineDays) * 100}%` }}
              >
                {m.label}
              </div>
            ))}
          </div>

          {/* Week grid */}
          <div className="relative mb-4">
            <div className="flex gap-0.5">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-1 flex-col gap-0.5">
                  {week.map((day, di) => {
                    const isToday = isSameDay(day, today);
                    const release = releases.find((r) =>
                      isSameDay(new Date(r.date), day)
                    );
                    const isPast = day < today;

                    return (
                      <div
                        key={di}
                        className={`group relative h-7 rounded-sm transition-colors ${
                          release
                            ? "bg-accent hover:bg-accent-hover"
                            : isToday
                            ? "bg-foreground/20 ring-1 ring-foreground/40"
                            : isPast
                            ? "bg-card-border/50"
                            : "bg-card-border"
                        }`}
                        title={`${formatDateShort(day)}${
                          release ? ` — ${release.appName} release` : ""
                        }${isToday ? " (today)" : ""}`}
                      >
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-lg group-hover:block">
                          <div className="font-medium">
                            {formatDateShort(day)}
                          </div>
                          {release && (
                            <div className="text-accent">{release.appName}</div>
                          )}
                          {isToday && (
                            <div className="text-muted">Today</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-accent" />
              Release day
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-foreground/20 ring-1 ring-foreground/40" />
              Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-card-border" />
              Regular day
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Releases List */}
      <div className="mt-6 border-t border-card-border pt-5">
        <h3 className="mb-3 text-sm font-medium text-foreground">
          Upcoming Releases
        </h3>
        <div className="space-y-2">
          {releases
            .filter((r) => new Date(r.date) >= today)
            .slice(0, 6)
            .map((release, i) => {
              const daysUntil = getDaysUntil(new Date(release.date));
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-background/50 px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        daysUntil <= 3
                          ? "bg-warning"
                          : daysUntil <= 7
                          ? "bg-accent"
                          : "bg-muted"
                      }`}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {release.appName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted">
                      {formatDateShort(new Date(release.date))}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        daysUntil <= 3
                          ? "text-warning"
                          : daysUntil <= 7
                          ? "text-accent"
                          : "text-muted"
                      }`}
                    >
                      {daysUntil === 0
                        ? "Today"
                        : daysUntil === 1
                        ? "Tomorrow"
                        : `in ${daysUntil} days`}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

interface ReleaseEvent {
  date: string;
  appName: string;
}

function generateReleases(
  apps: AppConfig[],
  timelineDays: number
): ReleaseEvent[] {
  const releases: ReleaseEvent[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + timelineDays);

  for (const app of apps) {
    const lastRelease = new Date(app.lastReleaseDate);
    lastRelease.setHours(0, 0, 0, 0);
    const current = new Date(lastRelease);

    // Go back a bit to catch the last release if it's within range
    while (current <= endDate) {
      if (current >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        releases.push({
          date: current.toISOString().split("T")[0],
          appName: app.name,
        });
      }
      current.setDate(current.getDate() + app.releaseCycleDays);
    }
  }

  releases.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return releases;
}

function generateWeeks(startDate: Date, days: number): Date[][] {
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  for (let i = -3; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    currentWeek.push(date);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function getMonthLabels(
  startDate: Date,
  days: number
): { label: string; days: number }[] {
  const months: { label: string; days: number }[] = [];
  let currentMonth = -1;
  let count = 0;

  for (let i = -3; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    if (date.getMonth() !== currentMonth) {
      if (count > 0) {
        months[months.length - 1].days = count;
      }
      currentMonth = date.getMonth();
      months.push({
        label: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        days: 0,
      });
      count = 0;
    }
    count++;
  }
  if (months.length > 0) {
    months[months.length - 1].days = count;
  }

  return months;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDaysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
