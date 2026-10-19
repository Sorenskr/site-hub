import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VisitorCounter from "@/components/VisitorCounter";
import SiteGrid from "@/components/SiteGrid";
import { getCombinedData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { sites, settings } = await getCombinedData();
  const enabled = sites.filter((s) => s.enabled);
  const total = enabled.reduce((sum, s) => sum + (s.visitors || 0), 0);

  return (
    <>
      <Navbar settings={settings} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-28">
        {/* Hero */}
        <section className="flex min-h-[78vh] flex-col items-center justify-center py-20 text-center">
          <div className="fade-up text-[11px] uppercase tracking-mega text-sub">
            Collection · 作品收藏
          </div>
          <h1
            className="fade-up display mt-6 text-6xl gold-text sm:text-8xl"
            style={{ animationDelay: "0.1s" }}
          >
            {settings.siteName}
          </h1>
          <p
            className="fade-up mt-8 max-w-xl text-lg font-light leading-relaxed text-sub"
            style={{ animationDelay: "0.2s" }}
          >
            {settings.slogan}
          </p>

          <div
            className="fade-up mt-10"
            style={{ animationDelay: "0.3s" }}
          >
            <VisitorCounter
              baseline={settings.onlineBaseline}
              range={settings.onlineRange}
              total={total}
            />
          </div>

          <div
            className="fade-up mt-12 flex items-center gap-3"
            style={{ animationDelay: "0.4s" }}
          >
            <a href="#works" className="btn-gold px-7 py-3">
              浏览全部作品
            </a>
            <a href="/guestbook" className="btn-ghost px-7 py-3 text-ink">
              留言板
            </a>
          </div>
        </section>

        {/* 理念区 */}
        <section className="mx-auto max-w-3xl py-14 text-center">
          <div className="hairline mb-10" />
          <p className="manifesto text-[rgb(var(--sub))]">
            {settings.description}
          </p>
          <div className="hairline mt-10" />
        </section>

        {/* 作品 */}
        <section id="works" className="scroll-mt-24 pt-4">
          <div className="mb-10 text-center">
            <h2 className="display text-3xl sm:text-4xl">收录作品</h2>
            <p className="mt-3 text-sm text-sub">
              共 {enabled.length} 件 · 每一个都曾认真做过
            </p>
          </div>
          <SiteGrid sites={enabled} />
        </section>
      </main>

      <Footer settings={settings} />
    </>
  );
}
