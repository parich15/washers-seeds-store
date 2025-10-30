<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'gradient' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  removable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  removable: false
})

const emit = defineEmits<{
  remove: []
}>()

const badgeClass = computed(() => {
  const classes = ['badge']
  
  // Variant classes
  switch (props.variant) {
    case 'primary':
      classes.push('badge-primary')
      break
    case 'secondary':
      classes.push('badge-secondary')
      break
    case 'gradient':
      classes.push('badge-gradient')
      break
    case 'success':
      classes.push('bg-green-100 text-green-700')
      break
    case 'warning':
      classes.push('bg-yellow-100 text-yellow-700')
      break
    case 'danger':
      classes.push('bg-red-100 text-red-700')
      break
    case 'info':
      classes.push('bg-blue-100 text-blue-700')
      break
  }
  
  // Size classes
  switch (props.size) {
    case 'sm':
      classes.push('text-xs px-2 py-0.5')
      break
    case 'md':
      classes.push('text-xs px-3 py-1')
      break
    case 'lg':
      classes.push('text-sm px-4 py-1.5')
      break
  }
  
  return classes.join(' ')
})

const handleRemove = () => {
  emit('remove')
}
</script>

<template>
  <span :class="badgeClass">
    <!-- Icon -->
    <Icon
      v-if="icon"
      :icon="icon"
      class="mr-1"
      :class="{ 'text-xs': size === 'sm', 'text-sm': size === 'md', 'text-base': size === 'lg' }"
    />
    
    <!-- Content -->
    <slot />
    
    <!-- Remove button -->
    <button
      v-if="removable"
      type="button"
      class="ml-1 inline-flex items-center hover:opacity-70 transition-opacity"
      @click.stop="handleRemove"
    >
      <Icon icon="mdi:close" class="text-xs" />
    </button>
  </span>
</template>
