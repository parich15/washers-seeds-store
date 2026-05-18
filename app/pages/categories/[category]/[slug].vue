<script setup lang="ts">
const route = useRoute()

await navigateTo(normalizeCmsPath(`/categories/${route.params.category}/${route.params.slug}`), {
  redirectCode: 301
})
</script>

<template>
  <div />
</template>
