import type { Settings } from "@/lib/types";
import HiddenAdminTrigger from "./HiddenAdminTrigger";

export default function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="border-t border-line/10 py-12 text-center">
      <div className="mx-auto max-w-2xl px-5">
        <HiddenAdminTrigger>
          <p className="text-sm text-sub">{settings.footer ?? "感谢访问"}</p>
        </HiddenAdminTrigger>
        <div className="hairline my-6" />
        <p className="text-xs text-sub/70">
          Vercel（国外） · 腾讯云 CloudBase（国内） · 数据存于 GitHub
        </p>
      </div>
    </footer>
  );
}
