"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestbookForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError("请先输入留言内容～");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "提交失败");
      setNickname("");
      setContent("");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="glass flex flex-col gap-3 rounded-2xl p-5"
    >
      <input
        className="input-base"
        placeholder="你的昵称（可选）"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={30}
      />
      <textarea
        className="input-base min-h-[120px] resize-y"
        placeholder="反馈问题、建议新功能、或者想让我添加哪个网站…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-sub">{content.length}/500</span>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
      <button className="btn-brand self-end" disabled={loading}>
        {loading ? "提交中…" : "发布留言"}
      </button>
    </form>
  );
}
