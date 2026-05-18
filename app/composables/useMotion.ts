import type { AnimationParams, JSAnimation, TargetsParam } from 'animejs'

export const useMotion = () => {
  const { $anime } = useNuxtApp()
  const prefersReducedMotion = usePreferredReducedMotion()
  const activeAnimations = new Set<JSAnimation>()

  const shouldReduceMotion = computed(() => prefersReducedMotion.value === 'reduce')

  const animate = (targets: TargetsParam, params: AnimationParams): JSAnimation | null => {
    if (shouldReduceMotion.value) return null

    const animation = $anime.animate(targets, params)
    activeAnimations.add(animation)
    animation.then(() => activeAnimations.delete(animation))

    return animation
  }

  const cleanup = () => {
    activeAnimations.forEach(animation => animation.revert())
    activeAnimations.clear()
  }

  onBeforeUnmount(cleanup)

  const fadeIn = (el: Element, done?: () => void) => {
    if (shouldReduceMotion.value) {
      done?.()
      return
    }

    animate(el, {
      opacity: [0, 1],
      y: [8, 0],
      duration: 220,
      ease: 'outQuad',
      onComplete: () => done?.()
    })
  }

  const fadeOut = (el: Element, done?: () => void) => {
    if (shouldReduceMotion.value) {
      done?.()
      return
    }

    animate(el, {
      opacity: [1, 0],
      y: [0, -6],
      duration: 160,
      ease: 'inQuad',
      onComplete: () => done?.()
    })
  }

  return {
    animate,
    cleanup,
    fadeIn,
    fadeOut,
    shouldReduceMotion
  }
}
