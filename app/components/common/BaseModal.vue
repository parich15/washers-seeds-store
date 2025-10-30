<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnClickOutside?: boolean
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnClickOutside: true,
  showClose: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const modalRef = ref<HTMLDivElement>()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleClickOutside = (event: MouseEvent) => {
  if (props.closeOnClickOutside && modalRef.value === event.target) {
    handleClose()
  }
}

const modalSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-md'
    case 'md':
      return 'max-w-lg'
    case 'lg':
      return 'max-w-2xl'
    case 'xl':
      return 'max-w-4xl'
    case 'full':
      return 'max-w-full mx-4'
    default:
      return 'max-w-lg'
  }
})

// Prevent body scroll when modal is open
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        ref="modalRef"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="handleClickOutside"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            :class="['bg-white rounded-2xl shadow-xl w-full overflow-hidden', modalSizeClass]"
            @click.stop
          >
            <!-- Modal Header -->
            <div v-if="title || showClose || $slots.header" class="flex items-center justify-between p-6 border-b border-gray-200">
              <div v-if="$slots.header">
                <slot name="header" />
              </div>
              <h3 v-else-if="title" class="text-2xl font-bold text-gradient">
                {{ title }}
              </h3>
              
              <button
                v-if="showClose"
                type="button"
                class="ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors"
                @click="handleClose"
              >
                <Icon icon="mdi:close" class="text-2xl text-gray-500" />
              </button>
            </div>
            
            <!-- Modal Body -->
            <div class="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
              <slot />
            </div>
            
            <!-- Modal Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
