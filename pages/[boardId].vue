<script lang="ts" setup>
import type { BoardDocument } from "~/server/models/Board";
import type { ListDocument } from "~/server/models/List";
// 此為點擊 board 後的頁面
// 在 boardId 的頁面中，會顯示該 board 的名稱、封面圖片、以及所有的 list
definePageMeta({
  middleware: "auth",
});

const { boardId } = useRoute().params;
const showCreateList = ref(false);

// useFetch 中含有 data, error, loading, refresh 等屬性
const { data, refresh } = await useFetch<BoardDocument>(
  `/api/boards/${boardId}`
);

provide("refresh-board", refresh);

if (!data.value) {
  throw createError({
    statusCode: 404,
    message: "Board not found",
  });
}

useHead({
  title: data.value.name,
});

const coverImage = computed(() => data.value?.coverImage || "");
const lists = computed(() => data.value?.lists as ListDocument[]);
</script>
<template>
  <WrapperDefault v-if="data" class="h-screen" :style="{
    backgroundImage: `url(${coverImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }">
    <!-- wrapperDefault 包含頁面 header，在此頁面中，加入 actions slot -->
    <template #actions>
      <UButton @click="showCreateList = true" size="xs">Create a list</UButton>
    </template>

    <h1 class="tex-3xl font-semibold mb-4 inline-block">
      {{ data!.name }}
    </h1>

    <ListContainer :lists="lists" :board-id="(boardId as string)" />

    <!-- 當 showCreateList 為 true 時，顯示 Slideover -->
    <USlideover v-model="showCreateList">
      <SlideoverHeader title="Create list" :on-click="() => (showCreateList = false)"></SlideoverHeader>

      <FormList type="create" :board-id="(boardId as string)" :on-create="() => {
    refresh();
    showCreateList = false;
  }
    " :on-update="() => {
    refresh();
    showCreateList = false;
  }
    " class="p-4" />
    </USlideover>
  </WrapperDefault>
</template>

<style></style>
