import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface LocalImage {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

interface ShowcaseItem {
  title: string;
  description: string;
  tags: string[];
  prompt: string;
  image: string;
  image_ingredients?: string[];
}

interface ShowcaseProps {
  mode: "image" | "text";
  showcaseData: { image: ShowcaseItem[]; text: ShowcaseItem[] };
  setImages: (images: LocalImage[]) => void;
  setPrompt: (prompt: string) => void;
}

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

export default function Showcase({
  mode,
  showcaseData,
  setImages,
  setPrompt,
}: ShowcaseProps) {
  async function useExampleItem(item: ShowcaseItem) {
    try {
      const imagesToLoad = item.image_ingredients || [item.image];
      const loadedImages: LocalImage[] = [];

      for (const imgUrl of imagesToLoad) {
        const r = await fetch(imgUrl);
        const b = await r.blob();
        const file = new File([b], imgUrl.split("/").pop() || "example.png", {
          type: b.type || "image/png",
        });
        const info = await fileToImageInfo(file);
        loadedImages.push(info);
      }

      if (mode === "image") {
        setImages(loadedImages);
      } else {
        setImages([]);
      }
      setPrompt(item.prompt);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to load example");
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Prompt copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="text-lg font-semibold">Showcase</div>
        <div className="text-sm text-muted-foreground">
          Use an example or copy its prompt
        </div>
      </div>
      <div className="grid gap-4 flex-1 pr-2 overflow-y-auto">
        {(mode === "image" ? showcaseData.image : showcaseData.text).map(
          (item, idx) => (
            <div key={idx} className="rounded-lg border overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((t, i) => (
                    <Badge key={i} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => useExampleItem(item)}>
                    Use this template
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copy(item.prompt)}
                  >
                    Copy prompt
                  </Button>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
