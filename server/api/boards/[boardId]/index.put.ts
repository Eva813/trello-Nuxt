import { Validator } from "#nuxt-server-utils";
import BoardSchema from "~/schemas/Board.schema";
import { Board } from "~/server/models/Board";

export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, "boardId");
  const user = event.context.user;

  const body = await readBody(event);

  // partial 是指 body 可以只包含部分欄位
  Validator.validateSchema(BoardSchema.partial(), body);

  const board = await Board.updateOne(
    { _id: boardId, owner: user._id },
    // $set 是 MongoDB 的 update operator，用來更新指定欄位
    // 在這裡，我們使用 $set 來更新 board 的欄位
    {
      $set: body,
    }
  );

  return board;
});
