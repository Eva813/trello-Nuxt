<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import type { z } from "h3-zod";
import BoardSchema from "~/schemas/Board.schema";
import type { BoardDocument } from "~/server/models/Board";

interface Props {
  type: "create" | "update";
  initialData?: Partial<BoardDocument>;
  onUpdate?: (data?: any) => void;
  onCreate?: (data?: any) => void;
}
//https://blog.csdn.net/lijiahui_/article/details/122725791
const props = withDefaults(defineProps<Props>(), {
  type: "create",
});

const isLoading = ref(false);
const formState = reactive<Partial<BoardDocument>>({
  name: undefined,
  coverImage: undefined,
});

async function handleSubmit(
  event: FormSubmitEvent<z.output<typeof BoardSchema>>
) {
  try {
    isLoading.value = true;
    // 判別是更新還是新增
    if (props.type === "update" && props.initialData?._id) {
      const updatedBoard = await useFetch(
        `/api/boards/${props.initialData._id}`,
        {
          method: "PUT",
          body: event.data,
          watch: false,
        }
      );
      // 這裡的 onUpdate 是由 外部傳入的 on-update 事件
      // props.onUpdate?.(updatedBoard)是一個函式呼叫的語法。它使用了可選的鏈結運算子（optional chaining operator）?.，這表示如果props.onUpdate存在且是一個函式，則執行該函式並傳遞updatedBoard作為參數

      props.onUpdate?.(updatedBoard);

      useToast().add({
        title: "Board updated"
      })

      return;
    }

    const { data, error } = await useFetch("/api/boards", {
      method: "POST",
      body: event.data,
      // 這裡的 watch: false 是為了?
      watch: false,
    });

    if (error.value) {
      if (error.value.statusCode === 403) {
        useSubscription().showSubscriptionModal({
          title: "Multiple boards is a Premium Feature",
          description:
            "You can create only one board in free plan. Please upgrade to premium to create more boards.",
        });
      }
    }

    // 這裡的 onCreate 是在 pages/index.vue 中的 FormBoard 的 on-create 事件
    // 這裡的 data 是新增看板後的資料
    props.onCreate?.(data);
  } catch (e) {
  } finally {
    isLoading.value = false;
  }
}

watchEffect(() => {
  // 判別是更新還是新增
  if (props.type === "update" && props.initialData) {
    formState.name = props.initialData.name;
    formState.coverImage = props.initialData.coverImage;
  }

  if (props.type === "create") {
    formState.name = undefined;
    formState.coverImage = undefined;
  }
});
</script>
<template>
  <UForm :state="formState" :schema="BoardSchema" class="p-4" @submit="handleSubmit">
    <UFormGroup class="mb-4" name="name" label="Board Name">
      <UInput v-model="formState.name" type="text" placeholder="Board name" />
    </UFormGroup>

    <UFormGroup class="mb-4" name="coverImage" label="Select cover image">
      <ImagePicker v-model="formState.coverImage" />
    </UFormGroup>

    <UButton type="submit" color="primary" block :loading="isLoading">
      {{ type === "create" ? "Create board" : "Update board" }}
    </UButton>
  </UForm>
</template>

<style>
</style>

<!-- 備註 -->
<!-- updatedBoard 參數會被傳遞給 props.onUpdate 函式。這個函式是由父元件傳遞給 Board 元件的。當 Board 元件的狀態更新時，props.onUpdate 函式會被調用，並且 updatedBoard 會作為參數傳遞給它。

具體來說，updatedBoard 參數的傳遞路徑如下：

Board 元件的某個方法（例如 updateBoard 方法）會產生一個 updatedBoard 物件。
這個方法會調用 props.onUpdate 函式，並將 updatedBoard 作為參數傳遞給它。
props.onUpdate 函式是由父元件傳遞給 Board 元件的，所以 updatedBoard 會被傳遞到父元件中的這個函式。
這種方式允許 Board 元件將其內部狀態的變化通知給父元件，並讓父元件可以對這些變化做出反應。 -->
