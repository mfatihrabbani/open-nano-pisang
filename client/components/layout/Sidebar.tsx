import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  mode: "image" | "text";
  setMode: (m: "image" | "text") => void;
}

export default function Sidebar({ mode, setMode }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r bg-sidebar p-6 gap-4">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-md bg-primary/20 grid place-items-center">
          <span className="text-xl">🍌</span>
        </div>
        <div>
          <div className="font-extrabold tracking-tight text-lg">
            Open Nano Pisang
          </div>
          <div className="text-xs text-muted-foreground">
            Open-source image demo
          </div>
        </div>
      </div>
      <Separator />
      <nav className="flex flex-col gap-2">
        <Button
          variant={mode === "image" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setMode("image")}
        >
          Image
        </Button>
        <Button
          variant={mode === "text" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setMode("text")}
        >
          Text-to-Image
        </Button>
      </nav>
      <div className="mt-auto pt-2">
        <a
          href="https://github.com/mfatihrabbani/open-nano-pisang"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-primary hover:underline"
        >
          GitHub ↗
        </a>
      </div>
    </aside>
  );
}
