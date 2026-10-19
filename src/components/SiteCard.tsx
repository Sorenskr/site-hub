"use client";

import { motion } from "framer-motion";
import type { Site } from "@/lib/types";
import DynamicLogo from "./DynamicLogo";

const STATUS: Record<string, { text: string; dot: string }> = {
  online: { text: "在线", dot: "bg-green-500" },
  offline: { text: "离线", dot: "bg-red-500" },
  unknown: { text: "未知", dot: "bg-gray-400" },
};

export default function SiteCard({
  site,
  index,
}: {
  site: Site;
  index: number;
}) {
  const s = STATUS[site.status] ?? STATUS.unknown;
  const no = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 12) * 0.04 }}
      className="exhibit group flex flex-col p-6"
    >
      <div className="flex items-start justify-between">
        <div className="exhibit-no">{no}</div>
        <span className="flex items-center gap-1.5 text-xs text-sub">
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.text}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <DynamicLogo site={site} size={52} />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-medium text-ink">{site.name}</h3>
          {site.category && (
            <span className="mt-0.5 inline-block text-xs text-[rgb(var(--accent))]">
              {site.category}
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-sub">
        {site.description}
      </p>

      {site.tags && site.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {site.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line/15 px-2.5 py-0.5 text-xs text-sub"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-line/10 pt-4 text-xs text-sub">
        <span>👀 {site.visitors.toLocaleString()} 次访问</span>
        {site.featured && <span className="gold-text font-medium">★ 精选</span>}
      </div>

      <div className="mt-4 flex gap-2">
        <a
          href={site.url}
          target="_blank"
          rel="noreferrer"
          className="btn-gold flex-1 py-2.5 text-center text-sm"
        >
          访问作品 →
        </a>
        {site.sourceUrl && (
          <a
            href={site.sourceUrl}
            target="_blank"
            rel="noreferrer"
            title="源代码"
            className="btn-ghost grid h-10 w-10 shrink-0 place-items-center text-[rgb(var(--ink))]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
          </a>
        )}
        {site.domesticUrl && (
          <a
            href={site.domesticUrl}
            target="_blank"
            rel="noreferrer"
            title="国内访问"
            className="btn-ghost grid h-10 w-10 shrink-0 place-items-center text-[rgb(var(--ink))]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" />
            </svg>
          </a>
        )}
      </div>
    </motion.article>
  );
}
