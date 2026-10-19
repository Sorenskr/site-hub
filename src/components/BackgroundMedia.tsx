"use client";

import { useState } from "react";

/**
 * 预留替换点：把你自己的背景文件放到 public 目录即可自动启用。
 *   - 视频：public/background.mp4
 *   - 图片：public/background.jpg
 * 未提供文件时自动隐藏，下方由 ParticleField 的星云背景兜底。
 */
export default function BackgroundMedia() {
  const [videoOk, setVideoOk] = useState(true);
  const [imgOk, setImgOk] = useState(true);

  if (!videoOk && !imgOk) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {videoOk && (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoOk(false)}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      )}
      {imgOk && !videoOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/background.jpg"
          className="h-full w-full object-cover"
          alt=""
          onError={() => setImgOk(false)}
        />
      )}
      {/* 压暗一层，保证前景文字可读 */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
