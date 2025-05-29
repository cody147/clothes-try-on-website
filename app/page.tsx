"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Sparkles, History, Download, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { generateTryOnPhoto, testApiConnection } from "@/lib/try-on-service"

interface TryOnResult {
  id: string
  personImage: string
  clothingUrl: string
  resultImage: string
  timestamp: number
}

export default function ClothesToryOnApp() {
  const [personImage, setPersonImage] = useState<string>("")
  const [clothingUrl, setClothingUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentResult, setCurrentResult] = useState<TryOnResult | null>(null)
  const [history, setHistory] = useState<TryOnResult[]>([])
  const [error, setError] = useState<string | null>(null)

  // 从localStorage加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem("tryOnHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // 保存历史记录到localStorage
  const saveToHistory = (result: TryOnResult) => {
    const newHistory = [result, ...history].slice(0, 10) // 只保留最近10条
    setHistory(newHistory)
    localStorage.setItem("tryOnHistory", JSON.stringify(newHistory))
  }

  // 测试API连接
  const testConnection = async () => {
    try {
      const result = await testApiConnection()
      console.log("API测试结果:", result)
      setError(`API测试成功: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      console.error("API测试失败:", error)
      setError(`API测试失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 生成试穿照片
  // const generateTryOnPhoto = async (): Promise<string> => {
  //   try {
  //     // 调用fal.ai的cat-vton模型
  //     const resultImageUrl = await generateVirtualTryOn(personImage, clothingUrl)
  //     return resultImageUrl
  //   } catch (error) {
  //     console.error("生成失败:", error)
  //     throw error
  //   }
  // }

  // 处理生成按钮点击
  const handleGenerate = async () => {
    if (!personImage || !clothingUrl) {
      setError("请输入人物照片和衣服图片URL")
      return
    }

    // 验证URL格式
    try {
      new URL(personImage)
      new URL(clothingUrl)
    } catch {
      setError("请输入有效的图片URL地址")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      console.log("开始生成试穿照片...")
      const resultImageUrl = await generateTryOnPhoto(personImage, clothingUrl)
      console.log("生成成功:", resultImageUrl)

      const result: TryOnResult = {
        id: Date.now().toString(),
        personImage,
        clothingUrl,
        resultImage: resultImageUrl,
        timestamp: Date.now(),
      }

      setCurrentResult(result)
      saveToHistory(result)
    } catch (error) {
      console.error("生成失败:", error)
      if (error instanceof Error) {
        setError(`生成失败: ${error.message}`)
      } else {
        setError("生成失败，请检查图片URL或稍后重试")
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // 下载图片
  const downloadImage = (imageUrl: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `tryon-result-${Date.now()}.png`
    link.click()
  }

  // 分享功能
  const shareResult = async () => {
    if (navigator.share && currentResult) {
      try {
        await navigator.share({
          title: "我的试穿效果",
          text: "看看我的虚拟试穿效果！",
          url: window.location.href,
        })
      } catch (error) {
        console.log("分享失败")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI 衣服试穿
          </h1>
          <p className="text-gray-600 text-lg">输入照片链接，选择心仪的衣服，AI 帮你试穿</p>
        </div>

        <Tabs defaultValue="tryon" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="tryon" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              虚拟试穿
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              历史记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tryon">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 左侧：输入区域 */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      输入你的照片链接
                    </CardTitle>
                    <CardDescription>请输入一张清晰的全身照或半身照URL</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="person-url">照片URL</Label>
                      <Input
                        id="person-url"
                        placeholder="https://example.com/person.jpg"
                        value={personImage}
                        onChange={(e) => setPersonImage(e.target.value)}
                      />
                    </div>
                    {personImage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">预览：</p>
                        <Image
                          src={personImage || "/placeholder.svg"}
                          alt="人物照片预览"
                          width={200}
                          height={300}
                          className="mx-auto rounded-lg object-cover"
                          onError={() => setError("人物照片加载失败，请检查URL")}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>衣服图片链接</CardTitle>
                    <CardDescription>输入你想试穿的衣服图片URL地址</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="clothing-url">图片URL</Label>
                        <Input
                          id="clothing-url"
                          placeholder="https://example.com/clothing.jpg"
                          value={clothingUrl}
                          onChange={(e) => setClothingUrl(e.target.value)}
                        />
                      </div>
                      {clothingUrl && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">预览：</p>
                          <Image
                            src={clothingUrl || "/placeholder.svg"}
                            alt="衣服预览"
                            width={150}
                            height={200}
                            className="rounded-lg object-cover"
                            onError={() => setError("衣服图片加载失败，请检查URL")}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
                )}

                <Button onClick={testConnection} variant="outline" className="w-full mb-4">
                  测试API连接
                </Button>

                <Button
                  onClick={handleGenerate}
                  disabled={!personImage || !clothingUrl || isGenerating}
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      AI 正在生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      开始试穿
                    </>
                  )}
                </Button>
              </div>

              {/* 右侧：结果展示 */}
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>试穿效果</CardTitle>
                    <CardDescription>AI 生成的试穿效果图</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentResult ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <Image
                            src={currentResult.resultImage || "/placeholder.svg"}
                            alt="试穿效果"
                            width={400}
                            height={600}
                            className="w-full rounded-lg object-cover"
                          />
                          <Badge className="absolute top-2 right-2 bg-green-500">最新生成</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => downloadImage(currentResult.resultImage)}
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            下载
                          </Button>
                          <Button variant="outline" onClick={shareResult} className="flex-1">
                            <Share2 className="w-4 h-4 mr-2" />
                            分享
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-96 text-gray-400">
                        <div className="text-center">
                          <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>输入照片和衣服图片开始试穿</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>历史记录</CardTitle>
                <CardDescription>查看你之前的试穿记录</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {history.map((item) => (
                      <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <Image
                            src={item.resultImage || "/placeholder.svg"}
                            alt="历史试穿"
                            width={200}
                            height={300}
                            className="w-full rounded-lg object-cover mb-2"
                          />
                          <p className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => setCurrentResult(item)}>
                              查看
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => downloadImage(item.resultImage)}>
                              下载
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>还没有试穿记录</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
