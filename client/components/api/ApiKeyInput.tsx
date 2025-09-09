import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModelInput from "@/components/ui/ModelInput";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (model: string) => void;
}

export default function ApiKeyInput({
  apiKey,
  setApiKey,
  model,
  setModel,
}: ApiKeyInputProps) {
  return (
    <div>
      <div className="text-lg font-semibold mb-2">API key</div>
      <div className="text-sm text-muted-foreground mb-3">
        Stored locally in your browser
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          type="password"
          placeholder="Enter your Gemini API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <ModelInput model={model} setModel={setModel} />
        <Button variant="outline" onClick={() => setApiKey("")}>
          Clear
        </Button>
      </div>
    </div>
  );
}
