<script lang="ts" setup>
// 此為都入後的首要頁面，用來顯示所有的看板
import type { BoardDocument } from "~/server/models/Board";

// middleware: "auth" 會檢查使用者是否登入，如果沒有登入會導向 /auth/signin
// 可看[…].js 的檔案
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Boards",
});

const showCreateBoard = ref(false);
const selectedBoard = ref<BoardDocument | undefined>();

// refresh?
const { data, error, refresh } = await useFetch<BoardDocument[]>("/api/boards");
provide("refresh-boards", refresh);

if (error.value) {
  throw createError(error.value);
}

async function handleEdit(board: BoardDocument) {
  selectedBoard.value = board;
  showCreateBoard.value = true;
}

watchEffect(() => {
  if (!showCreateBoard.value) {
    selectedBoard.value = undefined;
  }
});
</script>
<template>
  <WrapperDefault>
    <!-- 加入 i18n -->
    <h1 class="tex-3xl font-semibold">Boards</h1>

    <template #actions>
      <UButton size="xs" @click="showCreateBoard = !showCreateBoard">Create new board</UButton>
    </template>

    <!-- Sidesheet  -->
    <USlideover v-model="showCreateBoard">
      <SlideoverHeader :title="selectedBoard ? 'Update board' : 'Create board'"
        :on-click="() => (showCreateBoard = false)"></SlideoverHeader>

      <!-- on-create 事件會在新增看板後觸發，然後重新整理看板列表 -->
      <!-- selectedBoard 有值時，會顯示 update 看板的表單，否則會顯示 create 看板的表單 -->
      <FormBoard :type="selectedBoard ? 'update' : 'create'" :initial-data="selectedBoard" :on-create="() => {
        showCreateBoard = false;
        refresh();
      }
        " :on-update="() => {
    showCreateBoard = false;
    selectedBoard = undefined;
    refresh();
  }
    " />
    </USlideover>
    <!-- ./ Sidesheet  -->

    <!-- List of boards 呈現 boards-->
    <section class="grid grid-cols-2 lg:grid-cols-5 my-4 gap-4">
      <BoardCard v-for="board in data" :key="board._id" :board="board" :on-edit="handleEdit"></BoardCard>
    </section>
    <!-- ./ List of boards -->
  </WrapperDefault>
</template>

<style>
</style>
