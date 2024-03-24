<script lang="ts" setup>
import draggable from "vuedraggable";
import type { ListDocument } from "~/server/models/List";

interface Props {
  boardId: string;
  lists: ListDocument[];
}

const props = defineProps<Props>();

// 使用 draggable 來實現拖曳效果，並且設置 handleSort 來處理拖曳後的排序
async function handleSort(e: any) {
  await useFetch(`/api/boards/${props.boardId}`, {
    method: "PUT",
    body: {
      lists: props.lists.flatMap((i: any) => i._id),
    },
  });
}
</script>
<template>
  <div>
    <!-- handle .list-header 是用來拖曳整個 list 的 header -->
    <!-- scroll-sensitivity 是用來設定拖曳時的滾動速度 -->
    <!-- force-fallback 是用來設定當拖曳時，是否使用原生的拖曳效果 -->
    <!-- 須設置 item-key -->
    <!-- ghost-class 目标位置占位符的样式及需要停靠位置的样式 -->
    <draggable :list="lists" handle=".list-header" ghost-class="ghost-board" drag-class="dragging-board" item-key="_id"
      :scroll-sensitivity="500" :force-fallback="true" @sort="handleSort"
      class="flex h-[80vh] overflow-x-auto gap-4 pb-2 list">
      <template #item="{ element }">

        <div class="flex">
          <ListItem :list="element" :board-id="boardId" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<style>
.ghost-board>div {
  @apply opacity-50;
}

.ghost-board>div>div {
  @apply invisible;
}

/* 在 dragging 時，設置的效果 */
.dragging-board {
  @apply shadow-2xl transform rotate-2 cursor-grabbing;
}

.list .sortable-chosen {
  overflow: hidden;
  opacity: 1 !important;
}
</style>
