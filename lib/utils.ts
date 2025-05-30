import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function saveHistory(history: any[]) {
  localStorage.setItem("tryOnHistory", JSON.stringify(history));
}

export function loadHistory(): any[] {
  const saved = localStorage.getItem("tryOnHistory");
  return saved ? JSON.parse(saved) : [];
}
