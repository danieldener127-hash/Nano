export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT = "3:4",
  LANDSCAPE = "4:3",
  WIDESCREEN = "16:9",
  TALL = "9:16"
}

export enum AppMode {
  IMAGE = 'IMAGE',
  BOT = 'BOT'
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio?: string;
}

export interface GenerationError {
  message: string;
  details?: string;
}