import { Validator } from "#nuxt-server-utils";
import ListSchema from "~/schemas/List.schema";
import { List } from "~/server/models/List";

// inside the handler, the first thing we would do is access listId from the event object
export default defineEventHandler(async (event) => {
  // getRouterParam is utility function from h3
  const listId = getRouterParam(event, "listId");
  const user = event.context.user;

  const body = await readBody(event);

  Validator.validateSchema(ListSchema.partial(), body);

  const updatedLists = await List.findOneAndUpdate(
    { _id: listId, owner: user._id },
    {
      $set: body,
    },
    {
      new: true,
    }
  );

  if (!updatedLists) {
    throw createError({
      statusCode: 404,
      message: "List not found",
    });
  }

  return updatedLists;
});
