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
    if (props.type === "update" && props.initialData?._id) {
      const updatedBoard = await useFetch(
        `/api/boards/${props.initialData._id}`,
        {
          method: "PUT",
          body: event.data,
          watch: false,
        }
      );
      props.onUpdate?.(updatedBoard);
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
