"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Message, Settings, Site } from "@/lib/types";
import DynamicLogo from "@/components/DynamicLogo";
import SiteForm from "./SiteForm";

type Tab = "sites" | "messages" | "settings" | "about";

function emptySite(): Site {
  return {
    id: `site-${Date.now()}`,
    name: "",
    description: "",
    url: "",
    category: "",
    enabled: true,
    featured: false,
    sourceUrl: "",
    domesticUrl: "",
    logo: "",
    visitors: 0,
    status: "online",
    tags: [],
    createdAt: new Date().toISOString(),
    order: 999,
  };
}

export default function AdminPanel({
  sites: initialSites,
  messages: initialMessages,
  settings: initialSettings,
  repoUrl,
}: {
  sites: Site[];
  messages: Message[];
  settings: Settings;
  repoUrl?: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("sites");
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [editing, setEditing] = useState<Site | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  function flash(ok: boolean, text: string) {
    setNotice({ ok, text });
    setTimeout(() => setNotice(null), 4000);
  }

  async function api(body: Record<string, unknown>) {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "操作失败");
    return data;
  }

  // ---------- 网站 ----------
  function saveSite(site: Site) {
    const idx = sites.findIndex((s) => s.id === site.id);
    if (idx >= 0) {
      setSites((prev) => prev.map((s) => (s.id === site.id ? site : s)));
    } else {
      setSites((prev) => [...prev, site]);
    }
    setEditing(null);
  }

  function toggleSite(id: string, key: "enabled" | "featured") {
    setSites((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: !s[key] } : s))
    );
  }

  function moveSite(id: string, dir: -1 | 1) {
    setSites((prev) => {
      const arr = [...prev].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const i = arr.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return prev;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr.map((s, idx) => ({ ...s, order: idx }));
    });
  }

  function deleteSite(id: string) {
    if (!window.confirm("确定删除这个网站？此操作不可撤销。")) return;
    setSites((prev) => prev.filter((s) => s.id !== id));
  }

  async function saveSites() {
    setBusy(true);
    try {
      await api({ action: "saveSites", sites });
      flash(true, "网站列表已保存，并同步到 GitHub ✅");
    } catch (e) {
      flash(false, (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  // ---------- 留言 ----------
  async function deleteMessage(id: string) {
    if (!window.confirm("删除这条留言？")) return;
    setBusy(true);
    try {
      await api({ action: "deleteMessage", id });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      flash(true, "留言已删除 ✅");
    } catch (e) {
      flash(false, (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  // ---------- 设置 ----------
  async function saveSettings() {
    setBusy(true);
    try {
      await api({ action: "saveSettings", settings });
      flash(true, "设置已保存，并同步到 GitHub ✅");
    } catch (e) {
      flash(false, (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => {});
    router.refresh();
  }

  const sortedSites = [...sites].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const sortedMessages = [...messages].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  const tabBtn = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      active ? "btn-brand !rounded-lg" : "glass text-sub hover:text-ink"
    }`;

  const setField = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setSettings((prev) => ({ ...prev, [k]: v }));

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-8">
        {/* 顶栏 */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">
            <span className="gradient-text">⚙️ 后台管理</span>
          </h1>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="glass rounded-lg px-3 py-2 text-sm text-sub transition hover:text-ink"
            >
              查看前台
            </a>
            <button
              onClick={logout}
              className="glass rounded-lg px-3 py-2 text-sm text-sub transition hover:text-ink"
            >
              退出登录
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => setTab("sites")} className={tabBtn(tab === "sites")}>
            网站管理（{sites.length}）
          </button>
          <button
            onClick={() => setTab("messages")}
            className={tabBtn(tab === "messages")}
          >
            留言管理（{messages.length}）
          </button>
          <button
            onClick={() => setTab("settings")}
            className={tabBtn(tab === "settings")}
          >
            站点设置
          </button>
          <button
            onClick={() => setTab("about")}
            className={tabBtn(tab === "about")}
          >
            源码位置
          </button>
        </div>

        {/* 提示条 */}
        {notice && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-sm ${
              notice.ok
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {notice.text}
          </div>
        )}

        {/* ===== 网站管理 ===== */}
        {tab === "sites" && (
          <section>
            {editing ? (
              <SiteForm
                key={editing.id}
                initial={editing}
                onSave={saveSite}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <button onClick={() => setEditing(emptySite())} className="btn-brand mb-4">
                ＋ 添加网站
              </button>
            )}

            <div className="mb-4 flex justify-end">
              <button onClick={saveSites} disabled={busy} className="btn-brand">
                {busy ? "保存中…" : "💾 保存并同步到 GitHub"}
              </button>
            </div>

            <div className="space-y-2">
              {sortedSites.map((s, i) => (
                <div
                  key={s.id}
                  className={`glass flex flex-wrap items-center gap-3 rounded-xl p-3 ${
                    s.enabled ? "" : "opacity-50"
                  }`}
                >
                  <DynamicLogo site={s} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">
                      {s.name || "（未命名）"}
                    </div>
                    <div className="truncate text-xs text-sub">{s.url}</div>
                  </div>

                  {/* 显示开关 */}
                  <button
                    onClick={() => toggleSite(s.id, "enabled")}
                    title="显示 / 隐藏"
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      s.enabled ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        s.enabled ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => toggleSite(s.id, "featured")}
                    title="推荐"
                    className="text-lg leading-none"
                  >
                    {s.featured ? "⭐" : "☆"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSite(s.id, -1)}
                      disabled={i === 0}
                      className="glass rounded-md px-2 py-1 text-xs text-sub transition hover:text-ink disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSite(s.id, 1)}
                      disabled={i === sortedSites.length - 1}
                      className="glass rounded-md px-2 py-1 text-xs text-sub transition hover:text-ink disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>

                  <button
                    onClick={() => setEditing({ ...s })}
                    className="rounded-md px-2 py-1 text-xs font-medium text-brand transition hover:bg-brand/10"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => deleteSite(s.id)}
                    className="rounded-md px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
                  >
                    删除
                  </button>
                </div>
              ))}
              {sortedSites.length === 0 && (
                <p className="py-10 text-center text-sub">
                  还没有网站，点击上方“添加网站”开始吧～
                </p>
              )}
            </div>
          </section>
        )}

        {/* ===== 留言管理 ===== */}
        {tab === "messages" && (
          <section className="space-y-2">
            {sortedMessages.map((m) => (
              <div key={m.id} className="glass flex items-start gap-3 rounded-xl p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{m.nickname}</span>
                    <span className="text-xs text-sub">
                      {new Date(m.createdAt).toLocaleString("zh-CN")}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{m.content}</p>
                </div>
                <button
                  onClick={() => deleteMessage(m.id)}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
                >
                  删除
                </button>
              </div>
            ))}
            {sortedMessages.length === 0 && (
              <p className="py-10 text-center text-sub">暂无留言</p>
            )}
          </section>
        )}

        {/* ===== 设置 ===== */}
        {tab === "settings" && (
          <section className="glass rounded-2xl p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="mb-1 block text-xs font-medium text-sub">站点名称</span>
                <input
                  className="input-base"
                  value={settings.siteName}
                  onChange={(e) => setField("siteName", e.target.value)}
                />
              </div>
              <div>
                <span className="mb-1 block text-xs font-medium text-sub">头像（emoji）</span>
                <input
                  className="input-base"
                  value={settings.avatar ?? ""}
                  onChange={(e) => setField("avatar", e.target.value)}
                />
              </div>
              <div>
                <span className="mb-1 block text-xs font-medium text-sub">标语 Slogan</span>
                <input
                  className="input-base"
                  value={settings.slogan}
                  onChange={(e) => setField("slogan", e.target.value)}
                />
              </div>
              <div>
                <span className="mb-1 block text-xs font-medium text-sub">GitHub 主页</span>
                <input
                  className="input-base"
                  value={settings.github ?? ""}
                  onChange={(e) => setField("github", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <span className="mb-1 block text-xs font-medium text-sub">站点介绍</span>
                <textarea
                  className="input-base"
                  rows={2}
                  value={settings.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </div>
              <div>
                <span className="mb-1 block text-xs font-medium text-sub">页脚文字</span>
                <input
                  className="input-base"
                  value={settings.footer ?? ""}
                  onChange={(e) => setField("footer", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="mb-1 block text-xs font-medium text-sub">在线人数基准</span>
                  <input
                    className="input-base"
                    type="number"
                    value={settings.onlineBaseline ?? 18}
                    onChange={(e) =>
                      setField("onlineBaseline", Number(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <span className="mb-1 block text-xs font-medium text-sub">在线人数浮动范围</span>
                  <input
                    className="input-base"
                    type="number"
                    value={settings.onlineRange ?? 46}
                    onChange={(e) =>
                      setField("onlineRange", Number(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={saveSettings} disabled={busy} className="btn-brand">
                {busy ? "保存中…" : "💾 保存设置"}
              </button>
            </div>
          </section>
        )}

        {/* ===== 源码位置 ===== */}
        {tab === "about" && (
          <section className="glass rounded-2xl p-6">
            <h2 className="mb-4 text-lg font-bold">📦 源代码位置</h2>
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sub">本网站源代码仓库：</span>
                {repoUrl ? (
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-brand hover:underline"
                  >
                    {repoUrl}
                  </a>
                ) : (
                  <span className="text-sub">（未配置 GITHUB_OWNER / GITHUB_REPO）</span>
                )}
              </div>
              <p className="text-sub">
                数据（网站列表、留言、设置）均存储在仓库的{" "}
                <code className="rounded bg-card px-1.5 py-0.5 text-xs">data/*.json</code>{" "}
                文件中，后台修改后会自动提交到 GitHub，访客通过 API 实时读取。
              </p>
              <div className="rounded-xl bg-card p-4">
                <div className="mb-2 font-medium">部署平台</div>
                <ul className="list-inside list-disc space-y-1 text-sub">
                  <li>Vercel（国外访问）— 推荐直接导入 GitHub 仓库</li>
                  <li>腾讯云 CloudBase 云托管（国内访问）— 使用 Dockerfile 部署</li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
