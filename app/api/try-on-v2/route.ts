import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { personImage, clothingUrl } = await request.json()

    if (!personImage || !clothingUrl) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    // 使用fetch直接调用fal.ai API
    const response = await fetch("https://fal.run/fal-ai/cat-vton", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        person_image_url: personImage,
        garment_image_url: clothingUrl,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("fal.ai API错误:", response.status, errorText)
      return NextResponse.json(
        {
          error: `fal.ai API错误: ${response.status}`,
          details: errorText,
        },
        { status: 500 },
      )
    }

    const result = await response.json()
    console.log("fal.ai API 响应:", result)

    // 检查结果结构
    if (!result || !result.image) {
      console.error("API返回格式异常:", result)
      return NextResponse.json({ error: "API返回格式异常" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      resultImage: result.image.url,
    })
  } catch (error) {
    console.error("Virtual try-on generation failed:", error)
    return NextResponse.json(
      {
        error: "生成试穿照片失败，请重试",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}
