import Image from "next/image";
import { TryOnResult } from "@/lib/types/tryon";
import { Button } from "@/components/ui/button";

interface TryOnHistoryProps {
  history: TryOnResult[];
  onSelect: (item: TryOnResult) => void;
  onDownload: (url: string) => void;
}

// 试穿历史记录组件
export function TryOnHistory({ history, onSelect, onDownload }: TryOnHistoryProps) {
  if (!history.length) {
    return <div className="text-center py-12 text-gray-400">还没有试穿记录</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {history.map(item => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <Image
            src={item.resultImage}
            alt="历史试穿"
            width={200}
            height={300}
            className="rounded-lg object-cover mb-2"
          />
          <div className="text-xs text-gray-500 mb-2">{new Date(item.timestamp).toLocaleDateString()}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onSelect(item)}>
              查看
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDownload(item.resultImage)}>
              下载
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 