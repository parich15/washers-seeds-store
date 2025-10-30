<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search'
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  maxlength?: number
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  iconPosition: 'left',
  disabled: false,
  required: false,
  readonly: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputClass = computed(() => {
  const classes = ['input']
  
  if (props.error) {
    classes.push('input-error')
  }
  
  if (props.icon && props.iconPosition === 'left') {
    classes.push('pl-10')
  }
  
  if (props.icon && props.iconPosition === 'right') {
    classes.push('pr-10')
  }
  
  return classes.join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <!-- Input wrapper -->
    <div class="relative">
      <!-- Left icon -->
      <div
        v-if="icon && iconPosition === 'left'"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <Icon :icon="icon" class="text-gray-400 text-xl" />
      </div>
      
      <!-- Input -->
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :readonly="readonly"
        :maxlength="maxlength"
        :class="inputClass"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      >
      
      <!-- Right icon -->
      <div
        v-if="icon && iconPosition === 'right'"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <Icon :icon="icon" class="text-gray-400 text-xl" />
      </div>
    </div>
    
    <!-- Error message -->
    <p
      v-if="error"
      class="mt-2 text-sm text-red-500"
    >
      {{ error }}
    </p>
  </div>
</template>
