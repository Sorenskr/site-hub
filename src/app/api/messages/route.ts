import { NextResponse } from "next/server";
import type { Message } from "@/lib/types";
import { githubConfigured, readJsonFile, writeJsonFile, DATA_PATHS, commitMessage } from "@/lib/github";
import { clearCache } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      nickname?: string;
      content?: string;
    };
    const nickname = (body.nickname ?? "").trim().slice(0, 30) || "匿名访客";
    const content = (body.content ?? "").trim();

    if (!content) {
      return NextResponse.json({ error: "留言内容不能为空" }, { status: 400 });
    }
    if (content.length > 500) {
      return NextResponse.json({ error: "留言最长 500 字" }, { status: 400 });
    }
    if (!githubConfigured()) {
      return NextResponse.json(
        { error: "留言功能未启用：站长尚未配置 GitHub 环境变量" },
        { status: 503 }
      );
    }

    const existing = await readJsonFile<{ messages: Message[] }>(DATA_PATHS.messages);
    const messages = existing?.messages ?? [];
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nickname,
      content,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMessage);
    if (messages.length > 500) messages.splice(0, messages.length - 500);

    await writeJsonFile(
      DATA_PATHS.messages,
      { messages },
      commitMessage(`留言：${nickname}`)
    );
    clearCache("messages");

    return NextResponse.json({ ok: true, message: newMessage });
  } catch (err) {
    return NextResponse.json(
      { error: "留言提交失败", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
