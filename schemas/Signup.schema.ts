import { z } from "h3-zod";
import SigninSchema from "./Signin.schema";
// 因為 SignupSchema 是基於 SigninSchema 的，所以我們可以使用 .extend() 來擴充
export default SigninSchema.extend({
  name: z
    .string({
      required_error: "Please enter your name",
      invalid_type_error: "Please enter a valid name",
    })
    .min(2),
  passwordConfirm: SigninSchema.shape.password,
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});
