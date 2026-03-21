"use client";

import {
  C,
  Phone,
  DocumentsScreenMockup,
  ScanScreenMockup,
  SettingsScreenMockup,
} from "@/components/turboscanner/mockups";

// ---- Shared headline for some layouts ----

function Headline({ top, bottom, sub }: { top: string; bottom: string; sub?: string }) {
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: C.text }}>
        {top}
      </h2>
      <h2
        className="text-3xl sm:text-4xl font-extrabold leading-tight bg-clip-text text-transparent"
        style={{ backgroundImage: `linear-gradient(to right, ${C.primary}, ${C.secondary})` }}
      >
        {bottom}
      </h2>
      {sub && <p className="mt-3 text-sm" style={{ color: C.textSecondary }}>{sub}</p>}
    </div>
  );
}

function SectionWrapper({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section className="py-16 border-b" style={{ borderColor: C.border }}>
      <div className="mb-6 px-4 flex items-center gap-3">
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${C.primary}1A`, color: C.primary }}>
          {id}
        </span>
        <span className="text-lg font-bold" style={{ color: C.text }}>{label}</span>
      </div>
      <div className="relative overflow-hidden rounded-3xl mx-4 p-8 sm:p-12" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
        {children}
      </div>
    </section>
  );
}

// ================ 10 LAYOUT VARIATIONS ================

// V1: Classic Side-by-Side — 3 phones straight, text above
function V1() {
  return (
    <SectionWrapper id="V1" label="Classic Side-by-Side">
      <div className="text-center mb-10">
        <Headline top="Scan Documents" bottom="Beautifully" sub="The fastest document scanner for iPhone." />
      </div>
      <div className="flex justify-center gap-6 flex-wrap">
        <Phone width={200}><DocumentsScreenMockup /></Phone>
        <Phone width={200}><ScanScreenMockup /></Phone>
        <Phone width={200}><SettingsScreenMockup /></Phone>
      </div>
    </SectionWrapper>
  );
}

// V2: Tilted Duo — 2 phones tilted, overlapping
function V2() {
  return (
    <SectionWrapper id="V2" label="Tilted Duo (Overlapping)">
      <div className="flex items-center justify-center min-h-[500px] relative">
        <Phone width={220} style={{ transform: "rotate(-12deg)", zIndex: 1 }} className="absolute left-[15%] sm:left-[25%]">
          <DocumentsScreenMockup />
        </Phone>
        <Phone width={220} style={{ transform: "rotate(8deg)", zIndex: 2 }} className="absolute right-[15%] sm:right-[25%]">
          <ScanScreenMockup />
        </Phone>
      </div>
    </SectionWrapper>
  );
}

// V3: Hero + Features — 1 big phone left, feature list right
function V3() {
  return (
    <SectionWrapper id="V3" label="Hero + Feature List">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <Phone width={250}>
          <DocumentsScreenMockup />
        </Phone>
        <div className="flex-1 space-y-6">
          <Headline top="Your Documents," bottom="Always Ready" />
          {[
            { title: "Instant Scanning", desc: "Point and scan in seconds" },
            { title: "Auto Enhance", desc: "Smart contrast & sharpness" },
            { title: "OCR Text", desc: "Extract text from any document" },
            { title: "15 Languages", desc: "Full localization support" },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${C.primary}1A` }}>
                <span className="text-sm font-bold" style={{ color: C.primary }}>{i + 1}</span>
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: C.text }}>{f.title}</div>
                <div className="text-xs" style={{ color: C.textTertiary }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// V4: Staggered Cascade — 3 phones staggered vertically
function V4() {
  return (
    <SectionWrapper id="V4" label="Staggered Cascade">
      <div className="text-center mb-8">
        <Headline top="Every Screen," bottom="Pixel Perfect" />
      </div>
      <div className="flex justify-center items-start gap-4">
        <Phone width={190} style={{ marginTop: 0 }}><DocumentsScreenMockup /></Phone>
        <Phone width={190} style={{ marginTop: 60 }}><ScanScreenMockup /></Phone>
        <Phone width={190} style={{ marginTop: 120 }}><SettingsScreenMockup /></Phone>
      </div>
    </SectionWrapper>
  );
}

// V5: Split Screen — 2 phones cut in half, merged together
function V5() {
  return (
    <SectionWrapper id="V5" label="Split Screen (Half-and-Half)">
      <div className="text-center mb-8">
        <Headline top="Two Worlds," bottom="One App" />
      </div>
      <div className="flex justify-center">
        <div className="relative w-[280px] h-[580px] rounded-[3rem] overflow-hidden shadow-2xl" style={{ border: `6px solid ${C.border}` }}>
          {/* Left half = Documents */}
          <div className="absolute inset-0 w-1/2 overflow-hidden">
            <div className="w-[280px] h-[580px]">
              <DocumentsScreenMockup />
            </div>
          </div>
          {/* Right half = Scan */}
          <div className="absolute inset-0 left-1/2 w-1/2 overflow-hidden">
            <div className="w-[280px] h-[580px] -ml-[140px]">
              <ScanScreenMockup />
            </div>
          </div>
          {/* Center divider */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -ml-[1px] z-10" style={{ backgroundColor: C.primary }} />
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[100px] h-[28px] rounded-full" style={{ backgroundColor: "#000" }} />
        </div>
      </div>
      <div className="flex justify-center gap-16 mt-4">
        <span className="text-xs font-medium" style={{ color: C.textSecondary }}>Documents</span>
        <span className="text-xs font-medium" style={{ color: C.textSecondary }}>Scanner</span>
      </div>
    </SectionWrapper>
  );
}

// V6: Floating Cards — 1 phone center, floating UI elements around it
function V6() {
  return (
    <SectionWrapper id="V6" label="Floating Cards">
      <div className="flex justify-center relative min-h-[550px]">
        <Phone width={230}>
          <ScanScreenMockup />
        </Phone>
        {/* Floating elements */}
        <div className="absolute top-6 left-4 sm:left-12 rounded-2xl p-3 shadow-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${C.success}1A` }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={C.success} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-semibold" style={{ color: C.text }}>Auto Enhanced</div>
              <div className="text-[9px]" style={{ color: C.textTertiary }}>Quality: High</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-16 right-4 sm:right-12 rounded-2xl p-3 shadow-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${C.primary}1A` }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={C.primary} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364V3" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-semibold" style={{ color: C.text }}>15 Languages</div>
              <div className="text-[9px]" style={{ color: C.textTertiary }}>Full localization</div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 right-4 sm:right-8 -translate-y-1/2 rounded-2xl p-3 shadow-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${C.secondary}1A` }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={C.secondary} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-semibold" style={{ color: C.text }}>PDF Export</div>
              <div className="text-[9px]" style={{ color: C.textTertiary }}>Multi-page docs</div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// V7: Diagonal Flow — 3 phones on a diagonal line, small to big
function V7() {
  return (
    <SectionWrapper id="V7" label="Diagonal Flow">
      <div className="text-center mb-6">
        <Headline top="Designed for" bottom="Every Workflow" />
      </div>
      <div className="flex justify-center items-center gap-2 sm:gap-4">
        <Phone width={160} style={{ transform: "translateY(40px)" }} noGlow><SettingsScreenMockup /></Phone>
        <Phone width={220}><ScanScreenMockup /></Phone>
        <Phone width={160} style={{ transform: "translateY(40px)" }} noGlow><DocumentsScreenMockup /></Phone>
      </div>
    </SectionWrapper>
  );
}

// V8: Perspective 3D — phones angled in 3D perspective
function V8() {
  return (
    <SectionWrapper id="V8" label="3D Perspective">
      <div className="text-center mb-8">
        <Headline top="A New Angle on" bottom="Document Scanning" />
      </div>
      <div className="flex justify-center items-center" style={{ perspective: 1200 }}>
        <Phone width={200} style={{ transform: "rotateY(25deg) translateX(20px)", zIndex: 1 }} noGlow>
          <DocumentsScreenMockup />
        </Phone>
        <Phone width={220} style={{ transform: "rotateY(0deg) translateZ(40px)", zIndex: 3 }}>
          <ScanScreenMockup />
        </Phone>
        <Phone width={200} style={{ transform: "rotateY(-25deg) translateX(-20px)", zIndex: 1 }} noGlow>
          <SettingsScreenMockup />
        </Phone>
      </div>
    </SectionWrapper>
  );
}

// V9: Minimal Solo — single large phone, big headline, gradient bg
function V9() {
  return (
    <SectionWrapper id="V9" label="Minimal Solo">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight" style={{ color: C.text }}>
            Turbo
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${C.primary}, ${C.secondary})` }}>
              Scanner
            </span>
          </h2>
          <p className="mt-4 text-lg" style={{ color: C.textSecondary }}>
            Fast. Beautiful. Powerful.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-semibold text-white" style={{ backgroundImage: `linear-gradient(to right, ${C.primaryDark}, ${C.secondaryDark})` }}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on App Store
          </div>
        </div>
        <Phone width={270}>
          <DocumentsScreenMockup />
        </Phone>
      </div>
    </SectionWrapper>
  );
}

// V10: Magazine Spread — horizontal layout with all 3 phones in a row, large, with captions below each
function V10() {
  return (
    <SectionWrapper id="V10" label="Magazine Spread">
      <div className="text-center mb-10">
        <Headline top="Three Screens," bottom="Endless Possibilities" sub="Scan. Organize. Customize. All in one beautiful app." />
      </div>
      <div className="grid grid-cols-3 gap-4 sm:gap-8">
        {[
          { screen: <DocumentsScreenMockup />, title: "Organize", desc: "All your scans in one place" },
          { screen: <ScanScreenMockup />, title: "Scan", desc: "Lightning-fast capture" },
          { screen: <SettingsScreenMockup />, title: "Customize", desc: "Make it yours" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <Phone width={200} noGlow>{item.screen}</Phone>
            <div className="mt-4 text-center">
              <div className="text-sm font-bold" style={{ color: C.text }}>{item.title}</div>
              <div className="text-xs mt-0.5" style={{ color: C.textTertiary }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ================ GALLERY PAGE ================

export default function GalleryPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b px-6 py-4" style={{ backgroundColor: `${C.bg}EE`, borderColor: C.border, backdropFilter: "blur(20px)" }}>
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: C.text }}>Screenshot Layouts</h1>
            <p className="text-xs" style={{ color: C.textTertiary }}>10 variations — pick your favorite</p>
          </div>
          <a href="/turboscanner" className="text-sm px-4 py-2 rounded-lg" style={{ color: C.primary, border: `1px solid ${C.primary}40` }}>
            Back to Landing
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl">
        <V1 />
        <V2 />
        <V3 />
        <V4 />
        <V5 />
        <V6 />
        <V7 />
        <V8 />
        <V9 />
        <V10 />
      </main>

      <footer className="py-8 text-center text-xs" style={{ color: C.textTertiary }}>
        TurboScanner by OlaaSoft
      </footer>
    </div>
  );
}
