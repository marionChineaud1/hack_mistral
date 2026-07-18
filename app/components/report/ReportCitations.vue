<script setup lang="ts">
import type { ReportSourceDto } from "~~/shared/types/report";

defineProps<{ sources: ReportSourceDto[] }>();
</script>

<template>
  <ul v-if="sources.length" class="mt-4 flex flex-wrap gap-2" aria-label="Associated sources">
    <li v-for="source in sources" :key="source.id">
      <a
        :href="source.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#33286f] transition hover:border-[#b8b0df] hover:bg-[#f1effb]"
        :aria-label="`${source.publisher} — ${source.title} (opens in a new tab)`"
      >
        {{ source.publisher }}
        <Icon name="ph:arrow-up-right" aria-hidden="true" class="size-3.5" />
      </a>
    </li>
  </ul>
</template>
