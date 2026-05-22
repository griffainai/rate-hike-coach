import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { loadCoachSystemPrompt, type CoachMode } from "@/lib/coach-context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";

const VALID_MODES: CoachMode[] = ["pre-game", "halftime", "timeout", "post-game"];

function parseMode(input: unknown): CoachMode {
  if (typeof input === "string" && (VALID_MODES as string[]).includes(input)) {
    return input as CoachMode;
  }
  return "pre-game";
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "ANTHROPIC_API_KEY is not set. The coach cannot respond without it. Add it to .env.local or your Vercel environment.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { messages: ClientMessage[]; mode?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = body.messages?.filter(
    (m) => m.role === "user" || m.role === "assistant"
  );
  if (!messages || messages.length === 0) {
    return new Response(JSON.stringify({ error: "No messages provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const mode = parseMode(body.mode);
  const systemPrompt = await loadCoachSystemPrompt(mode);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Timeout mode uses a tighter max_tokens to enforce response brevity.
  const maxTokens = mode === "timeout" ? 400 : 2048;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: MODEL,
          max_tokens: maxTokens,
          system: [
            {
              type: "text",
              text: systemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        controller.enqueue(
          encoder.encode(`\n\n[coach error: ${msg}]\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Content-Type-Options": "nosniff",
      "X-Coach-Mode": mode,
    },
  });
}
