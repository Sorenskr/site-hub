import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Message, MessageData, Settings, Site, SiteData } from "@/lib/types";
import { ADMIN_COOKIE, signToken, verifyToken } from "@/lib/auth";
import {
  githubConfigured,
  readJsonFile,
  writeJsonFile,
  DATA_PATHS,
  commitMessage,
} from "@/lib/github";
import { clearCache } from "@/lib/data";

export const dynamic = "force-dynamic";

type AdminRequest =
  | { action: "login"; password: string }
  | { action: "logout" }
  | { action: "saveSites"; sites: Site[] }
  | { action: "saveSettings"; settings: Settings }
  | { action: "deleteMessage"; id: string };

function requireGitHub() {
  if (!githubConfigured()) {
    return NextResponse.json(
      { error: "GitHub 未配置：请在环境变量中设置 GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO" },
      { status: 503 }
    );
  }
  return null;
}

function authFail() {
  return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as AdminRequest;

  // ---- 登录 ----
  if (body.action === "login") {
    const pwd = process.env.ADMIN_PASSWORD;
    if (!pwd) {
      return NextResponse.json(
        { error: "未设置 ADMIN_PASSWORD 环境变量" },
        { status: 503 }
      );
    }
    if (body.password === pwd) {
      const token = signToken(pwd);
      cookies().set(ADMIN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  // ---- 登出 ----
  if (body.action === "logout") {
    cookies().delete(ADMIN_COOKIE);
    return NextResponse.json({ ok: true });
  }

  // ---- 其余操作需鉴权 ----
  if (!verifyToken(cookies().get(ADMIN_COOKIE)?.value)) {
    return authFail();
  }
  const gh = requireGitHub();
  if (gh) return gh;

  try {
    switch (body.action) {
      case "saveSites": {
        if (!Array.isArray(body.sites)) {
          return NextResponse.json({ error: "数据格式错误" }, { status: 400 });
        }
        await writeJsonFile(
          DATA_PATHS.sites,
          { sites: body.sites },
          commitMessage("更新网站列表")
        );
        clearCache("sites");
        return NextResponse.json({ ok: true });
      }
      case "saveSettings": {
        await writeJsonFile(
          DATA_PATHS.settings,
          body.settings,
          commitMessage("更新站点设置")
        );
        clearCache("settings");
        return NextResponse.json({ ok: true });
      }
      case "deleteMessage": {
        const existing = await readJsonFile<MessageData>(DATA_PATHS.messages);
        const messages = (existing?.messages ?? []).filter(
          (m: Message) => m.id !== body.id
        );
        await writeJsonFile(
          DATA_PATHS.messages,
          { messages },
          commitMessage("删除留言")
        );
        clearCache("messages");
        return NextResponse.json({ ok: true });
      }
      default:
        return NextResponse.json({ error: "未知操作" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "操作失败", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
