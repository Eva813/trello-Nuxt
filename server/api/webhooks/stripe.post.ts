import Stripe from "stripe";
import { User } from "~/server/models/User";
import stripe from "~/utils/stripe";

// 放在 webhooks 資料夾下的檔案，是用來處理？

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readRawBody(event);
  const stripeSignature = getHeader(event, "stripe-signature");

  if (!body || !stripeSignature) {
    throw createError({
      statusCode: 400,
      message: "Invalid request body",
    });
  }

  try {
    const stripeEvent = stripe().webhooks.constructEvent(
      body,
      stripeSignature,
      config.stripeWebhookSecret
    );
      // 當使用者的訂閱被建立、更新、刪除或恢復時，我們會收到 Stripe 的事件。
    switch (stripeEvent.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.resumed": {
        const data = stripeEvent.data.object as Stripe.Subscription;

        const user = await User.findOne({ stripeCustomerId: data.customer });

        await user?.updateSubscription(data);
      }
    }

    return "ok";
  } catch (e) {
    throw createError({
      statusCode: 400,
      message: "Invalid request body",
    });
  }
});
