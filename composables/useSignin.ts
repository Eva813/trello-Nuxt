import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "h3-zod";
import SigninSchema from "~/schemas/Signin.schema";

interface SignInResultWithPossibleError {
  error?: string; // 假設 error 是可選的，且為字符串型別
}

export const useSignin = () => {
  const formState = reactive({
    email: undefined,
    password: undefined,
  });

  const validationSchema = SigninSchema;
  const isLoading = ref(false);

  const router = useRouter();
  //useAuth 是來自 nuxt-auth 的 hook
  const { signIn } = useAuth();
  // 登入表單提交
  async function handleSubmit(
    event: FormSubmitEvent<z.output<typeof validationSchema>>
  ) {
    try {
      isLoading.value = true;

      
      const { error } = await signIn("credentials", {
        redirect: false,
        email: event.data.email,
        password: event.data.password,
      })as SignInResultWithPossibleError;

      if (error) {
        throw new Error(error);
      }

      router.push("/");
    } catch (e) {
      useToast().add({
        id: "error",
        title: "Invalid credentials",
        color: "red",
        icon: "i-heroicons-information-circle",
        timeout: 3000,
      });
    } finally {
      isLoading.value = false;
    }
  }

  return {
    formState,
    isLoading,
    validationSchema,
    handleSubmit,
  };
};
