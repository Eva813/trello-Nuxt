import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "~/server/models/User";
//https://ithelp.ithome.com.tw/m/articles/10301197
//建立 […].js 的檔案，將所有不匹配的路由交由這個 header 作處理

async function getUser(id: string) {
  const user = await User.findById(id);

  return user?.toJSON();
}

//nuxt-auth 是一個旨在支持任何通用 Nuxt 3 應用程序的身份驗證的套件
//NuxtAuthHandler
//  auth: {
//     baseURL: process.env.AUTH_ORIGIN,
//     provider: {
//       type: "authjs",
//     },
//   },
//https://qiita.com/motoo1789/items/f0fe74e39c93f9b9a3f7


export default NuxtAuthHandler({
  secret: useRuntimeConfig().auth.secret,
  pages: {
    //定義不同頁面的URL路徑
    signIn: "/auth/signin",
  },
  providers: [
    // @ts-expect-error
    CredentialsProvider.default({
      name: "credentials",
      origin: useRuntimeConfig().auth.origin,
      async authorize(credential: { email: string; password: string }) {
        // login logic
        // Authorize the user

        const user = await User.findOne({ email: credential.email });
        // 如果 user 不存在，返回 null
        if (!user) {
          return null;
        }
        // 使用 user model 的 comparePassword 方法來比較密碼
        const isValid = await user.comparePassword(credential.password);

        if (!isValid) {
          return null;
        }

        return user.toJSON();
      },
    }),
  ],
  // 更新JWT token，將用戶資訊合併到token中
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }

      return token;
    },

    async session({ session, token }) {
      const refreshedUser = await getUser(token.id as string);


      session.user = {
        ...token,
        ...session.user,
        ...refreshedUser,
      };

      return session;
    },
  },
});
