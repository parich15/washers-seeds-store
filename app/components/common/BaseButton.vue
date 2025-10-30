<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  type: 'button',
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const buttonClass = computed(() => {
  const classes = ['btn']
  
  // Variant classes
  switch (props.variant) {
    case 'primary':
      classes.push('btn-primary')
      break
    case 'secondary':
      classes.push('btn-secondary')
      break
    case 'gradient':
      classes.push('btn-gradient')
      break
    case 'outline':
      classes.push('btn-outline')
      break
    case 'ghost':
      classes.push('btn-ghost')
      break
  }
  
  // Size classes
  if (props.size === 'sm') classes.push('btn-sm')
  if (props.size === 'lg') classes.push('btn-lg')
  
  // Full width
  if (props.fullWidth) classes.push('w-full')
  
  return classes.join(' ')
})
</script>

<template>
  <button
    :type="type"
    :class="buttonClass"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <Icon
      v-if="loading"
      icon="mdi:loading"
      class="animate-spin mr-2"
      :class="{ 'text-lg': size === 'sm', 'text-xl': size === 'md', 'text-2xl': size === 'lg' }"
    />
    
    <!-- Left icon -->
    <Icon
      v-if="icon && iconPosition === 'left' && !loading"
      :icon="icon"
      class="mr-2"
      :class="{ 'text-lg': size === 'sm', 'text-xl': size === 'md', 'text-2xl': size === 'lg' }"
    />
    
    <!-- Slot content -->
    <slot />
    
    <!-- Right icon -->
    <Icon
      v-if="icon && iconPosition === 'right' && !loading"
      :icon="icon"
      class="ml-2"
      :class="{ 'text-lg': size === 'sm', 'text-xl': size === 'md', 'text-2xl': size === 'lg' }"
    />
  </button>
</template>
