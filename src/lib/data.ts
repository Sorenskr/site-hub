import type { CombinedData, Message, MessageData, Settings, Site, SiteData } from "./types";
import { githubConfigured, readJsonFile, DATA_PATHS } from "./github";

import sitesDefault from "../../data/sites.json";
import messagesDefault from "../../data/messages.json";
import settingsDefault from "../../data/settings.json";

const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 30 * 1000; // 30 秒缓存，减少 GitHub API 压力

async function cached<T>(key: string, loader: () => Promise<T | null>): Promise<T | null> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data as T;
  const data = await loader();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

function normSites(data: unknown): Site[] {
  const raw = (data as Partial<SiteData> | null)?.sites;
  return Array.isArray(raw) ? raw : (sitesDefault as SiteData).sites;
}

function normMessages(data: unknown): Message[] {
  const raw = (data as Partial<MessageData> | null)?.messages;
  return Array.isArray(raw) ? raw : (messagesDefault as MessageData).messages;
}

function normSettings(data: unknown): Settings {
  const raw = data as Partial<Settings> | null;
  if (raw && typeof raw.siteName === "string") {
    return { ...(settingsDefault as Settings), ...raw };
  }
  return settingsDefault as Settings;
}

/**
 * 读取组合数据。优先从 GitHub 仓库实时读取（后台改完即可生效），
 * 未配置或读取失败时回退到本地默认数据。
 */
export async function getCombinedData(): Promise<CombinedData> {
  const sites = githubConfigured()
    ? await cached("sites", () => readJsonFile<SiteData>(DATA_PATHS.sites))
    : null;
  const messages = githubConfigured()
    ? await cached("messages", () => readJsonFile<MessageData>(DATA_PATHS.messages))
    : null;
  const settings = githubConfigured()
    ? await cached("settings", () => readJsonFile<Settings>(DATA_PATHS.settings))
    : null;

  return {
    sites: normSites(sites),
    messages: normMessages(messages),
    settings: normSettings(settings),
  };
}

/** 仅读取网站列表（首页用）。 */
export async function getSites(): Promise<Site[]> {
  if (!githubConfigured()) return (sitesDefault as SiteData).sites;
  const data = await cached("sites", () => readJsonFile<SiteData>(DATA_PATHS.sites));
  return normSites(data);
}

/** 清除缓存（写操作成功后调用，让读取立即生效）。 */
export function clearCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}
