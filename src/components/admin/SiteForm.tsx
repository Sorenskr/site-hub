"use client";

import { useState } from "react";
import type { Site, SiteStatus } from "@/lib/types";

export default function SiteForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Site;
  onSave: (s: Site) => void;
  onCancel: () => void;
}) {
  const [s, setS] = useState<Site>(initial);
  const [tagsText, setTagsText] = useState((initial.tags ?? []).join(", "));
  const [error, setError] = useState("");

  function set<K extends keyof Site>(k: K, v: Site[K]) {
    setS((prev) => ({ ...prev, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!s.name.trim()) {
      setError("请填写网站名称");
      return;
    }
    if (!s.url.trim()) {
      setError("请填写网站网址");
      return;
    }
    const tags = tagsText
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ ...s, tags });
  }

  const field =
    "input-base";
  const label = "text-xs font-medium text-sub mb-1 block";

  return (
    <form
      onSubmit={submit}
      className="glass mb-6 grid gap-4 rounded-2xl p-5 sm:grid-cols-2"
    >
      <div>
        <span className={label}>网站名称 *</span>
        <input
          className={field}
          value={s.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="例如：Laya 播放器"
        />
      </div>
      <div>
        <span className={label}>网址 *</span>
        <input
          className={field}
          value={s.url}
          onChange={(e) => set("url", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="sm:col-span-2">
        <span className={label}>简介</span>
        <textarea
          className={field}
          rows={2}
          value={s.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="一句话介绍这个网站"
        />
      </div>

      <div>
        <span className={label}>分类</span>
        <input
          className={field}
          value={s.category}
          onChange={(e) => set("category", e.target.value)}
          placeholder="例如：AI 助手"
        />
      </div>
      <div>
        <span className={label}>标签（用逗号分隔）</span>
        <input
          className={field}
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="AI, 工具"
        />
      </div>

      <div>
        <span className={label}>Logo（emoji 或图片链接）</span>
        <input
          className={field}
          value={s.logo ?? ""}
          onChange={(e) => set("logo", e.target.value)}
          placeholder="留空 = 显示首字母；如 🌐 或 https://..."
        />
      </div>
      <div>
        <span className={label}>访问量（可随意设置）</span>
        <input
          className={field}
          type="number"
          value={s.visitors}
          onChange={(e) => set("visitors", Number(e.target.value) || 0)}
        />
      </div>

      <div>
        <span className={label}>源代码地址</span>
        <input
          className={field}
          value={s.sourceUrl ?? ""}
          onChange={(e) => set("sourceUrl", e.target.value)}
          placeholder="https://github.com/..."
        />
      </div>
      <div>
        <span className={label}>国内访问地址</span>
        <input
          className={field}
          value={s.domesticUrl ?? ""}
          onChange={(e) => set("domesticUrl", e.target.value)}
          placeholder="https://...（可选）"
        />
      </div>

      <div>
        <span className={label}>状态</span>
        <select
          className={field}
          value={s.status}
          onChange={(e) => set("status", e.target.value as SiteStatus)}
        >
          <option value="online">在线</option>
          <option value="offline">离线</option>
          <option value="unknown">未知</option>
        </select>
      </div>
      <div className="flex items-end pb-1">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={s.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 accent-[rgb(var(--brand))]"
          />
          设为推荐（⭐）
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500 sm:col-span-2">{error}</p>
      )}

      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" className="btn-brand">
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="glass rounded-xl px-4 py-2 text-sub transition hover:text-ink"
        >
          取消
        </button>
      </div>
    </form>
  );
}
