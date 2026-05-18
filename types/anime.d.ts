import type { animate, stagger } from 'animejs'

declare module '#app' {
  interface NuxtApp {
    $anime: {
      animate: typeof animate
      stagger: typeof stagger
    }
  }
}

export {}
