"use client"

export async function generateTryOnPhoto(personImage: string, clothingUrl: string): Promise<string> {
  try {
    console.log("开始生成试穿照片...")
    console.log("人物图片:", personImage)
    console.log("衣服图片:", clothingUrl)

    const response = await fetch("/api/try-on", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personImage,
        clothingUrl,
      }),
    })

    console.log("API响应状态:", response.status)

    const data = await response.json()
    console.log("API响应数据:", data)

    if (!response.ok) {
      console.error("API错误:", data)
      throw new Error(data.error || `HTTP ${response.status}: 生成失败`)
    }

    if (!data.success || !data.resultImage) {
      console.error("API返回数据格式错误:", data)
      throw new Error("API返回数据格式错误")
    }

    console.log("生成成功，图片URL:", data.resultImage)
    return data.resultImage
  } catch (error) {
    console.error("生成失败:", error)

    if (error instanceof Error) {
      throw error
    }

    throw new Error("网络错误，请检查连接后重试")
  }
}

// 测试API连接的函数
export async function testApiConnection(): Promise<any> {
  try {
    const response = await fetch("/api/test")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("测试API连接失败:", error)
    throw error
  }
}
