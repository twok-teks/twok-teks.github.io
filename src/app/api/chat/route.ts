import { createChatHandler } from "@/lib/chat/handler";
import { getPortfolioSources } from "@/lib/chat/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createChatHandler({
  getConfiguration: () => ({
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL,
  }),
  getSources: getPortfolioSources,
});
