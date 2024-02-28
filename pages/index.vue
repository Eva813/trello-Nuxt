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
  console.log('board', board);
  selectedBoard.value = board;
  showCreateBoard.value = true;
}

watchEffect(() => {
  // 當 showCreateBoard false，selectedBoard 會設為 undefined
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
      <!-- 在 元件BoardCard 點擊 onEdit 事件 -->
      <BoardCard v-for="board in data" :key="board._id" :board="board" :on-edit="handleEdit"></BoardCard>
    </section>
    <!-- ./ List of boards -->
  </WrapperDefault>
</template>

<style>
</style>


<!-- 關於 on-update
在你提供的程式碼中，on-update 事件處理器並沒有接收任何參數，而是直接關閉 USlideover（設定 showCreateBoard 為 false），清除 selectedBoard（設定為 undefined），並重新整理資料（調用 refresh 方法）。這表示當 FormBoard 元件觸發 update 事件時，你並不需要處理任何更新的資料，而只需要進行這些操作。

這種設計的原因可能是 FormBoard 元件已經在內部處理了資料的更新，並且當更新完成後，你只需要關閉 USlideover，清除 selectedBoard，並重新整理資料即可。這種設計可以讓 FormBoard 元件更獨立，並減少父元件需要處理的邏輯。

然而，這種設計也有一些限制。例如，如果你需要在更新資料後進行一些額外的操作（例如顯示一個通知或更新其他元件的狀態），你可能需要修改 FormBoard 元件，讓它能夠將更新的資料傳遞給 on-update 事件處理器。 -->
