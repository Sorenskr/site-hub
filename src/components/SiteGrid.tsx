"use client";

import { useMemo, useState } from "react";
import type { Site } from "@/lib/types";
import SiteCard from "./SiteCard";

export default function SiteGrid({ sites }: { sites: Site[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    sites.forEach((s) => s.category && set.add(s.category));
    return ["全部", ...Array.from(set)];
  }, [sites]);

  const [cat, setCat] = useState("全部");
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const filtered = sites
    .filter((s) => (cat === "全部" ? true : s.category === cat))
    .filter((s) => (onlyFeatured ? s.featured : true))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <section>
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              cat === c ? "btn-gold" : "btn-ghost text-sub"
            }`}
          >
            {c}
          </button>
        ))}
        <button
          onClick={() => setOnlyFeatured((v) => !v)}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            onlyFeatured ? "btn-gold" : "btn-ghost text-sub"
          }`}
        >
          ★ 精选
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s, i) => (
          <SiteCard key={s.id} site={s} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-sub">该分类下暂时没有内容～</p>
      )}
    </section>
  );
}
