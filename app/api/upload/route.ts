import { NextRequest, NextResponse } from "next/server";
import { fal } from "@/lib/fal-client";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const url = await fal.storage.upload(file);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: "文件上传失败" }, { status: 500 });
  }
} 