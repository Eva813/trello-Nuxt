import { getServerSession } from "#auth";

// 這裡的 getServerSession 是一個從 @nuxt/auth 模組中匯入的函數，它會從伺服器端的請求中取得用戶的 session
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  // 如果請求的路徑在 protectedRoutes 列表中，但是沒有用戶的 session，則拋出一個錯誤，表示用戶未經授權。
  // those routes should only be accessed when the user is logged in
  const protectedRoutes = ["/api/boards", "/api/lists", "/api/users"];
  
  // startsWith 用於檢查字串是否以指定的字串開頭。
  const isProtectedRoute = protectedRoutes.some((route) =>
    getRequestURL(event).pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return;
  }

  if (!session) {
    // Nuxt3 utils createError
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to access this resource",
    });
  }

  // 
  event.context.user = session?.user;
});
