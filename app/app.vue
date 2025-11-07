<template>
    <NuxtLayout>
        <NuxtPage :transition="{
            name: 'page',
            mode: 'out-in'
        }" />
    </NuxtLayout>
</template>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
}

.page-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.98);
}

.page-enter-to,
.page-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>
