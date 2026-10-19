"use client";

import { useEffect, useRef } from "react";

export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let dark = document.documentElement.classList.contains("dark");
    let raf = 0;

    type Blob = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      hue: string;
      a: number;
    };

    const blobs: Blob[] = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 0.28,
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00025,
      hue: i % 2 === 0 ? "201 169 106" : i % 2 === 1 ? "129 140 248" : "34 211 238",
      a: 0.1,
    }));

    let stars: {
      x: number;
      y: number;
      r: number;
      p: number;
      s: number;
      a: number;
    }[] = [];

    function syncTheme() {
      dark = document.documentElement.classList.contains("dark");
      for (const b of blobs) {
        if (b.hue.startsWith("201")) b.a = dark ? 0.38 : 0.2;
        else b.a = dark ? 0.32 : 0.18;
      }
    }

    function initStars() {
      const n = Math.min(220, Math.floor((w * h) / 8500));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.6,
        p: Math.random() * Math.PI * 2,
        s: 0.3 + Math.random() * 1.2,
        a: 0.35 + Math.random() * 0.55,
      }));
    }

    syncTheme();
    initStars();
    const start = performance.now();

    function draw(t: number) {
      const time = (t - start) / 1000;
      ctx!.clearRect(0, 0, w, h);

      for (const b of blobs) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -0.25 || b.x > 1.25) b.vx *= -1;
        if (b.y < -0.25 || b.y > 1.25) b.vy *= -1;
        const cx = b.x * w;
        const cy = b.y * h;
        const rad = b.r * Math.max(w, h);
        const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, `rgba(${b.hue}, ${b.a})`);
        g.addColorStop(1, `rgba(${b.hue}, 0)`);
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, w, h);
      }

      for (const s of stars) {
        const al = s.a * (0.45 + 0.55 * Math.sin(time * s.s + s.p));
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${al})`;
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
      initStars();
    }
    window.addEventListener("resize", resize);

    const mo = new MutationObserver(syncTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
