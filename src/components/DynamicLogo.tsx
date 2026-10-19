import type { Site } from "@/lib/types";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export default function DynamicLogo({
  site,
  size = 52,
}: {
  site: Site;
  size?: number;
}) {
  const logo = site.logo ?? "";
  const isUrl = logo.startsWith("http");
  const isEmoji = logo && !isUrl && logo !== "auto";
  const MOTIONS = ["logo-float", "logo-spin", "logo-pulse"] as const;
  const motion = MOTIONS[hash(site.id) % MOTIONS.length];

  return (
    <div
      className="logo-badge shrink-0"
      style={{ width: size, height: size }}
    >
      <div
        className={`flex h-full w-full items-center justify-center overflow-hidden rounded-full ${motion}`}
        style={{
          background: "rgb(var(--card))",
          boxShadow: "inset 0 0 0 1px rgba(var(--line),0.5)",
        }}
      >
        {isUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={site.name} className="h-full w-full object-cover" />
        ) : isEmoji ? (
          <span style={{ fontSize: size * 0.5, lineHeight: 1 }}>{logo}</span>
        ) : (
          <span
            className="gold-text font-bold"
            style={{ fontSize: size * 0.42 }}
          >
            {(site.name || "?").charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
