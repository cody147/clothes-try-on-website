import Image from "next/image";

interface TryOnResultProps {
  resultImage: string;
  isLoading: boolean;
}

// 试穿结果展示组件
export function TryOnResult({ resultImage, isLoading }: TryOnResultProps) {
  if (isLoading) {
    return <div className="text-center py-12 text-lg text-gray-500">AI 正在生成中...</div>;
  }
  if (!resultImage) {
    return <div className="text-center py-12 text-gray-400">请上传图片并点击生成</div>;
  }
  return (
    <div className="flex flex-col items-center">
      <Image
        src={resultImage}
        alt="试穿效果"
        width={400}
        height={600}
        className="rounded-lg object-cover"
      />
      <div className="mt-2 text-green-600 text-sm">最新生成</div>
    </div>
  );
} 