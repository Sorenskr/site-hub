import type { Settings } from "./types";

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";

export function githubConfigured(): boolean {
  return Boolean(TOKEN && OWNER && REPO);
}

function config() {
  if (!githubConfigured()) {
    throw new Error("GitHub 未配置：请设置 GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO 环境变量");
  }
  return { token: TOKEN!, owner: OWNER!, repo: REPO!, branch: BRANCH };
}

const API = "https://api.github.com";

/**
 * 读取仓库内一个文件的内容（文本），优先 raw 读取（快、不受 API 限流），
 * 失败时回退到 Contents API。
 */
export async function readTextFile(path: string): Promise<string | null> {
  const { owner, repo, branch } = config();
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;

  try {
    const res = await fetch(rawUrl, { cache: "no-store" });
    if (res.ok) return await res.text();
  } catch {
    // fall through to API
  }

  try {
    const res = await fetch(
      `${API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { content?: string; encoding?: string };
    if (json.encoding === "base64" && json.content) {
      return Buffer.from(json.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}

export async function readJsonFile<T>(path: string): Promise<T | null> {
  const text = await readTextFile(path);
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/** 获取文件当前 sha（写操作需要）。 */
async function getFileSha(path: string): Promise<string | null> {
  const { owner, repo, branch } = config();
  const res = await fetch(
    `${API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const json = (await res.json()) as { sha?: string };
  return json.sha ?? null;
}

/** 写入（创建或更新）一个文件，自动提交到 GitHub。 */
export async function writeTextFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  const { owner, repo, branch } = config();
  const sha = await getFileSha(path);
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `写入 GitHub 失败 (${res.status})：${
        (err as { message?: string }).message ?? "未知错误"
      }`
    );
  }
}

export function writeJsonFile(
  path: string,
  data: unknown,
  message: string
): Promise<void> {
  return writeTextFile(path, JSON.stringify(data, null, 2) + "\n", message);
}

// ===== 常用路径 =====
export const DATA_PATHS = {
  sites: "data/sites.json",
  messages: "data/messages.json",
  settings: "data/settings.json",
} as const;

export function commitMessage(action: string): string {
  return `chore(data): ${action} @ ${new Date().toISOString()}`;
}
