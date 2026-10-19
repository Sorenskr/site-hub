"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

/** 隐蔽入口：连续点击 5 次进入后台。 */
export default function HiddenAdminTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const count = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handle() {
    count.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      count.current = 0;
    }, 1500);

    if (count.current >= 5) {
      count.current = 0;
      if (timer.current) clearTimeout(timer.current);
      router.push("/admin");
    }
  }

  return (
    <span onClick={handle} className="cursor-default select-none" title="">
      {children}
    </span>
  );
}
