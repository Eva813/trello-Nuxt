<script lang="ts" setup>
const {
  public: { pixabayApiKey },
} = useRuntimeConfig();

// 利用雙向綁定的方式，將選擇的圖片傳遞到父元件
defineProps<{
  modelValue?: string;
}>();

// 取得圖片列表
const { data } = await useFetch<any>(
  `https://pixabay.com/api/?key=${pixabayApiKey}&image_type=photo&orientation=horizontal&per_page=32`
);

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
<template>
  <ol v-if="data.hits" class="grid grid-cols-4 gap-2 overflow-y-auto overflow-x-auto h-64 p-2">
    <!-- 當選到的圖片是 image.largeImageURL 時，會套用 ring-2 ring-blue-500 shadow 的樣式 -->
    <li v-for="image in data.hits"
      class="h-12 relative rounded overflow-hidden cursor-pointer outline outline-transparent focus:outline-blue-500 hover:outline-blue-500"
      :class="{
        'ring-2 ring-blue-500 shadow': modelValue === image.largeImageURL,
      }" :key="image.id" @click="$emit('update:modelValue', image.largeImageURL)">
      <NuxtImg :src="image.previewURL" class="w-full h-full absolute object-cover"></NuxtImg>
    </li>
  </ol>
</template>

<style>
</style>
