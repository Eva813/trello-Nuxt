import { z } from "zod";

export default z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255).optional(),
  // nullable means that the value can be null
  coverImage: z.string().min(1).max(255).optional().nullable(),
  list: z.array(z.string()).optional(),
});
