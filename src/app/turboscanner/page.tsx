import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "TurboScanner — Fast, Beautiful Document Scanner",
  description:
    "Scan, enhance, and organize documents instantly. Available on iOS.",
};

// ---- Feature data ----

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>
    ),
    title: "Instant Scanning",
    description: "Point your camera and scan documents in seconds with automatic edge detection.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: "Auto Enhance",
    description: "One-tap enhancement with smart contrast, brightness, and sharpness adjustments.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
    title: "Smart Organization",
    description: "Create multi-page documents and organize them with custom names and folders.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364V3M12.334 7.614c.89.058 1.77.136 2.641.234M6 5.25c-.89.058-1.77.136-2.641.234" />
      </svg>
    ),
    title: "15 Languages",
    description: "Full localization support for 15 languages including English, Chinese, Arabic, and more.",
  },
];

// ---- Page ----

export default function TurboScannerLanding() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* ---- Nav ---- */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#8B5CF6]">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5" />
              </svg>
            </div>
            <span className="text-lg font-bold">TurboScanner</span>
          </div>
          <a
            href="#download"
            className="rounded-full bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            Download
          </a>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden pt-28 pb-20">
        {/* Background glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-[#2563EB]/15 blur-[120px]" />
        </div>
        <div className="pointer-events-none absolute top-40 right-0">
          <div className="h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          {/* Left — Text */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 px-4 py-1.5 text-sm text-[#60A5FA]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#60A5FA]" />
              Available on iOS
            </div>
            <h1 className="mb-6 text-5xl leading-tight font-extrabold tracking-tight sm:text-6xl">
              Scan Documents{" "}
              <span className="bg-gradient-to-r from-[#60A5FA] to-[#A78BFA] bg-clip-text text-transparent">
                Beautifully
              </span>
            </h1>
            <p className="mb-10 max-w-lg text-lg text-[#94A3B8] lg:max-w-md">
              The fastest, most elegant document scanner for your iPhone. Scan, enhance, and organize — all in one tap.
            </p>
            <div id="download" className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="https://apps.apple.com/app/turboscanner"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none text-[#94A3B8]">Download on the</div>
                  <div className="text-lg font-semibold leading-tight">App Store</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right — iPhone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone frame */}
              <div className="relative z-10 h-[580px] w-[280px] overflow-hidden rounded-[3rem] border-[6px] border-[#253049] bg-[#131827] shadow-2xl shadow-[#2563EB]/20">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 z-20 h-7 w-[120px] -translate-x-1/2 rounded-b-2xl bg-[#131827]" />
                {/* Screenshot */}
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src="/turboscanner/screenshot-1.png"
                    alt="TurboScanner app screenshot"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Fallback gradient when no screenshot */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#131827] to-[#1E2436] p-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#8B5CF6]">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#64748B]">App Screenshot</p>
                  </div>
                </div>
              </div>
              {/* Glow behind phone */}
              <div className="absolute -inset-8 -z-10 rounded-[4rem] bg-gradient-to-b from-[#2563EB]/20 to-[#8B5CF6]/20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Everything You Need
            </h2>
            <p className="text-[#94A3B8]">
              Powerful features wrapped in a beautiful, intuitive interface.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-[#253049] bg-[#131827] p-6 transition-all hover:border-[#2563EB]/30 hover:bg-[#161C2E]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#60A5FA] transition-colors group-hover:bg-[#2563EB]/20">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#94A3B8]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="relative py-24" id="download-bottom">
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2">
          <div className="h-[400px] w-[600px] rounded-full bg-[#8B5CF6]/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to Scan Smarter?
          </h2>
          <p className="mb-10 text-[#94A3B8]">
            Download TurboScanner and transform the way you digitize documents.
          </p>
          <a
            href="https://apps.apple.com/app/turboscanner"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] px-8 py-4 text-lg font-semibold transition-opacity hover:opacity-90"
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on App Store
          </a>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-[#253049] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#2563EB] to-[#8B5CF6]">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#94A3B8]">TurboScanner by OlaaSoft</span>
          </div>
          <div className="flex gap-6 text-sm text-[#64748B]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
