"use client";

import {
  C,
  Phone,
  DocumentsScreenMockup,
  ScanScreenMockup,
  SettingsScreenMockup,
  CropScreenMockup,
  PreviewScreenMockup,
} from "@/components/turboscanner/mockups";

// ---- Shared helpers ----

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

// ---- Split Phone: half of screen A + half of screen B merged in one frame ----

function SplitPhone({ left, right, width = 240 }: { left: React.ReactNode; right: React.ReactNode; width?: number }) {
  const ASPECT = 2.167;
  const height = Math.round(width * ASPECT);
  const radius = Math.round(width * 0.16);
  const borderW = Math.max(2, Math.round(width * 0.018));
  const notchW = Math.round(width * 0.34);
  const notchH = Math.round(width * 0.085);
  const emBase = width * 0.036;

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden"
        style={{
          width,
          height,
          borderRadius: radius,
          border: `${borderW}px solid ${C.border}`,
          backgroundColor: C.bg,
          boxShadow: `0 ${width * 0.08}px ${width * 0.2}px rgba(37, 99, 235, 0.12)`,
          fontSize: emBase,
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-30 rounded-full"
          style={{ width: notchW, height: notchH, top: notchH * 0.3, backgroundColor: "#000" }}
        />
        {/* Left half */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
          <div style={{ width, height, fontSize: emBase }}>{left}</div>
        </div>
        {/* Right half */}
        <div className="absolute inset-0 overflow-hidden" style={{ left: "50%", width: "50%" }}>
          <div style={{ width, height, marginLeft: -width / 2, fontSize: emBase }}>{right}</div>
        </div>
        {/* Divider */}
        <div className="absolute top-0 bottom-0 z-20" style={{ left: "50%", width: 2, marginLeft: -1, backgroundColor: C.primary }} />
      </div>
    </div>
  );
}

// ================ 10 LAYOUT VARIATIONS ================

// V1: Classic Row — 5 phones in a row
function V1() {
  return (
    <SectionWrapper id="V1" label="Classic Five">
      <div className="text-center mb-10">
        <Headline top="Every Screen," bottom="Pixel Perfect" sub="The complete TurboScanner experience." />
      </div>
      <div className="flex justify-center gap-3 flex-wrap">
        <Phone width={140}><DocumentsScreenMockup /></Phone>
        <Phone width={140}><ScanScreenMockup /></Phone>
        <Phone width={140}><CropScreenMockup /></Phone>
        <Phone width={140}><PreviewScreenMockup /></Phone>
        <Phone width={140}><SettingsScreenMockup /></Phone>
      </div>
    </SectionWrapper>
  );
}

// V2: Tilted Duo — 2 angled phones showing half-and-half
function V2() {
  return (
    <SectionWrapper id="V2" label="Tilted Duo (Overlapping)">
      <div className="flex items-center justify-center min-h-[550px] relative">
        <Phone width={200} style={{ transform: "rotate(-12deg)", zIndex: 1 }} className="absolute left-[10%] sm:left-[20%]">
          <DocumentsScreenMockup />
        </Phone>
        <div className="absolute" style={{ transform: "rotate(8deg)", zIndex: 2, right: "10%", position: "absolute" }}>
          <SplitPhone left={<ScanScreenMockup />} right={<CropScreenMockup />} width={200} />
        </div>
      </div>
    </SectionWrapper>
  );
}

// V3: Hero + Features — big phone + feature list + small previews
function V3() {
  return (
    <SectionWrapper id="V3" label="Hero + Feature List">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <Phone width={230}>
          <DocumentsScreenMockup />
        </Phone>
        <div className="flex-1 space-y-5">
          <Headline top="Your Documents," bottom="Always Ready" />
          {[
            { title: "Instant Scanning", desc: "Point and scan in seconds" },
            { title: "Perspective Crop", desc: "Perfect edges every time" },
            { title: "Auto Enhance", desc: "Smart contrast & sharpness" },
            { title: "PDF Export", desc: "Multi-page document support" },
            { title: "15 Languages", desc: "Full localization support" },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${C.primary}1A` }}>
                <span className="text-xs font-bold" style={{ color: C.primary }}>{i + 1}</span>
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

// V4: Staggered Cascade — 5 phones staggered
function V4() {
  return (
    <SectionWrapper id="V4" label="Staggered Cascade">
      <div className="text-center mb-8">
        <Headline top="Five Screens," bottom="One Workflow" />
      </div>
      <div className="flex justify-center items-start gap-2 sm:gap-3">
        <Phone width={130} style={{ marginTop: 0 }} noGlow><DocumentsScreenMockup /></Phone>
        <Phone width={130} style={{ marginTop: 40 }} noGlow><ScanScreenMockup /></Phone>
        <Phone width={130} style={{ marginTop: 80 }}><CropScreenMockup /></Phone>
        <Phone width={130} style={{ marginTop: 40 }} noGlow><PreviewScreenMockup /></Phone>
        <Phone width={130} style={{ marginTop: 0 }} noGlow><SettingsScreenMockup /></Phone>
      </div>
    </SectionWrapper>
  );
}

// V5: Split Screen — half-and-half merged phones
function V5() {
  return (
    <SectionWrapper id="V5" label="Split Screen (Half & Half)">
      <div className="text-center mb-8">
        <Headline top="Two Worlds," bottom="One App" />
      </div>
      <div className="flex justify-center gap-6 flex-wrap">
        <div className="flex flex-col items-center gap-3">
          <SplitPhone left={<DocumentsScreenMockup />} right={<ScanScreenMockup />} width={220} />
          <div className="flex gap-8">
            <span className="text-xs font-medium" style={{ color: C.textSecondary }}>Documents</span>
            <span className="text-xs font-medium" style={{ color: C.textSecondary }}>Scanner</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <SplitPhone left={<CropScreenMockup />} right={<PreviewScreenMockup />} width={220} />
          <div className="flex gap-8">
            <span className="text-xs font-medium" style={{ color: C.textSecondary }}>Crop</span>
            <span className="text-xs font-medium" style={{ color: C.textSecondary }}>Preview</span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// V6: Floating Cards — center phone with floating UI elements
function V6() {
  return (
    <SectionWrapper id="V6" label="Floating Cards">
      <div className="flex justify-center relative min-h-[550px]">
        <Phone width={210}>
          <ScanScreenMockup />
        </Phone>
        {/* Floating elements */}
        <div className="absolute top-6 left-4 sm:left-10 rounded-2xl p-3 shadow-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${C.success}1A` }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.success} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-semibold" style={{ color: C.text }}>Auto Enhanced</div>
              <div className="text-[8px]" style={{ color: C.textTertiary }}>Quality: High</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-20 right-4 sm:right-10 rounded-2xl p-3 shadow-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${C.primary}1A` }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.primary} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-semibold" style={{ color: C.text }}>Smart Crop</div>
              <div className="text-[8px]" style={{ color: C.textTertiary }}>Perspective correction</div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 right-4 sm:right-8 -translate-y-1/2 rounded-2xl p-3 shadow-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${C.secondary}1A` }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.secondary} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-semibold" style={{ color: C.text }}>PDF Export</div>
              <div className="text-[8px]" style={{ color: C.textTertiary }}>Multi-page docs</div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// V7: Diagonal Flow — small-big-small with 5 phones
function V7() {
  return (
    <SectionWrapper id="V7" label="Diagonal Flow">
      <div className="text-center mb-6">
        <Headline top="Designed for" bottom="Every Workflow" />
      </div>
      <div className="flex justify-center items-center gap-1 sm:gap-3">
        <Phone width={120} style={{ transform: "translateY(30px)" }} noGlow><SettingsScreenMockup /></Phone>
        <Phone width={140} style={{ transform: "translateY(15px)" }} noGlow><PreviewScreenMockup /></Phone>
        <Phone width={180}><ScanScreenMockup /></Phone>
        <Phone width={140} style={{ transform: "translateY(15px)" }} noGlow><CropScreenMockup /></Phone>
        <Phone width={120} style={{ transform: "translateY(30px)" }} noGlow><DocumentsScreenMockup /></Phone>
      </div>
    </SectionWrapper>
  );
}

// V8: 3D Perspective — phones in 3D perspective row
function V8() {
  return (
    <SectionWrapper id="V8" label="3D Perspective">
      <div className="text-center mb-8">
        <Headline top="A New Angle on" bottom="Document Scanning" />
      </div>
      <div className="flex justify-center items-center" style={{ perspective: 1200 }}>
        <Phone width={150} style={{ transform: "rotateY(30deg) translateX(10px)", zIndex: 1 }} noGlow>
          <DocumentsScreenMockup />
        </Phone>
        <Phone width={160} style={{ transform: "rotateY(15deg)", zIndex: 2 }} noGlow>
          <CropScreenMockup />
        </Phone>
        <Phone width={180} style={{ transform: "rotateY(0deg) translateZ(30px)", zIndex: 3 }}>
          <ScanScreenMockup />
        </Phone>
        <Phone width={160} style={{ transform: "rotateY(-15deg)", zIndex: 2 }} noGlow>
          <PreviewScreenMockup />
        </Phone>
        <Phone width={150} style={{ transform: "rotateY(-30deg) translateX(-10px)", zIndex: 1 }} noGlow>
          <SettingsScreenMockup />
        </Phone>
      </div>
    </SectionWrapper>
  );
}

// V9: Minimal Solo + Split — one big phone + one split phone
function V9() {
  return (
    <SectionWrapper id="V9" label="Minimal Duo">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight" style={{ color: C.text }}>
            Turbo
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${C.primary}, ${C.secondary})` }}>
              Scanner
            </span>
          </h2>
          <p className="mt-4 text-lg" style={{ color: C.textSecondary }}>
            Scan. Crop. Preview. Share.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-semibold text-white" style={{ backgroundImage: `linear-gradient(to right, ${C.primaryDark}, ${C.secondaryDark})` }}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on App Store
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Phone width={200}>
            <DocumentsScreenMockup />
          </Phone>
          <SplitPhone left={<CropScreenMockup />} right={<PreviewScreenMockup />} width={200} />
        </div>
      </div>
    </SectionWrapper>
  );
}

// V10: Magazine Spread — 5 phones with captions in a grid
function V10() {
  return (
    <SectionWrapper id="V10" label="Magazine Spread">
      <div className="text-center mb-10">
        <Headline top="Five Screens," bottom="Endless Possibilities" sub="Scan. Crop. Preview. Organize. Customize." />
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {[
          { screen: <DocumentsScreenMockup />, title: "Organize", desc: "All your scans" },
          { screen: <ScanScreenMockup />, title: "Scan", desc: "Lightning capture" },
          { screen: <CropScreenMockup />, title: "Crop", desc: "Perfect edges" },
          { screen: <PreviewScreenMockup />, title: "Preview", desc: "Review & share" },
          { screen: <SettingsScreenMockup />, title: "Settings", desc: "Make it yours" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <Phone width={150} noGlow>{item.screen}</Phone>
            <div className="mt-3 text-center">
              <div className="text-xs font-bold" style={{ color: C.text }}>{item.title}</div>
              <div className="text-[10px] mt-0.5" style={{ color: C.textTertiary }}>{item.desc}</div>
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
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: C.text }}>Screenshot Layouts</h1>
            <p className="text-xs" style={{ color: C.textTertiary }}>10 variations · 5 screens each</p>
          </div>
          <a href="/turboscanner" className="text-sm px-4 py-2 rounded-lg" style={{ color: C.primary, border: `1px solid ${C.primary}40` }}>
            Back to Landing
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
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
