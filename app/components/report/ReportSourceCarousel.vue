<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import type { ReportSourceDto } from "~~/shared/types/report";

const props = defineProps<{ sources: ReportSourceDto[] }>();

const [emblaRef, emblaApi] = emblaCarouselVue({ align: "start", containScroll: "trimSnaps" });
const canScrollPrev = ref(false);
const canScrollNext = ref(false);

function updateControls() {
  canScrollPrev.value = emblaApi.value?.canScrollPrev() ?? false;
  canScrollNext.value = emblaApi.value?.canScrollNext() ?? false;
}

function scrollPrev() {
  emblaApi.value?.scrollPrev();
}

function scrollNext() {
  emblaApi.value?.scrollNext();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    scrollPrev();
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    scrollNext();
  }
}

watch(emblaApi, (api, previousApi) => {
  previousApi?.off("select", updateControls);
  previousApi?.off("reInit", updateControls);
  if (!api) return;

  updateControls();
  api.on("select", updateControls);
  api.on("reInit", updateControls);
});

onBeforeUnmount(() => {
  emblaApi.value?.off("select", updateControls);
  emblaApi.value?.off("reInit", updateControls);
});

function sourceType(source: ReportSourceDto) {
  return source.kind === "primary" ? "Primary source" : "Secondary source";
}
</script>

<template>
  <section v-if="props.sources.length" aria-labelledby="source-carousel-title">
    <div>
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.14em] text-[#271f58]">Trace the evidence</p>
        <h2 id="source-carousel-title" class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Browse the sources</h2>
      </div>
    </div>

    <div class="relative mt-6">
      <div ref="emblaRef" class="overflow-hidden" tabindex="0" aria-roledescription="carousel" aria-label="Report sources. Use left and right arrow keys to browse." @keydown="handleKeydown">
        <div class="flex touch-pan-y gap-4">
          <article v-for="source in props.sources" :key="source.id" class="min-w-0 flex-[0_0_88%] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-[0_0_calc(50%-0.5rem)]" role="group" aria-roledescription="slide" :aria-label="`${source.publisher}: ${source.title}`">
            <div class="flex items-start justify-between gap-4">
              <span class="rounded-full bg-[#f1effb] px-2.5 py-1 text-xs font-bold text-[#33286f]">{{ sourceType(source) }}</span>
              <Icon name="ph:book-open-text" class="size-5 shrink-0 text-slate-400" aria-hidden="true" />
            </div>
            <p class="mt-5 text-sm font-semibold text-slate-950">{{ source.publisher }}</p>
            <h3 class="mt-2 text-lg font-semibold leading-7 text-slate-900">{{ source.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-500">Original French source</p>
            <p v-if="source.note" class="mt-4 text-sm leading-6 text-slate-600">{{ source.note }}</p>
            <a :href="source.url" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#33286f] hover:text-[#19133f]">
              Open original source
              <Icon name="ph:arrow-up-right" class="size-4" aria-hidden="true" />
            </a>
          </article>
        </div>
      </div>
      <div class="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:-mx-5 sm:px-0" aria-label="Source carousel controls">
        <button type="button" class="pointer-events-auto grid size-11 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg shadow-slate-950/10 backdrop-blur transition hover:scale-105 hover:border-[#33286f] hover:text-[#33286f] disabled:cursor-not-allowed disabled:opacity-0" :disabled="!canScrollPrev" aria-label="Previous source" @click="scrollPrev">
          <Icon name="ph:arrow-left" class="size-5" aria-hidden="true" />
        </button>
        <button type="button" class="pointer-events-auto grid size-11 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg shadow-slate-950/10 backdrop-blur transition hover:scale-105 hover:border-[#33286f] hover:text-[#33286f] disabled:cursor-not-allowed disabled:opacity-0" :disabled="!canScrollNext" aria-label="Next source" @click="scrollNext">
          <Icon name="ph:arrow-right" class="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>
