import { Buffer } from "buffer";
import { useEffect, useMemo, useRef, useState } from "react";
import showcaseData from "@/data/showcase.json";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import Sidebar from "@/components/layout/Sidebar";
import ApiKeyInput from "@/components/api/ApiKeyInput";
import ImageUpload from "@/components/image/ImageUpload";
import PromptInput from "@/components/prompt/PromptInput";
import ResultDisplay from "@/components/result/ResultDisplay";
import Showcase from "@/components/showcase/Showcase";
import apiService from "@/services/api";

interface LocalImage {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

const MAX_FILES = 5;
const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_DIM = 2048; // px

function useLocalStorage(key: string, initial: string = "") {
  const [value, setValue] = useState<string>(() => {
    try {
      const v = localStorage.getItem(key);
      return v ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

async function resizeToMax(
  file: File,
): Promise<{ mimeType: string; data: string }> {
  const imageBitmap = await createImageBitmap(file);
  let { width, height } = imageBitmap;
  const scale = Math.min(1, MAX_DIM / Math.max(width, height));
  if (scale < 1) {
    width = Math.floor(width * scale);
    height = Math.floor(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(imageBitmap, 0, 0, width, height);
  const mimeType =
    file.type === "image/png" || file.type === "image/webp"
      ? file.type
      : "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, 0.92);
  const base64 = dataUrl.split(",")[1] ?? "";
  return { mimeType, data: base64 };
}

export default function Index() {
  const [apiKey, setApiKey] = useLocalStorage("bw_api_key", "");
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<LocalImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrls, setResultUrls] = useState<string[] | null>(null);
  const [model, setModel] = useState<string>("gemini-2.5-flash-image-preview");
  const [mode, setMode] = useState<"image" | "text">("image");
  const mainRef = useRef<HTMLDivElement>(null);
  const [allowShowcaseScroll, setAllowShowcaseScroll] = useState(false);
  // Ganti state loadingProgress dengan loadingTime
  const [loadingTime, setLoadingTime] = useState(0);

  // Update useEffect untuk menghitung waktu
  useEffect(() => {
    if (isLoading) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setLoadingTime(elapsedSeconds);
      }, 1000);
      return () => {
        clearInterval(interval);
        setLoadingTime(0);
      };
    }
  }, [isLoading]);

  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      setAllowShowcaseScroll(atBottom);
    };
    onScroll();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const canGenerate = useMemo(
    () =>
      Boolean(
        apiKey &&
          prompt &&
          !isLoading &&
          (mode === "text" || images.length > 0),
      ),
    [apiKey, prompt, images, isLoading, mode],
  );

  async function onGenerate() {
    try {
      setIsLoading(true);
      setResultUrls(null);

      const imageParts = await Promise.all(
        images.map(async (i) => {
          const resized = await resizeToMax(i.file);
          return {
            mimeType: resized.mimeType,
            data: resized.data,
          };
        }),
      );

      const response = await apiService.editImages(
        apiKey,
        prompt,
        imageParts,
        model,
      );

      const newResultUrls: string[] = [];
      for (const image of response.images) {
        const blob = new Blob([Buffer.from(image.data, "base64")], {
          type: image.mimeType,
        });
        const url = URL.createObjectURL(blob);
        newResultUrls.push(url);
      }
      setResultUrls(newResultUrls);
      toast.success("Generated image ready");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate");
    } finally {
      setIsLoading(false);
    }
  }

  function onReset() {
    setPrompt("");
    setImages([]);
    setResultUrls(null);
  }

  return (
    <div className="h-screen bg-gradient-to-br from-muted to-background text-foreground">
      <div className="mx-auto max-w-7xl flex h-full">
        <Sidebar mode={mode} setMode={setMode} />
        <main
          ref={mainRef}
          className="flex-1 min-h-0 p-6 md:p-10 overflow-y-auto"
        >
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Open Nano Pisang
              </h1>
              <p className="text-sm text-muted-foreground">
                Image editing demo with Gemini proxy
              </p>
            </div>
            <Button
              asChild
              variant="secondary"
              className="hidden md:inline-flex"
            >
              <a
                href="https://github.com/mfatihrabbani/open-nano-pisang"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </Button>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-0 overflow-y-auto">
            <div className="xl:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <ApiKeyInput
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                    model={model}
                    setModel={setModel}
                  />
                </CardContent>
              </Card>

              {mode === "image" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upload images</CardTitle>
                    <CardDescription>
                      1–5 files, up to 8MB each, max 2048px
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload images={images} setImages={setImages} />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="pt-6">
                  <PromptInput
                    prompt={prompt}
                    setPrompt={setPrompt}
                    mode={mode}
                    onGenerate={onGenerate}
                    onReset={onReset}
                    canGenerate={canGenerate}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <ResultDisplay
                    resultUrls={resultUrls}
                    isLoading={isLoading}
                    loadingTime={loadingTime}
                    onClear={() => setResultUrls(null)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-1 flex flex-col min-h-0">
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex-1">
                  <Showcase
                    mode={mode}
                    showcaseData={showcaseData as any}
                    setImages={setImages}
                    setPrompt={setPrompt}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
