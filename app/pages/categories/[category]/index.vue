<script setup lang="ts">
const route = useRoute()

await navigateTo(normalizeCmsPath(`/categories/${route.params.category}`), {
  redirectCode: 301
})
</script>

<template>
  <div />
</template>
