import SignupSchema from "~/schemas/Signup.schema";
import { User } from "~/server/models/User";

import { Validator } from "#nuxt-server-utils";
import { Board } from "~/server/models/Board";
import { List } from "~/server/models/List";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  //使用 Nuxt-Server-Utils 的 Validator 來驗證資料，如果資料不符合 schema，會拋出錯誤
  Validator.validateSchema(SignupSchema, data);
  // 由 MongoDB 的 User model 建立一個新的 user
  const user = await User.create(data);

  // Create a board for the user
  const board = await Board.create({
    name: "Main Board",
    owner: user._id,
    coverImage: "https://picsum.photos/seed/picsum/1200/800",
  });

  const list = await List.create({
    name: "To Do",
    board: board._id,
    owner: user._id,
  });

  board.lists.push(list._id);

  await board.save();

  return user;
});
