"use server"

import * as fal from "@fal-ai/serverless-client"

// 设置FAL API密钥
fal.config({
  credentials: process.env.FAL_KEY,
})

export async function generateVirtualTryOn(personImageUrl: string, clothingImageUrl: string) {
  try {
    // 调用cat-vton模型API
    const result = await fal.run("fal-ai/cat-vton", {
      input: {
        person_image: personImageUrl,
        garment_image: clothingImageUrl,
      },
    })

    // 返回生成的图片URL
    return result.output.tryon_image
  } catch (error) {
    console.error("Virtual try-on generation failed:", error)
    throw new Error("生成试穿照片失败，请重试")
  }
}
