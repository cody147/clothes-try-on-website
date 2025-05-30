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
import { uploadFile } from "@/lib/upload-service"
import { TryOnForm } from "@/components/try-on/try-on-form"
import { TryOnResult } from "@/components/try-on/try-on-result"
import { TryOnHistory } from "@/components/try-on/try-on-history"
import { loadHistory, saveHistory } from "@/lib/utils"
import { TryOnResult as TryOnResultType } from "@/lib/types/tryon"

export default function ClothesTryOnApp() {
  const [personImage, setPersonImage] = useState<string>("")
  const [clothingUrl, setClothingUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentResult, setCurrentResult] = useState<TryOnResultType | null>(null)
  const [history, setHistory] = useState<TryOnResultType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [personFileName, setPersonFileName] = useState<string>("")
  const [clothingFileName, setClothingFileName] = useState<string>("")
  const [isPersonUploading, setIsPersonUploading] = useState(false)
  const [isClothingUploading, setIsClothingUploading] = useState(false)

  // 初始化历史记录
  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  // 保存历史记录
  function saveToHistory(result: TryOnResultType) {
    const newHistory = [result, ...history].slice(0, 10)
    setHistory(newHistory)
    saveHistory(newHistory)
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

  // 处理生成
  async function handleGenerate() {
    if (!personImage || !clothingUrl) {
      setError("请上传人物照片和衣服图片")
      return
    }
    setIsGenerating(true)
    setError(null)
    try {
      const resultImageUrl = await generateTryOnPhoto(personImage, clothingUrl)
      const result: TryOnResultType = {
        id: Date.now().toString(),
        personImage,
        clothingUrl,
        resultImage: resultImageUrl,
        timestamp: Date.now(),
      }
      setCurrentResult(result)
      saveToHistory(result)
    } catch (e: any) {
      setError(e.message || "生成失败")
    } finally {
      setIsGenerating(false)
    }
  }

  // 下载图片
  function downloadImage(url: string) {
    const link = document.createElement("a")
    link.href = url
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

  // 处理文件上传
  const handleFileUpload = async (file: File, type: "person" | "clothing") => {
    try {
      setIsUploading(true)
      const fileUrl = await uploadFile(file)
      if (type === "person") {
        setPersonImage(fileUrl)
      } else {
        setClothingUrl(fileUrl)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "文件上传失败")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI 衣服试穿
          </h1>
          <p className="text-gray-600 text-lg">上传照片，选择衣服，AI 帮你试穿</p>
        </div>
        <Tabs defaultValue="tryon" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="tryon" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />虚拟试穿
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />历史记录
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tryon">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 左侧：上传与生成 */}
              <div className="space-y-6">
                <TryOnForm
                  personImage={personImage}
                  clothingUrl={clothingUrl}
                  personFileName={personFileName}
                  clothingFileName={clothingFileName}
                  setPersonFileName={setPersonFileName}
                  setClothingFileName={setClothingFileName}
                  onChange={(p, c) => {
                    setPersonImage(p)
                    setClothingUrl(c)
                  }}
                  isPersonUploading={isPersonUploading}
                  isClothingUploading={isClothingUploading}
                  setIsPersonUploading={setIsPersonUploading}
                  setIsClothingUploading={setIsClothingUploading}
                />
                <button
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded text-white"
                  onClick={handleGenerate}
                  disabled={!personImage || !clothingUrl || isGenerating || isUploading}
                >
                  {isGenerating ? "AI 正在生成中..." : "开始试穿"}
                </button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
              {/* 右侧：结果展示 */}
              <div>
                <TryOnResult resultImage={currentResult?.resultImage || ""} isLoading={isGenerating} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history">
            <TryOnHistory
              history={history}
              onSelect={setCurrentResult}
              onDownload={downloadImage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
