import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // 检查环境变量
    const hasApiKey = !!process.env.FAL_KEY
    const apiKeyPrefix = process.env.FAL_KEY ? process.env.FAL_KEY.substring(0, 10) + "..." : "未设置"

    return NextResponse.json({
      status: "API正常运行",
      hasApiKey,
      apiKeyPrefix,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "测试API失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}
