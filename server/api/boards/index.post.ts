import { Validator } from "#nuxt-server-utils";
import BoardSchema from "~/schemas/Board.schema";
import { Board } from "~/server/models/Board";
import type { UserDocument } from "~/server/models/User";

export default defineEventHandler(async (event) => {
  // readBody() 輔助函式，取得 request body 內容
  const body = await readBody(event);
  // 如果驗證 schema 失敗，則會拋出錯誤
  Validator.validateSchema(BoardSchema, body);

  // 在 middleware 中，透過 event.context.user 取得當前用戶的資訊
  const user = event.context.user as UserDocument;

  const boardCount = await Board.countDocuments({ owner: user._id });

  // 設定限制，如果用戶沒有訂閱，則只能建立 5 個 board
  if (boardCount >= 5 && !user.hasActiveSubscription) {
    throw createError({
      statusCode: 403,
      message:
        "You can't create more than 5 boards in free plan. Please upgrade your plan to create unlimited",
    });
  }

  // 透過 Model 對 Collection 進行溝通與操作，使用 Ｍongoose create() 方法新增一筆資料
  const board = await Board.create({
    ...body,
    owner: user._id,
  });

  return board;
});
