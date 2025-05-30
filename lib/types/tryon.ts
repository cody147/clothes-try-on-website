export interface TryOnResult {
  id: string;
  personImage: string;
  clothingUrl: string;
  resultImage: string;
  timestamp: number;
}

export interface TryOnInput {
  personImageUrl: string;
  clothingImageUrl: string;
  clothType?: "upper" | "lower" | "overall" | "inner" | "outer";
  imageSize?: string;
  numInferenceSteps?: number;
  guidanceScale?: number;
} 