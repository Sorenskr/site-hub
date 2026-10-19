import { NextResponse } from "next/server";
import { getCombinedData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCombinedData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "读取数据失败", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
