import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";
import { getCombinedData } from "@/lib/data";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminPanel from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const loggedIn = verifyToken(cookies().get(ADMIN_COOKIE)?.value);
  const data = await getCombinedData();

  const repoUrl =
    process.env.GITHUB_OWNER && process.env.GITHUB_REPO
      ? `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`
      : data.settings.github || "";

  if (!loggedIn) {
    return <AdminLogin />;
  }

  return (
    <AdminPanel
      sites={data.sites}
      messages={data.messages}
      settings={data.settings}
      repoUrl={repoUrl}
    />
  );
}
