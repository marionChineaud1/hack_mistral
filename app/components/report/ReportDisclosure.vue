<script setup lang="ts">
defineProps<{ id: string; title: string; eyebrow?: string; count?: number }>();
</script>

<template>
  <details :id="id" class="group scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:break-inside-avoid print:shadow-none">
    <summary class="flex cursor-pointer list-none items-center gap-4 px-5 py-5 transition hover:bg-slate-50 sm:px-7">
      <span>
        <span v-if="eyebrow" class="block text-xs font-bold uppercase tracking-[0.14em] text-[#271f58]">{{ eyebrow }}</span>
        <span class="text-lg font-semibold text-slate-950">{{ title }}</span>
      </span>
      <span class="ml-auto flex items-center gap-3 text-sm font-medium text-slate-500">
        <span v-if="count !== undefined">{{ count }}</span>
        <span aria-hidden="true" class="text-base leading-none transition-transform duration-200 group-open:rotate-180">⌄</span>
      </span>
    </summary>
    <div class="border-t border-slate-200 px-5 py-6 sm:px-7">
      <slot />
    </div>
  </details>
</template>
