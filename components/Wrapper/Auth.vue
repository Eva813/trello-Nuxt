<script lang="ts" setup>
defineProps({
  title: {
    type: String,
  },
});
</script>
<template>
  <div class="grid lg:grid-cols-2 h-screen bg-gray-100 dark:bg-gray-950">
    <div class="left place-self-center w-full px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-52">
      <div class="header text-center mb-6">
        <div class="flex justify-center my-4">
          <Logo />
        </div>
        <h1 class="text-xl font-bold mb-px">{{ title }}</h1>
        <slot name="header"></slot>
      </div>
      <!-- The UCard component is a wrapper for the form -->
      <UCard>
        <slot />
      </UCard>
    </div>
    <div class="right hidden lg:block"></div>
  </div>
</template>

<style>
.right {
  background: linear-gradient(-45deg, #3F64FF, #5269c3, #6f83d4, #5674f0);
  background-size: 300% 300%;
  animation: gradientAnimation 3s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
