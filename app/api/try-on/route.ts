import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { personImage, clothingUrl } = await request.json()

    console.log("收到请求:", { personImage, clothingUrl })

    if (!personImage || !clothingUrl) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    // 确保URL是完整的
    if (!personImage.startsWith('http') || !clothingUrl.startsWith('http')) {
      return NextResponse.json({ error: "图片URL无效" }, { status: 400 })
    }

    if (!process.env.FAL_KEY) {
      console.error("FAL_KEY环境变量未设置")
      return NextResponse.json({ error: "服务配置错误" }, { status: 500 })
    }

    console.log("开始调用fal.ai API...")

    // 使用fetch直接调用fal.ai REST API
    const response = await fetch("https://fal.run/fal-ai/cat-vton", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        human_image_url: personImage,
        garment_image_url: clothingUrl,
        cloth_type: "upper",
        image_size: "portrait_4_3",
        num_inference_steps: 30,
        guidance_scale: 2.5
      }),
    })

    console.log("fal.ai API响应状态:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("fal.ai API错误:", response.status, errorText)

      return NextResponse.json(
        {
          error: `API调用失败 (${response.status})`,
          details: errorText,
        },
        { status: 500 },
      )
    }

    const result = await response.json()
    console.log("fal.ai API成功响应:", result)

    // 检查返回的数据结构
    if (!result) {
      return NextResponse.json({ error: "API返回空结果" }, { status: 500 })
    }

    // 尝试不同的可能的返回格式
    let imageUrl = null
    if (result.image?.url) {
      imageUrl = result.image.url
    } else if (result.image) {
      imageUrl = result.image
    } else if (result.output?.image?.url) {
      imageUrl = result.output.image.url
    } else if (result.output?.image) {
      imageUrl = result.output.image
    } else if (result.url) {
      imageUrl = result.url
    }

    if (!imageUrl) {
      console.error("无法从API响应中提取图片URL:", result)
      return NextResponse.json(
        {
          error: "API返回格式异常",
          details: "无法找到生成的图片URL",
          response: result,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      resultImage: imageUrl,
    })
  } catch (error) {
    console.error("API路由错误:", error)

    let errorMessage = "生成试穿照片失败"
    let errorDetails = "未知错误"

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || error.message
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}
