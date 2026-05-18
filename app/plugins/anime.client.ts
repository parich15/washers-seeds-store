import { animate, stagger } from 'animejs'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      anime: {
        animate,
        stagger
      }
    }
  }
})
