<script setup lang="ts">
import { DEMO_REPORT_ID } from "~~/shared/constants/reports";

await navigateTo(`/reports/${DEMO_REPORT_ID}`, { redirectCode: 302 });
</script>

<template>
  <p class="sr-only">Ouverture du rapport de démonstration…</p>
</template>
