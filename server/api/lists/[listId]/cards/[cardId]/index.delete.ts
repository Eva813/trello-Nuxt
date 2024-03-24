import { Card } from "~/server/models/Card";
import { List } from "~/server/models/List";

export default defineEventHandler(async (event) => {
  const listId = getRouterParam(event, "listId");
  const cardId = getRouterParam(event, "cardId");
  const user = event.context.user;

  const card = await Card.findOneAndDelete({
    _id: cardId,
    list: listId,
    owner: user._id,
  });

  if (!card) {
    throw createError({
      statusCode: 404,
      message: "Card not found",
    });
  }

  // Remove the card from the list
  //$pull 被用於從 List 集合中的 cards 陣列中移除指定的 card._id。這樣可以確保在刪除卡片後，相應的卡片也會從列表中移除。
  await List.findByIdAndUpdate(listId, {
    $pull: { cards: card._id },
  });

  event.node.res.statusCode = 204;

  return true;
});
