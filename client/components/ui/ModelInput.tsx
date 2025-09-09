import { Input } from "@/components/ui/input";

interface ModelInputProps {
  model: string;
  setModel: (v: string) => void;
}

export default function ModelInput({ model, setModel }: ModelInputProps) {
  return (
    <Input
      type="text"
      placeholder="Model (e.g. gemini-2.0-flash-exp)"
      value={model}
      onChange={(e) => setModel(e.target.value)}
    />
  );
}
