import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LocalImage {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

interface ImageUploadProps {
  images: LocalImage[];
  setImages: (images: LocalImage[]) => void;
}

const MAX_FILES = 5;
const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_DIM = 2048; // px

async function fileToImageInfo(file: File): Promise<LocalImage> {
  const url = URL.createObjectURL(file);
  try {
    const dims = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = url;
      },
    );
    return { file, previewUrl: url, width: dims.width, height: dims.height };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

export default function ImageUpload({ images, setImages }: ImageUploadProps) {
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFiles = async (files: File[]) => {
    const imgs: LocalImage[] = [];
    for (const f of files) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > MAX_SIZE) {
        toast.error(`${f.name} exceeds 8MB limit`);
        continue;
      }
      try {
        const info = await fileToImageInfo(f);
        if (Math.max(info.width, info.height) > MAX_DIM * 2) {
          toast.message(
            `${f.name} is very large, will be downscaled on upload`,
          );
        }
        imgs.push(info);
      } catch {
        toast.error(`Failed to read ${f.name}`);
      }
    }
    const merged = [...images, ...imgs].slice(0, MAX_FILES);
    if (merged.length === 0) {
      toast.error("Please add 1–5 image files");
    }
    setImages(merged);
  };

  return (
    <div>
      <div
        ref={dropRef}
        className={cn(
          "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg p-8 text-center",
          "bg-accent/30 hover:bg-accent/50 transition-colors",
        )}
      >
        <div className="text-sm text-muted-foreground">
          Drag & drop images here or
        </div>
        <label className="inline-flex items-center gap-2">
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const f = e.target.files ? Array.from(e.target.files) : [];
              handleFiles(f);
              e.currentTarget.value = "";
            }}
          />
          <Button asChild>
            <label htmlFor="file-upload">Browse</label>
          </Button>
        </label>
        <div className="text-xs text-muted-foreground">
          {images.length}/{MAX_FILES} selected
        </div>
      </div>
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.previewUrl}
                alt={`upload-${i}`}
                className="w-full h-28 object-cover rounded-md border"
              />
              <button
                className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-background/80 border shadow opacity-0 group-hover:opacity-100 transition"
                onClick={() => {
                  const newImages = [...images];
                  newImages.splice(i, 1);
                  setImages(newImages);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
