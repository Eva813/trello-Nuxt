export const useList = () => {
  async function destroy(id: string, onDestroy?: () => void) {
    try {
      useToast().add({
        title: "Delete list",
        description: "Are you sure you want to delete this list?",
        actions: [
          {
            label: "Canel",
            click: () => {},
          },
          {
            label: "Yes",
            color: "red",
            click: async () => {
              await useFetch(`/api/lists/${id}`, {
                method: "DELETE",
              });
              onDestroy?.();
            },
          },
        ],
        timeout: 5000,
        color: "red",
      });
    } catch (e: any) {
      useToast().add({
        title: "Error",
        description: e.message || "Something went wrong",
      });
    }
  }
  //watch 是一個布林值，被用來指定是否要監聽資源的變化。在這個例子中，watch 被設定為 false，表示不要監聽資源的變化。
  async function update(id: string, data: Record<string, unknown>) {
    await useFetch(`/api/lists/${id}`, {
      body: data,
      method: "PUT",
      watch: false,
    });
  }

  return {
    destroy,
    update,
  };
};
