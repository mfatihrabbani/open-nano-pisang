import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  mode: "image" | "text";
  onGenerate: () => void;
  onReset: () => void;
  canGenerate: boolean;
  isLoading: boolean;
}

export default function PromptInput({
  prompt,
  setPrompt,
  mode,
  onGenerate,
  onReset,
  canGenerate,
  isLoading,
}: PromptInputProps) {
  function applyPreset(type: "removebg" | "cyberpunk" | "portrait") {
    const map = {
      removebg:
        "Remove background, clean subject cutout, smooth edges, high-quality alpha",
      cyberpunk:
        "Cyberpunk neon lights, rainy city reflections, dramatic rim light, high contrast",
      portrait:
        "Studio portrait, soft key light, 85mm lens look, shallow depth of field",
    } as const;
    const extra = map[type];
    setPrompt(prompt ? `${prompt}\n\n${extra}` : extra);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-semibold mb-2">Prompt</div>
        <div className="text-sm text-muted-foreground mb-3">
          Describe your edit intent or style
        </div>
        <Textarea
          placeholder="e.g. Clean product cutout with slight drop shadow"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {mode === "image" && (
            <Button variant="outline" onClick={() => applyPreset("removebg")}>
              Remove BG
            </Button>
          )}
          <Button variant="outline" onClick={() => applyPreset("cyberpunk")}>
            Cyberpunk
          </Button>
          <Button variant="outline" onClick={() => applyPreset("portrait")}>
            Studio Portrait
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button disabled={!canGenerate} onClick={onGenerate}>
          {isLoading ? "Generating..." : "Generate"}
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
