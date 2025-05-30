import { fal } from "@fal-ai/client"

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("文件上传失败");
  const data = await response.json();
  return data.url;
} 