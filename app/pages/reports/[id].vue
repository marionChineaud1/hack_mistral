<script setup lang="ts">
import type { ConfidenceLevel, EvidenceStance, ReportDto } from "~~/shared/types/report";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { data: report, error, status } = await useFetch<ReportDto>(() => `/api/reports/${String(route.params.id)}`);
const canonicalUrl = computed(() => {
  const baseUrl = String(runtimeConfig.public.siteUrl ?? "").replace(/\/$/, "");
  return baseUrl ? `${baseUrl}/reports/${String(route.params.id)}` : "";
});

useHead(() => ({
  htmlAttrs: { lang: "en" },
  title: report.value ? `${report.value.title} · Vera` : "Report · Vera",
  meta: [
    { name: "description", content: report.value?.conclusion.summary ?? "Evidence-led context from Vera" },
    { property: "og:title", content: report.value ? `${report.value.title} · Vera` : "Report · Vera" },
    { property: "og:description", content: report.value?.conclusion.summary ?? "Evidence-led context from Vera" },
  ],
  link: canonicalUrl.value ? [{ rel: "canonical", href: canonicalUrl.value }] : [],
}));

const confidenceLabels: Record<ConfidenceLevel, string> = {
  high: "Strong foundation",
  moderate: "Important context",
  limitation: "Limitation",
};
const evidenceMeta: Record<EvidenceStance, { title: string; icon: string; borderClass: string; titleClass: string }> = {
  support: { title: "What supports the claim", icon: "ph:check-circle", borderClass: "border-emerald-200", titleClass: "text-emerald-900" },
  contradict: { title: "What qualifies or challenges it", icon: "ph:scales", borderClass: "border-amber-200", titleClass: "text-amber-900" },
  unverified: { title: "What remains unverified", icon: "ph:question", borderClass: "border-slate-300", titleClass: "text-slate-950" },
};
const confidenceClasses: Record<ConfidenceLevel, string> = {
  high: "bg-emerald-50 text-emerald-800",
  moderate: "bg-amber-50 text-amber-800",
  limitation: "bg-slate-100 text-slate-700",
};
const detailSections = [
  { id: "chronologie", label: "Timeline" },
  { id: "contexte", label: "Missing context" },
  { id: "sources", label: "All sources" },
  { id: "evolution", label: "What could change this reading" },
];
const notice = ref("");
const investigationCopied = ref(false);
const followUpCopied = ref(false);
let noticeTimeout: number | undefined;
let investigationCopiedTimeout: number | undefined;
let followUpCopiedTimeout: number | undefined;

function announce(message: string) {
  notice.value = message;
  if (noticeTimeout) window.clearTimeout(noticeTimeout);
  noticeTimeout = window.setTimeout(() => { notice.value = ""; }, 3_000);
}

async function copyText(text: string, successMessage: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    announce(successMessage);
    return true;
  }
  catch {
    announce("Could not copy to your clipboard. Please try again.");
    return false;
  }
}

function investigationPrompt() {
  if (!report.value) return "";
  const supporting = report.value.evidence.support.map(item => `- ${item.title}: ${item.detail}`).join("\n");
  const limitations = [...report.value.evidence.contradict, ...report.value.evidence.unverified].map(item => `- ${item.title}: ${item.detail}`).join("\n");
  return `# Continue investigating this Vera report\n\n## Report\n- Title: ${report.value.title}\n- URL: ${window.location.href}\n\n## Quick reading\n- Verdict: ${report.value.conclusion.label}\n- Why: ${report.value.conclusion.summary}\n\n## Supporting evidence\n${supporting || "- No supporting evidence is listed."}\n\n## Qualifications and open questions\n${limitations || "- No qualifications or open questions are listed."}\n\nContinue the investigation using French-language sources. Cite every source, distinguish verified facts from interpretations, and do not perform external actions without confirmation.`;
}

async function copyInvestigationPrompt() {
  if (!await copyText(investigationPrompt(), "Investigation handoff copied. Paste it into any AI chat.")) return;
  investigationCopied.value = true;
  if (investigationCopiedTimeout) window.clearTimeout(investigationCopiedTimeout);
  investigationCopiedTimeout = window.setTimeout(() => { investigationCopied.value = false; }, 2_000);
}

function followUpPrompt(followUp: NonNullable<ReportDto["followUp"]>) {
  if (!report.value) return "";
  return `# Monitor this Vera report\n\n- Report: ${report.value.title}\n- URL: ${window.location.href}\n- Suggested follow-up: ${followUp.suggestion}\n- Suggested frequency: ${followUp.frequency}\n\nSearch French-language sources for relevant updates. Cite every source, explain what changed, and distinguish verified facts from interpretation. Do not perform external actions without confirmation.`;
}

async function copyFollowUpPrompt(followUp: NonNullable<ReportDto["followUp"]>) {
  if (!await copyText(followUpPrompt(followUp), "Follow-up prompt copied. Paste it into any AI chat.")) return;
  followUpCopied.value = true;
  if (followUpCopiedTimeout) window.clearTimeout(followUpCopiedTimeout);
  followUpCopiedTimeout = window.setTimeout(() => { followUpCopied.value = false; }, 2_000);
}

function copyReportLink() {
  void copyText(window.location.href, "Report link copied.");
}

async function shareReport() {
  if (!report.value) return;
  const shareData = { title: report.value.title, text: `${report.value.conclusion.label}: ${report.value.conclusion.summary}`, url: window.location.href };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      announce("Share sheet opened.");
      return;
    }
    await copyText(window.location.href, "Sharing is not available here, so the report link was copied.");
  }
  catch (shareError) {
    if ((shareError as DOMException).name !== "AbortError") announce("Could not share this report. Please try again.");
  }
}

function errorMessage() {
  if (error.value?.statusCode === 404) return "This report does not exist or is no longer available.";
  if (error.value?.statusCode === 400) return "This report URL contains an invalid identifier.";
  return "This report cannot be loaded right now.";
}

function formatDate(date: string | null) {
  if (!date) return "Evidence gap";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

</script>

<template>
  <div class="min-h-screen bg-[#fbfaff] font-sans text-slate-800 antialiased">
    <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-5 sm:px-8">
        <NuxtLink to="/" class="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-slate-950" aria-label="Vera home">
          <span class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#d8d3f0] bg-white" aria-hidden="true">
            <img src="/north-header-logo.png" alt="" class="h-7 w-7 object-contain object-center" />
          </span>
          Vera
        </NuxtLink>
        <span class="min-w-0 truncate border-l border-slate-200 pl-4 text-sm text-slate-500">{{ report?.title ?? "Evidence report" }}</span>
      </div>
    </header>

    <main id="content" class="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
      <div v-if="status === 'pending'" class="mx-auto max-w-2xl py-24 text-center" role="status">
        <Icon name="ph:circle-notch" class="mx-auto size-7 animate-spin text-[#271f58]" aria-hidden="true" />
        <p class="mt-4 text-slate-600">Loading report…</p>
      </div>

      <section v-else-if="error || !report" class="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <Icon name="ph:file-x" class="mx-auto size-9 text-rose-700" aria-hidden="true" />
        <h1 class="mt-4 text-2xl font-semibold text-slate-950">Report unavailable</h1>
        <p class="mt-3 text-slate-600">{{ errorMessage() }}</p>
      </section>

      <article v-else class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-16">
        <div class="min-w-0">
          <header>
            <div class="flex flex-wrap items-center gap-3">
              <span v-if="report.isDemo" class="inline-flex items-center rounded-full border border-[#d8d3f0] bg-[#f1effb] px-3 py-1 text-xs font-semibold text-[#33286f]">Demonstration report</span>
              <span class="text-sm text-slate-500">{{ report.claim.date }} · {{ report.claim.publisher }}</span>
            </div>
            <p class="mt-8 text-xs font-bold uppercase tracking-[0.14em] text-[#271f58]">Vera evidence report</p>
            <h1 class="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-5xl">
              {{ report.title }}
            </h1>
            <p v-if="report.supersedesReportId || report.supersededByReportId" class="mt-5 inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm leading-6 text-sky-950">
              <Icon name="ph:arrow-bend-up-right" class="size-4 shrink-0" aria-hidden="true" />
              <NuxtLink v-if="report.supersededByReportId" :to="`/reports/${report.supersededByReportId}`" class="font-semibold underline decoration-sky-300 underline-offset-2 hover:decoration-sky-800">A newer version of this report is available.</NuxtLink>
              <NuxtLink v-else-if="report.supersedesReportId" :to="`/reports/${report.supersedesReportId}`" class="font-semibold underline decoration-sky-300 underline-offset-2 hover:decoration-sky-800">This report revises an earlier version.</NuxtLink>
            </p>
          </header>

          <section id="claim" class="mt-10 scroll-mt-20 rounded-2xl border border-[#d8d3f0] bg-white p-6 shadow-[0_18px_60px_rgba(39,31,88,0.08)] sm:p-8" aria-labelledby="claim-title">
            <p id="claim-title" class="text-xs font-bold uppercase tracking-[0.14em] text-[#271f58]">Claim under review</p>
            <blockquote class="mt-5 text-xl font-medium leading-9 text-slate-900 sm:text-2xl">{{ report.claim.quote }}</blockquote>
            <p class="mt-3 text-sm text-slate-500">Translated from French</p>
            <p class="mt-6 text-sm leading-6 text-slate-600">
              <strong class="text-slate-900">{{ report.claim.author }}</strong>, {{ report.claim.role }} · {{ report.claim.publisher }}
            </p>
            <details class="mt-6 border-t border-[#e9e6f7] pt-4 text-sm text-slate-700">
              <summary class="cursor-pointer font-semibold text-[#33286f]">Separate checkable statements from interpretation</summary>
              <div class="mt-4 grid gap-5 sm:grid-cols-2">
                <div><h3 class="font-semibold text-slate-900">Checkable statements</h3><ol class="mt-2 list-decimal space-y-2 pl-5"><li v-for="item in report.claim.verifiableClaims" :key="item">{{ item }}</li></ol></div>
                <div><h3 class="font-semibold text-slate-900">Opinion or interpretation</h3><ul class="mt-2 list-disc space-y-2 pl-5"><li v-for="item in report.claim.interpretations" :key="item">{{ item }}</li></ul></div>
              </div>
            </details>
          </section>

          <section id="conclusion" class="mt-14 scroll-mt-20" aria-labelledby="conclusion-title">
            <p class="text-xs font-bold uppercase tracking-[0.14em] text-[#271f58]">Quick conclusion</p>
            <div class="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8">
              <div class="flex items-start gap-4">
                <Icon name="ph:compass-fill" class="mt-1 size-6 shrink-0 text-amber-700" aria-hidden="true" />
                <div><p class="text-sm font-semibold text-amber-900">Verdict</p><h2 id="conclusion-title" class="mt-1 text-xl font-semibold leading-8 text-slate-950">{{ report.conclusion.label }}</h2><p class="mt-4 text-sm font-semibold text-amber-900">Why</p><p class="mt-1 leading-7 text-slate-700">{{ report.conclusion.summary }}</p><p class="mt-5 text-sm font-semibold text-amber-900">Key limitation</p><p class="mt-1 leading-7 text-slate-700">{{ report.evidence.unverified[0]?.detail ?? "The report identifies no unresolved evidence gaps." }}</p></div>
              </div>
            </div>
            <div class="mt-5 flex flex-wrap gap-3">
              <button type="button" :class="['inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#19133f]', investigationCopied ? 'scale-[1.03] bg-emerald-700 shadow-lg shadow-emerald-900/20' : 'bg-[#271f58]']" @click="copyInvestigationPrompt"><Icon :name="investigationCopied ? 'ph:check-bold' : 'ph:chat-teardrop-text'" :class="['size-4', investigationCopied ? 'animate-[bounce_0.45s_ease-out]' : '']" aria-hidden="true" />{{ investigationCopied ? "Ready to paste" : "Continue investigating" }}</button>
              <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#33286f] hover:text-[#33286f]" @click="shareReport"><Icon name="ph:share-network" class="size-4" aria-hidden="true" />Share report</button>
            </div>
          </section>

          <ReportSourceCarousel class="mt-14" :sources="report.sources" />

          <section id="confidence" class="mt-14 scroll-mt-20" aria-labelledby="confidence-title">
            <p class="text-xs font-bold uppercase tracking-[0.14em] text-[#271f58]">Explained confidence</p>
            <h2 id="confidence-title" class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">What makes this reading stronger or weaker</h2>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              <article v-for="item in report.confidence" :key="item.id" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <span :class="['inline-flex rounded-full px-2.5 py-1 text-xs font-bold', confidenceClasses[item.level]]">{{ confidenceLabels[item.level] }}</span>
                <h3 class="mt-3 font-semibold text-slate-950">{{ item.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.detail }}</p>
                <ReportCitations :sources="item.sources" />
              </article>
            </div>
          </section>

          <section id="evidence" class="mt-14 scroll-mt-20" aria-labelledby="evidence-title">
            <p class="text-xs font-bold uppercase tracking-[0.14em] text-[#271f58]">Evidence at a glance</p>
            <h2 id="evidence-title" class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Read the argument in both directions</h2>
            <div class="mt-6 grid gap-6 lg:grid-cols-2">
              <div v-for="stance in (['support', 'contradict'] as EvidenceStance[])" :key="stance" :class="['rounded-2xl border bg-white p-6 shadow-sm', evidenceMeta[stance].borderClass]">
                <h3 :class="['flex items-center gap-2 text-lg font-semibold', evidenceMeta[stance].titleClass]"><Icon :name="evidenceMeta[stance].icon" class="size-5" aria-hidden="true" />{{ evidenceMeta[stance].title }}</h3>
                <div class="mt-3 divide-y divide-slate-200/80">
                  <article v-for="item in report.evidence[stance]" :key="item.id" class="py-5 first:pt-2 last:pb-1">
                    <h4 class="font-semibold text-slate-900">{{ item.title }}</h4><p class="mt-2 leading-7 text-slate-600">{{ item.detail }}</p><ReportCitations :sources="item.sources" />
                  </article>
                </div>
              </div>
            </div>
            <div :class="['mt-6 rounded-2xl border bg-slate-50/80 p-6 shadow-sm', evidenceMeta.unverified.borderClass]">
              <h3 :class="['flex items-center gap-2 text-lg font-semibold', evidenceMeta.unverified.titleClass]"><Icon :name="evidenceMeta.unverified.icon" class="size-5" aria-hidden="true" />{{ evidenceMeta.unverified.title }}</h3>
              <div class="mt-3 divide-y divide-slate-200/80">
                <article v-for="item in report.evidence.unverified" :key="item.id" class="py-5 first:pt-2 last:pb-1"><h4 class="font-semibold text-slate-900">{{ item.title }}</h4><p class="mt-2 leading-7 text-slate-600">{{ item.detail }}</p><ReportCitations :sources="item.sources" /></article>
              </div>
            </div>
          </section>

          <section id="language-choices" class="mt-14 scroll-mt-20" aria-labelledby="language-choices-title">
            <div class="rounded-2xl border border-[#d8d3f0] bg-[#f6f5fc] p-6 shadow-sm sm:p-8">
              <div class="flex items-start gap-4">
                <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-[#271f58] text-white"><Icon name="ph:quotes" class="size-5" aria-hidden="true" /></span>
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.14em] text-[#33286f]">Language choices</p>
                  <h2 id="language-choices-title" class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">How the wording shapes the message</h2>
                  <p class="mt-3 max-w-3xl leading-7 text-slate-700">This section looks at framing and presentation, independently of whether the underlying claim is true.</p>
                </div>
              </div>
              <div class="mt-7 grid gap-4 sm:grid-cols-2">
                <article v-for="item in report.rhetoric" :key="item.id" class="rounded-xl border border-white bg-white/90 p-5 shadow-sm"><h3 class="font-semibold text-slate-950">{{ item.title }}</h3><p class="mt-2 text-sm leading-6 text-slate-600">{{ item.detail }}</p><ReportCitations :sources="item.sources" /></article>
              </div>
              <p v-if="report.rhetoricDisclaimer" class="mt-6 border-t border-[#d8d3f0] pt-5 text-sm italic leading-6 text-slate-600">{{ report.rhetoricDisclaimer }}</p>
            </div>
          </section>

          <div class="mt-14 space-y-4">
            <ReportDisclosure id="chronologie" title="Origin and timeline" eyebrow="Timeline" :count="report.timeline.length">
              <ol class="relative ml-2 border-l border-slate-200 pl-7">
                <li v-for="item in report.timeline" :key="item.id" class="relative pb-7 last:pb-0">
                  <span :class="['absolute -left-[2.05rem] top-1.5 size-3 rounded-full ring-4 ring-white', item.kind === 'gap' ? 'bg-amber-500' : 'bg-[#271f58]']" />
                  <p class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ formatDate(item.date) }}</p><h3 class="mt-1 font-semibold text-slate-950">{{ item.title }}</h3><p class="mt-2 leading-7 text-slate-600">{{ item.detail }}</p><ReportCitations :sources="item.sources" />
                </li>
              </ol>
            </ReportDisclosure>

            <ReportDisclosure id="contexte" title="Missing context" eyebrow="For a fuller reading" :count="report.missingContext.length">
              <div class="space-y-7"><article v-for="item in report.missingContext" :key="item.id"><h3 class="font-semibold text-slate-950">{{ item.title }}</h3><p class="mt-2 leading-7 text-slate-600">{{ item.detail }}</p><ReportCitations :sources="item.sources" /></article></div>
            </ReportDisclosure>

            <ReportDisclosure id="sources" title="All sources" eyebrow="Source list" :count="report.sources.length">
              <div v-for="kind in (['primary', 'secondary'] as const)" :key="kind" class="mb-8 last:mb-0">
                <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500">{{ kind === 'primary' ? 'Primary sources' : 'Secondary sources' }}</h3>
                <ul class="mt-3 divide-y divide-slate-200"><li v-for="source in report.sources.filter(item => item.kind === kind)" :key="source.id" class="py-4"><a :href="source.url" target="_blank" rel="noopener noreferrer" class="group flex items-start justify-between gap-4 font-semibold text-[#33286f] hover:text-[#19133f]"><span><span class="block">{{ source.title }}</span><span class="mt-1 block text-sm font-normal text-slate-500">{{ source.publisher }}<template v-if="source.note"> · {{ source.note }}</template></span></span><Icon name="ph:arrow-up-right" class="mt-1 size-4 shrink-0" aria-hidden="true" /></a></li></ul>
              </div>
            </ReportDisclosure>

            <ReportDisclosure id="evolution" title="What could change this reading" eyebrow="Reassessment" :count="report.changeFactors.length">
              <ol class="space-y-5"><li v-for="(item, index) in report.changeFactors" :key="item.id" class="flex gap-4"><span class="grid size-7 shrink-0 place-items-center rounded-full bg-[#f1effb] text-sm font-bold text-[#33286f]">{{ index + 1 }}</span><div><h3 class="font-semibold text-slate-950">{{ item.title }}</h3><p class="mt-1 leading-7 text-slate-600">{{ item.detail }}</p></div></li></ol>
            </ReportDisclosure>
          </div>

          <aside v-if="report.followUp" class="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8" aria-labelledby="follow-up-title">
            <div class="flex items-start gap-4">
              <Icon name="ph:calendar-check" class="mt-1 size-6 shrink-0 text-emerald-700" aria-hidden="true" />
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Suggested follow-up</p>
                <h2 id="follow-up-title" class="mt-2 text-lg font-semibold text-slate-950">Keep this question under review</h2>
                <p class="mt-3 leading-7 text-slate-700">{{ report.followUp.suggestion }}</p>
                <p class="mt-3 text-sm font-semibold text-emerald-900">Suggested frequency: {{ report.followUp.frequency }}</p>
                <button type="button" :class="['mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-900', followUpCopied ? 'scale-[1.03] bg-emerald-700 shadow-lg shadow-emerald-900/20' : 'bg-emerald-800']" @click="copyFollowUpPrompt(report.followUp)">
                  <Icon :name="followUpCopied ? 'ph:check-bold' : 'ph:copy'" :class="['size-4', followUpCopied ? 'animate-[bounce_0.45s_ease-out]' : '']" aria-hidden="true" />
                  {{ followUpCopied ? "Ready to paste" : "Copy follow-up prompt" }}
                </button>
                <p class="mt-3 text-sm leading-6 text-emerald-900">Use it in any AI chat to continue monitoring this report with French-language sources.</p>
              </div>
            </div>
          </aside>

          <aside class="mt-10 rounded-2xl border border-[#d8d3f0] bg-[#f6f5fc] p-6 sm:p-8" aria-labelledby="vera-disclosure-title">
            <div class="flex items-start gap-4"><Icon name="ph:info" class="mt-1 size-6 shrink-0 text-[#33286f]" aria-hidden="true" /><div><p class="text-xs font-bold uppercase tracking-[0.14em] text-[#33286f]">How to read Vera</p><h2 id="vera-disclosure-title" class="mt-2 text-lg font-semibold text-slate-950">Prepared with Vera</h2><p class="mt-3 leading-7 text-slate-700">Vera organises evidence and links to original sources. It does not replace reporting, source review, or your own judgment.</p></div></div>
          </aside>
        </div>

        <aside class="hidden lg:block" aria-label="Sommaire du rapport">
          <nav class="sticky top-24 border-l border-slate-200 pl-5">
            <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">In this report</p>
            <ul class="mt-4 space-y-3 text-sm"><li><a href="#claim" class="text-slate-500 transition hover:text-[#33286f]">Claim</a></li><li><a href="#conclusion" class="text-slate-500 transition hover:text-[#33286f]">Quick conclusion</a></li><li><a href="#confidence" class="text-slate-500 transition hover:text-[#33286f]">Confidence</a></li><li><a href="#evidence" class="text-slate-500 transition hover:text-[#33286f]">Evidence</a></li><li><a href="#language-choices" class="text-slate-500 transition hover:text-[#33286f]">Language choices</a></li><li v-for="section in detailSections" :key="section.id"><a :href="`#${section.id}`" class="text-slate-500 transition hover:text-[#33286f]">{{ section.label }}</a></li></ul>
          </nav>
        </aside>
      </article>
    </main>

    <footer class="mt-10 border-t border-slate-200 bg-white"><div class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm leading-6 text-slate-500 sm:px-8"><p>Vera helps you examine evidence, qualifications, and unanswered questions.</p><div class="flex flex-wrap gap-3"><button type="button" class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 transition hover:border-[#33286f] hover:text-[#33286f]" @click="copyReportLink"><Icon name="ph:link" class="size-4" aria-hidden="true" />Copy report link</button><button type="button" class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 transition hover:border-[#33286f] hover:text-[#33286f]" @click="shareReport"><Icon name="ph:share-network" class="size-4" aria-hidden="true" />Share report</button></div></div></footer>
    <p class="sr-only" role="status" aria-live="polite">{{ notice }}</p>
  </div>
</template>
