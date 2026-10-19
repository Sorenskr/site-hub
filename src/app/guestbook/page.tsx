import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuestbookForm from "@/components/GuestbookForm";
import { getCombinedData } from "@/lib/data";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Guestbook() {
  const { messages, settings } = await getCombinedData();
  const sorted = [...messages].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <>
      <Navbar settings={settings} />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-12">
        <h1 className="mb-2 text-3xl font-extrabold">
          <span className="gradient-text">留言板</span>
        </h1>
        <p className="mb-8 text-sub">
          欢迎反馈问题、建议新功能，或告诉我你想添加哪个网站～
        </p>

        <GuestbookForm />

        <div className="mt-8 flex flex-col gap-3">
          {sorted.map((m) => (
            <div key={m.id} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{m.nickname}</span>
                <span className="text-xs text-sub">{formatDate(m.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {m.content}
              </p>
            </div>
          ))}
          {sorted.length === 0 && (
            <p className="py-10 text-center text-sub">还没有留言，来抢沙发～</p>
          )}
        </div>
      </main>

      <Footer settings={settings} />
    </>
  );
}
