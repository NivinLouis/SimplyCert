'use client';

import AppHeader from '@/components/branding/AppHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  authorDescription,
  authorGithub,
  authorLinkedIn,
  authorName,
} from '@/lib/site';
import { useCertStore } from '@/store/useCertStore';
import {
  ArrowRight,
  Check,
  CircleDashed,
  FileImage,
  FileSpreadsheet,
  Lock,
  MousePointerSquareDashed,
  ScanText,
  Sparkles,
  UserRoundCheck,
  Zap,
} from 'lucide-react';

const workflow = [
  {
    title: 'Upload your own certificate template',
    description: 'Bring a finished PNG, JPG, or PDF design. SimplyCert does not lock you into pre-made templates.',
    icon: FileImage,
  },
  {
    title: 'Add names from CSV, paste, or manual entry',
    description: 'Generate certificates from CSV, Excel exports, or a quick pasted attendee list.',
    icon: FileSpreadsheet,
  },
  {
    title: 'Draw a box where the name should go',
    description: 'Mark the text boundary visually on the certificate preview. No coordinates, no guesswork.',
    icon: MousePointerSquareDashed,
  },
  {
    title: 'Export personalized PDF certificates',
    description: 'Download each attendee certificate as an individual PDF inside one ZIP file.',
    icon: ScanText,
  },
];

const proofPoints = [
  'Upload your own design',
  'Generate certificates from CSV',
  'Runs locally in your browser',
];

const audiences = [
  'Workshop and bootcamp organizers',
  'Conference and seminar managers',
  'Online course instructors',
  'HR and L&D teams issuing completion records',
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SimplyCert',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: authorName,
    sameAs: [authorGithub, authorLinkedIn],
    description: authorDescription,
  },
  description:
    'Free browser-based bulk certificate generator that lets you upload your own design, add names from CSV, draw the text area, and export personalized PDF certificates.',
  featureList: [
    'Bulk certificate generator',
    'Upload your own certificate template',
    'Generate certificates from CSV',
    'No signup required',
    'Client-side processing with no data upload',
    'Personalized PDF certificate export',
  ],
};

export default function LandingPage() {
  const setStep = useCertStore((state) => state.setStep);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.06_290)_0,transparent_34%),radial-gradient(circle_at_85%_15%,oklch(0.92_0.05_250)_0,transparent_30%),linear-gradient(180deg,oklch(0.99_0.002_280),oklch(0.97_0.006_280))]" />
        <AppHeader />

        <section className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-10 md:px-8 md:py-16 lg:gap-18">
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="h-8 rounded-full px-3 text-sm" variant="secondary">
                  <Sparkles className="size-3.5" />
                  No signup. No watermark. No data upload.
                </Badge>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-balance sm:text-5xl lg:text-[4.25rem] lg:leading-[0.96]">
                Generate Batch Certificates From Your Design
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Upload your certificate design. Draw a box where the name goes. Done.
                SimplyCert is a web-based batch certificate generator for workshops,
                webinars, seminars, courses, and training teams that need personalized PDF
                certificates without rebuilding designs inside rigid templates.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:opacity-95"
                  onClick={() => setStep(1)}
                >
                  Start Creating Now
                  <ArrowRight className="size-4" />
                </Button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {proofPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/60 bg-card/65 px-4 py-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white">
                        <Check className="size-3" />
                      </span>
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden min-h-[430px] lg:block">
              <div className="absolute left-12 top-10 h-40 w-40 rounded-full bg-violet-500/12 blur-3xl" />
              <div className="absolute bottom-8 right-10 h-44 w-44 rounded-full bg-sky-400/12 blur-3xl" />

              <div className="absolute left-14 top-12 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-violet-200/70 bg-white/70 shadow-lg shadow-violet-500/10 backdrop-blur-sm">
                <FileImage className="size-9 text-violet-600" />
              </div>

              <div className="absolute right-14 top-24 flex h-28 w-28 items-center justify-center rounded-[2.25rem] border border-violet-200/70 bg-white/75 shadow-lg shadow-violet-500/10 backdrop-blur-sm">
                <FileSpreadsheet className="size-10 text-violet-600" />
              </div>

              <div className="absolute bottom-18 left-20 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-violet-200/70 bg-white/70 shadow-lg shadow-violet-500/10 backdrop-blur-sm">
                <ScanText className="size-9 text-violet-600" />
              </div>

              <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-dashed border-violet-300/80 bg-white/45 backdrop-blur-sm">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-500/25">
                  <MousePointerSquareDashed className="size-12" />
                </div>
              </div>

              <div className="absolute left-[8.7rem] top-[8.7rem] h-28 w-28 rounded-full border border-dashed border-violet-300/70" />
              <div className="absolute right-[8.5rem] top-[11.2rem] h-24 w-24 rounded-full border border-dashed border-violet-300/60" />
              <div className="absolute bottom-[6.2rem] left-[11.2rem] h-24 w-24 rounded-full border border-dashed border-violet-300/60" />

              <div className="absolute left-[9.5rem] top-[9.5rem] h-px w-36 rotate-[18deg] bg-gradient-to-r from-violet-300/20 via-violet-400/70 to-violet-300/20" />
              <div className="absolute right-[11.5rem] top-[12.8rem] h-px w-28 rotate-[144deg] bg-gradient-to-r from-violet-300/20 via-violet-400/70 to-violet-300/20" />
              <div className="absolute bottom-[9.9rem] left-[12.8rem] h-px w-28 rotate-[-42deg] bg-gradient-to-r from-violet-300/20 via-violet-400/70 to-violet-300/20" />

              <div className="absolute bottom-9 right-16 rounded-full border border-border/60 bg-white/70 px-4 py-2 text-sm font-medium text-foreground shadow-lg shadow-violet-500/5 backdrop-blur-sm">
                Batch certificate workflow
              </div>

              <div className="absolute left-32 bottom-24 text-violet-500/70">
                <CircleDashed className="size-7" />
              </div>
            </div>
          </div>

          <div id="how-it-works" className="grid gap-5 lg:grid-cols-4">
            {workflow.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[1.75rem] border border-border/60 bg-card/75 p-5 shadow-lg shadow-black/3 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Step {index + 1}
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </article>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[2rem] border border-border/60 bg-card/80 p-6 backdrop-blur-sm">
              <Badge variant="outline" className="h-7 rounded-full px-3 text-sm">
                Why organizers switch
              </Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                The data problem behind certificate design work
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Typing names into Canva one by one feels like a design task, but it is
                really a repetitive data-entry problem. SimplyCert separates the creative
                work from the tedious work: you keep your finished design, then generate
                personalized certificates at scale from a name list in one browser session.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/60 bg-background/70 p-5">
                  <div className="flex items-center gap-3">
                    <Zap className="size-5 text-violet-600" />
                    <h3 className="font-semibold">Canva alternative for bulk certificates</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Skip the repeat-export cycle. Upload one finished design and generate
                    personalized PDFs from CSV without rebuilding your certificate in another editor.
                  </p>
                </div>
                <div className="rounded-3xl border border-border/60 bg-background/70 p-5">
                  <div className="flex items-center gap-3">
                    <Lock className="size-5 text-violet-600" />
                    <h3 className="font-semibold">Privacy-first by default</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Every certificate render happens in your browser. No attendee list, design
                    file, or generated output is uploaded to a third-party server.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-border/60 bg-[linear-gradient(180deg,rgba(124,58,237,0.06),rgba(255,255,255,0.86))] p-6">
              <Badge variant="secondary" className="h-7 rounded-full px-3 text-sm">
                Who it&apos;s for
              </Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Built for anyone issuing certificates in batches
              </h2>

              <div className="mt-6 space-y-3">
                {audiences.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm"
                  >
                    <div className="flex size-9 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-700">
                      <UserRoundCheck className="size-4" />
                    </div>
                    <p className="text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-[2rem] border border-border/60 bg-slate-950 px-6 py-8 text-slate-50 shadow-2xl shadow-slate-950/10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">
                  Free e-certificate generator
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  Upload your design, add names from CSV, and export personalized PDFs.
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  No account required. No subscription. No watermark. Just a fast workshop
                  certificate generator that runs on your machine.
                </p>
              </div>

              <Button
                size="lg"
                className="h-11 rounded-xl bg-white px-5 font-semibold text-slate-950 hover:bg-slate-100"
                onClick={() => setStep(1)}
              >
                Open the Generator
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </section>

          <section className="flex justify-center">
            <div className="rounded-full border border-border/60 bg-card/70 px-5 py-3 text-center text-sm text-muted-foreground backdrop-blur-sm">
              Developed by <span className="font-semibold text-foreground">{authorName}</span> from{' '}
              <span className="font-semibold text-foreground">Vidya Academy of Science and Technology</span>
            </div>
          </section>
        </section>
      </div>
    </>
  );
}
