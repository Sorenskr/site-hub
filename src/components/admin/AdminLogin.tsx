"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "登录失败");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="grid min-h-screen place-items-center px-4">
        <form
          onSubmit={submit}
          className="glass flex w-full max-w-sm flex-col gap-4 rounded-2xl p-8"
        >
          <div className="text-center">
            <div className="text-4xl">🔐</div>
            <h1 className="mt-2 text-2xl font-bold">后台管理</h1>
            <p className="mt-1 text-sm text-sub">请输入管理密码</p>
          </div>
          <input
            type="password"
            className="input-base"
            placeholder="管理密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-brand" disabled={loading}>
            {loading ? "登录中…" : "进入后台"}
          </button>
        </form>
      </div>
    </>
  );
}
