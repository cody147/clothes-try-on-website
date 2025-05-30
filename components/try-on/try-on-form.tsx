import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { uploadFile } from "@/lib/upload-service";

interface TryOnFormProps {
  personImage: string;
  clothingUrl: string;
  personFileName: string;
  clothingFileName: string;
  setPersonFileName: (name: string) => void;
  setClothingFileName: (name: string) => void;
  onChange: (personImage: string, clothingUrl: string) => void;
  isPersonUploading: boolean;
  isClothingUploading: boolean;
  setIsPersonUploading: (v: boolean) => void;
  setIsClothingUploading: (v: boolean) => void;
}

export function TryOnForm({
  personImage,
  clothingUrl,
  personFileName,
  clothingFileName,
  setPersonFileName,
  setClothingFileName,
  onChange,
  isPersonUploading,
  isClothingUploading,
  setIsPersonUploading,
  setIsClothingUploading,
}: TryOnFormProps) {
  const [error, setError] = useState<string | null>(null);
  const personInputRef = useRef<HTMLInputElement>(null);
  const clothingInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(file: File, type: "person" | "clothing") {
    try {
      if (type === "person") setIsPersonUploading(true);
      else setIsClothingUploading(true);
      const url = await uploadFile(file);
      if (type === "person") {
        onChange(url, clothingUrl);
        setPersonFileName(file.name);
      } else {
        onChange(personImage, url);
        setClothingFileName(file.name);
      }
    } catch (e) {
      setError("文件上传失败");
    } finally {
      if (type === "person") setIsPersonUploading(false);
      else setIsClothingUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>人物照片</Label>
        <input
          ref={personInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, "person");
          }}
          disabled={isPersonUploading}
        />
        <button
          type="button"
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 bg-purple-50 text-purple-700 rounded px-4 py-2"
          onClick={() => personInputRef.current?.click()}
          disabled={isPersonUploading}
        >
          选择文件
          {isPersonUploading && (
            <span className="ml-2 align-middle inline-block">
              <svg className="animate-spin h-4 w-4 text-purple-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </span>
          )}
        </button>
        {personFileName && (
          <div className="text-xs text-gray-500 mt-1">已选文件：{personFileName}</div>
        )}
        {personImage && (
          <img
            src={personImage}
            alt="人物照片预览"
            className="mt-2 rounded-lg object-cover w-32 h-44"
          />
        )}
      </div>
      <div>
        <Label>衣服图片</Label>
        <input
          ref={clothingInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, "clothing");
          }}
          disabled={isClothingUploading}
        />
        <button
          type="button"
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 bg-purple-50 text-purple-700 rounded px-4 py-2"
          onClick={() => clothingInputRef.current?.click()}
          disabled={isClothingUploading}
        >
          选择文件
          {isClothingUploading && (
            <span className="ml-2 align-middle inline-block">
              <svg className="animate-spin h-4 w-4 text-purple-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </span>
          )}
        </button>
        {clothingFileName && (
          <div className="text-xs text-gray-500 mt-1">已选文件：{clothingFileName}</div>
        )}
        {clothingUrl && (
          <img
            src={clothingUrl}
            alt="衣服图片预览"
            className="mt-2 rounded-lg object-cover w-32 h-44"
          />
        )}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
} 