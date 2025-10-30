<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  bordered?: boolean
  hoverable?: boolean
  padding?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  bordered: false,
  hoverable: true,
  padding: true,
  clickable: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}

const cardClass = computed(() => {
  const classes = ['card']
  
  if (props.bordered) {
    classes.push('card-bordered')
  }
  
  if (!props.hoverable) {
    classes.push('hover:shadow-md')
  }
  
  if (props.clickable) {
    classes.push('cursor-pointer')
  }
  
  return classes.join(' ')
})
</script>

<template>
  <div
    :class="cardClass"
    @click="handleClick"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <!-- Body slot -->
    <div :class="{ 'card-body': padding }">
      <slot />
    </div>
    
    <!-- Footer slot -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card-header {
  @apply border-b border-gray-200 p-4;
}

.card-footer {
  @apply border-t border-gray-200 p-4;
}
</style>
