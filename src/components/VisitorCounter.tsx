"use client";

import { useEffect, useState } from "react";

export default function VisitorCounter({
  baseline = 18,
  range = 46,
  total,
}: {
  baseline?: number;
  range?: number;
  total?: number;
}) {
  const [online, setOnline] = useState(baseline);

  useEffect(() => {
    let alive = true;
    function tick() {
      if (!alive) return;
      const next = baseline + Math.floor(Math.random() * range);
      setOnline(next);
    }
    tick();
    const id = setInterval(tick, 3500);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [baseline, range]);

  return (
    <div className="flex items-center gap-2 text-sm text-sub">
      <span className="relative flex h-2.5 w-2.5">
        <span className="dot-online absolute inline-flex h-full w-full rounded-full" />
      </span>
      <span>
        当前在线 <b className="text-ink">{online}</b> 人
      </span>
      {typeof total === "number" && (
        <>
          <span className="text-line">·</span>
          <span>
            累计访问 <b className="text-ink">{total.toLocaleString()}</b>
          </span>
        </>
      )}
    </div>
  );
}
