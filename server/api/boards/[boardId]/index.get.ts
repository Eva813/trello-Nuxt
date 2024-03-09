import { Board } from "~/server/models/Board";
import { List } from "~/server/models/List";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const boardId = getRouterParam(event, "boardId");

  //populate方法是Mongoose庫提供的一個方法，它用於填充（populate）board物件中的lists屬性。這個方法接受一個物件作為參數，其中path屬性指定要放的屬性名稱，model屬性指定要使用的模型。
  const board = await Board.findOne({ _id: boardId, owner: user._id }).populate(
    {
      path: "lists",
      model: List,
    }
  );

  return board;
});
