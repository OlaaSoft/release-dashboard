"use client";

// ---- Colors (matching ols_design_system dark theme) ----

export const C = {
  bg: "#0B0F1A",
  surface: "#131827",
  surfaceVariant: "#1E2436",
  card: "#161C2E",
  border: "#253049",
  primary: "#60A5FA",
  primaryDark: "#2563EB",
  secondary: "#A78BFA",
  secondaryDark: "#8B5CF6",
  accent: "#F472B6",
  success: "#10B981",
  info: "#3B82F6",
  warning: "#F59E0B",
  error: "#EF4444",
  text: "#F1F5F9",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",
  glassBg: "rgba(26, 29, 40, 0.8)",
  glassBorder: "rgba(255, 255, 255, 0.2)",
  bottomBarSelected: "#60A5FA",
  bottomBarUnselected: "#64748B",
};

// ---- Phone Frame ----

export function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Phone body */}
        <div
          className="relative w-[280px] h-[580px] rounded-[3rem] overflow-hidden shadow-2xl"
          style={{
            border: `6px solid ${C.border}`,
            backgroundColor: C.bg,
            boxShadow: `0 25px 60px rgba(37, 99, 235, 0.15)`,
          }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[100px] h-[28px] rounded-full"
            style={{ backgroundColor: "#000" }}
          />
          {/* Screen content */}
          <div className="relative h-full w-full overflow-hidden">
            {children}
          </div>
        </div>
        {/* Glow */}
        <div className="absolute -inset-6 -z-10 rounded-[4rem] bg-gradient-to-b from-[#2563EB]/15 to-[#8B5CF6]/15 blur-2xl" />
      </div>
      <span className="text-sm font-medium" style={{ color: C.textSecondary }}>
        {label}
      </span>
    </div>
  );
}

// ---- Bottom Bar (shared by all screens) ----

export function BottomBar({ activeIndex }: { activeIndex: number }) {
  const items = [
    { icon: "folder", label: "Documents" },
    { icon: "scanner", label: "Scan" },
    { icon: "settings", label: "Settings" },
  ];

  return (
    <div className="absolute bottom-4 left-4 right-4 z-20">
      <div
        className="flex items-center justify-around rounded-[22px] h-[56px] px-2"
        style={{
          backgroundColor: C.glassBg,
          border: `0.5px solid ${C.glassBorder}`,
          backdropFilter: "blur(30px)",
        }}
      >
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          const color = isActive ? C.bottomBarSelected : C.bottomBarUnselected;
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <BottomBarIcon type={item.icon} color={color} filled={isActive} />
              <span style={{ fontSize: 9, fontWeight: isActive ? 600 : 400, color }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BottomBarIcon({ type, color, filled }: { type: string; color: string; filled: boolean }) {
  const sw = filled ? 2.5 : 1.5;
  if (type === "folder") {
    return (
      <svg width="20" height="20" fill={filled ? color : "none"} viewBox="0 0 24 24" stroke={color} strokeWidth={sw}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    );
  }
  if (type === "scanner") {
    return (
      <svg width="20" height="20" fill={filled ? color : "none"} viewBox="0 0 24 24" stroke={color} strokeWidth={sw}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" fill={filled ? color : "none"} viewBox="0 0 24 24" stroke={color} strokeWidth={sw}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

// ================ SCREEN MOCKUPS ================

// ---- Documents Screen ----

export function DocumentsScreenMockup() {
  const docs = [
    { name: "Tax Return 2024", pages: 3, size: "2.4 MB", ext: "PDF", color: C.primary, date: "Today" },
    { name: "Passport Scan", pages: 1, size: "1.1 MB", ext: "JPG", color: C.secondary, date: "Yesterday" },
    { name: "Receipt #4821", pages: 1, size: "340 KB", ext: "JPG", color: C.accent, date: "Mar 18" },
    { name: "Contract Draft", pages: 5, size: "4.2 MB", ext: "PDF", color: C.success, date: "Mar 15" },
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: C.bg }}>
      {/* Status bar spacer */}
      <div className="h-14" />

      {/* Header */}
      <div className="px-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[22px] font-black leading-none" style={{ color: C.text }}>
              Your
            </span>
            <br />
            <span
              className="text-[22px] font-black leading-none bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(to right, ${C.primaryDark}, ${C.secondaryDark})` }}
            >
              Documents
            </span>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: C.surfaceVariant }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={C.textSecondary} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="px-4">
        <div className="flex gap-2.5 mb-2.5">
          {/* Scan Card */}
          <div
            className="flex-[3] h-[120px] rounded-2xl p-4 relative overflow-hidden"
            style={{ backgroundImage: `linear-gradient(135deg, ${C.primaryDark}, ${C.secondaryDark})` }}
          >
            <div className="absolute right-[-8px] bottom-[-8px] opacity-15">
              <svg width="70" height="70" fill="white" viewBox="0 0 24 24">
                <path d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5" />
              </svg>
            </div>
            <div
              className="inline-block px-2 py-0.5 rounded-md text-[8px] font-bold tracking-wider text-white mb-auto"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              QUICK
            </div>
            <div className="mt-auto">
              <span className="text-white text-[15px] font-extrabold leading-tight block mt-8">
                Scan<br />Document
              </span>
            </div>
          </div>
          {/* OCR Card */}
          <div
            className="flex-[2] h-[120px] rounded-2xl p-3.5 flex flex-col"
            style={{ backgroundColor: C.surfaceVariant }}
          >
            <div
              className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
              style={{ backgroundColor: `${C.accent}1F` }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <div className="mt-auto">
              <span className="text-[13px] font-bold" style={{ color: C.text }}>OCR</span>
              <br />
              <span className="text-[9px]" style={{ color: C.textTertiary }}>Extract Text</span>
            </div>
          </div>
        </div>
        {/* Mini cards */}
        <div className="flex gap-2.5">
          {[
            { icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z", label: "Sign", color: C.secondary },
            { icon: "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm-2.684 5.716A3.009 3.009 0 0110.5 12c.89 0 1.69.39 2.237 1.008", label: "ID Scan", color: C.success },
            { icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z", label: "Import", color: C.info },
          ].map((card, i) => (
            <div
              key={i}
              className="flex-1 h-[75px] rounded-2xl p-3 flex flex-col justify-between"
              style={{ backgroundColor: `${card.color}1A` }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={card.color} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
              </svg>
              <span className="text-[11px] font-semibold" style={{ color: C.text }}>{card.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between px-5 mt-5 mb-2">
        <span className="text-[12px] font-bold tracking-wide" style={{ color: C.text }}>RECENT</span>
        <span className="text-[10px]" style={{ color: C.textTertiary }}>4 files</span>
      </div>

      {/* Document rows */}
      <div className="px-4 space-y-1.5">
        {docs.map((doc, i) => (
          <div
            key={i}
            className="flex items-center p-2.5 rounded-2xl"
            style={{ backgroundColor: C.card, border: `0.5px solid ${C.border}` }}
          >
            {/* Thumbnail */}
            <div
              className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[13px] font-extrabold shrink-0"
              style={{ backgroundColor: `${doc.color}1A`, color: doc.color }}
            >
              {doc.name[0]}
            </div>
            <div className="ml-2.5 flex-1 min-w-0">
              <div className="text-[11px] font-semibold truncate" style={{ color: C.text }}>{doc.name}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px]" style={{ color: C.textTertiary }}>{doc.pages} page{doc.pages > 1 ? "s" : ""}</span>
                <span className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: C.textTertiary }} />
                <span className="text-[9px]" style={{ color: C.textTertiary }}>{doc.size}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[9px]" style={{ color: C.textTertiary }}>{doc.date}</span>
              <span
                className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${doc.ext === "PDF" ? C.error : C.info}1A`,
                  color: doc.ext === "PDF" ? C.error : C.info,
                }}
              >
                {doc.ext}
              </span>
            </div>
          </div>
        ))}
      </div>

      <BottomBar activeIndex={0} />
    </div>
  );
}

// ---- Scan Screen ----

export function ScanScreenMockup() {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: C.bg }}>
      <div className="h-14" />

      {/* Header */}
      <div className="px-5 pb-3">
        <span className="text-[22px] font-black leading-none" style={{ color: C.text }}>
          Scan
        </span>
        <br />
        <span
          className="text-[22px] font-black leading-none bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(to right, ${C.primaryDark}, ${C.secondaryDark})` }}
        >
          Document
        </span>
      </div>

      {/* Mode chips */}
      <div className="flex gap-2 px-4 mb-4">
        {[
          { label: "Document", active: true },
          { label: "ID Card", active: false },
          { label: "OCR", active: false },
        ].map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold"
            style={{
              backgroundColor: m.active ? `${C.primary}1F` : C.surfaceVariant,
              color: m.active ? C.primary : C.textSecondary,
              border: `1px solid ${m.active ? `${C.primary}40` : C.border}`,
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* Viewfinder */}
      <div className="flex-1 mx-4 mb-3">
        <div
          className="relative w-full h-full rounded-3xl flex items-center justify-center"
          style={{
            backgroundColor: C.surfaceVariant,
            border: `0.5px solid ${C.border}`,
          }}
        >
          {/* Corner brackets */}
          {[
            { top: 14, left: 14 },
            { top: 14, right: 14 },
            { bottom: 14, left: 14 },
            { bottom: 14, right: 14 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-[24px] h-[24px]"
              style={{
                ...pos,
                borderTop: i < 2 ? `3px solid ${C.primary}` : undefined,
                borderBottom: i >= 2 ? `3px solid ${C.primary}` : undefined,
                borderLeft: i % 2 === 0 ? `3px solid ${C.primary}` : undefined,
                borderRight: i % 2 === 1 ? `3px solid ${C.primary}` : undefined,
                borderRadius:
                  i === 0 ? "8px 0 0 0" :
                  i === 1 ? "0 8px 0 0" :
                  i === 2 ? "0 0 0 8px" : "0 0 8px 0",
              } as React.CSSProperties}
            />
          ))}

          {/* Center content */}
          <div className="flex flex-col items-center">
            <div
              className="w-[56px] h-[56px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${C.primary}1A` }}
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={C.primary} strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <span className="text-[12px] font-semibold mt-3" style={{ color: C.text }}>Tap to Scan</span>
            <span className="text-[9px] mt-0.5" style={{ color: C.textTertiary }}>Auto-detect edges</span>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between px-6 pb-2">
        {/* Gallery button */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-[44px] h-[44px] rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${C.secondary}1A` }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={C.secondary} strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <span className="text-[9px]" style={{ color: C.textSecondary }}>Gallery</span>
        </div>

        {/* Shutter button */}
        <div className="relative">
          <div
            className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
            style={{ border: `3px solid ${C.primary}` }}
          >
            <div
              className="w-[48px] h-[48px] rounded-full"
              style={{ backgroundImage: `linear-gradient(135deg, ${C.primaryDark}, ${C.secondaryDark})` }}
            />
          </div>
        </div>

        {/* Spacer for balance */}
        <div className="w-[44px]" />
      </div>

      <div className="h-[88px]" />
      <BottomBar activeIndex={1} />
    </div>
  );
}

// ---- Settings Screen ----

export function SettingsScreenMockup() {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: C.bg }}>
      <div className="h-14" />

      {/* Header */}
      <div className="px-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[22px] font-black leading-none" style={{ color: C.text }}>
              Your
            </span>
            <br />
            <span
              className="text-[22px] font-black leading-none bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(to right, ${C.primaryDark}, ${C.secondaryDark})` }}
            >
              Settings
            </span>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: C.surfaceVariant }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={C.textSecondary} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Scan Settings section */}
      <div className="px-5 mb-1">
        <span className="text-[11px] font-bold tracking-wide" style={{ color: C.text }}>SCAN SETTINGS</span>
      </div>
      <div className="flex gap-2.5 px-4 mb-5 mt-2">
        {/* Auto Enhance */}
        <div
          className="flex-1 h-[80px] rounded-2xl p-3 flex flex-col justify-between"
          style={{ backgroundColor: C.surfaceVariant }}
        >
          <div className="flex items-center justify-between">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={C.primary} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <span
              className="px-1.5 py-0.5 rounded-md text-[8px] font-bold"
              style={{ backgroundColor: `${C.success}26`, color: C.success }}
            >
              ON
            </span>
          </div>
          <span className="text-[11px] font-semibold" style={{ color: C.text }}>Auto Enhance</span>
        </div>
        {/* Quality */}
        <div
          className="flex-1 h-[80px] rounded-2xl p-3 flex flex-col justify-between"
          style={{ backgroundColor: C.surfaceVariant }}
        >
          <div className="flex items-center justify-between">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={C.secondary} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
            </svg>
            <span
              className="px-1.5 py-0.5 rounded-md text-[8px] font-bold"
              style={{ backgroundColor: `${C.secondary}26`, color: C.secondary }}
            >
              HIGH
            </span>
          </div>
          <span className="text-[11px] font-semibold" style={{ color: C.text }}>Quality</span>
        </div>
      </div>

      {/* General section */}
      <div className="px-5 mb-2">
        <span className="text-[11px] font-bold tracking-wide" style={{ color: C.text }}>GENERAL</span>
      </div>
      <div className="px-4 space-y-1.5">
        {[
          { icon: "M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z", color: C.secondary, title: "Appearance", value: "System" },
          { icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418", color: C.primary, title: "Language", value: "English" },
        ].map((tile, i) => (
          <div
            key={i}
            className="flex items-center p-3 rounded-2xl"
            style={{ backgroundColor: C.surfaceVariant, border: `0.5px solid ${C.border}` }}
          >
            <div
              className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${tile.color}1A` }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={tile.color} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tile.icon} />
              </svg>
            </div>
            <span className="ml-2.5 flex-1 text-[11px] font-semibold" style={{ color: C.text }}>{tile.title}</span>
            <span className="text-[10px] mr-1" style={{ color: C.textTertiary }}>{tile.value}</span>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.textTertiary} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        ))}
      </div>

      {/* About section */}
      <div className="px-5 mt-5 mb-2">
        <span className="text-[11px] font-bold tracking-wide" style={{ color: C.text }}>ABOUT</span>
      </div>
      <div className="px-4 space-y-1.5">
        {[
          { icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z", color: C.warning, title: "Rate App" },
          { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", color: C.success, title: "Privacy Policy" },
          { icon: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z", color: C.textTertiary, title: "Version", value: "1.0.0" },
        ].map((tile, i) => (
          <div
            key={i}
            className="flex items-center p-3 rounded-2xl"
            style={{ backgroundColor: C.surfaceVariant, border: `0.5px solid ${C.border}` }}
          >
            <div
              className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${tile.color}1A` }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={tile.color} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tile.icon} />
              </svg>
            </div>
            <span className="ml-2.5 flex-1 text-[11px] font-semibold" style={{ color: C.text }}>{tile.title}</span>
            {tile.value && <span className="text-[10px]" style={{ color: C.textTertiary }}>{tile.value}</span>}
            {!tile.value && (
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.textTertiary} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            )}
          </div>
        ))}
      </div>

      <BottomBar activeIndex={2} />
    </div>
  );
}

// ---- Bare Phone (no label, configurable size) ----

export function Phone({
  children,
  width = 280,
  className = "",
  style = {},
  noGlow = false,
}: {
  children: React.ReactNode;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
  noGlow?: boolean;
}) {
  const height = Math.round(width * (580 / 280));
  const radius = Math.round(width * (48 / 280));
  const notchW = Math.round(width * (100 / 280));
  const notchH = Math.round(width * (28 / 280));
  return (
    <div className={`relative ${className}`} style={style}>
      <div
        className="relative overflow-hidden shadow-2xl"
        style={{
          width, height,
          borderRadius: radius,
          border: `6px solid ${C.border}`,
          backgroundColor: C.bg,
          boxShadow: `0 25px 60px rgba(37, 99, 235, 0.15)`,
        }}
      >
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 z-30 rounded-full"
          style={{ width: notchW, height: notchH, backgroundColor: "#000" }}
        />
        <div className="relative h-full w-full overflow-hidden">{children}</div>
      </div>
      {!noGlow && (
        <div className="absolute -inset-6 -z-10 rounded-[4rem] bg-gradient-to-b from-[#2563EB]/15 to-[#8B5CF6]/15 blur-2xl" />
      )}
    </div>
  );
}
