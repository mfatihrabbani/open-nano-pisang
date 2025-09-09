import { Button } from "@/components/ui/button";

interface ResultDisplayProps {
  resultUrls: string[] | null;
  isLoading: boolean;
  loadingTime: number;
  onClear: () => void;
}

export default function ResultDisplay({
  resultUrls,
  isLoading,
  loadingTime,
  onClear,
}: ResultDisplayProps) {
  return (
    <div>
      <div className="text-lg font-semibold mb-2">Result</div>
      <div className="text-sm text-muted-foreground mb-3">
        Preview and download
      </div>
      <div>
        {resultUrls && resultUrls.length > 0 ? (
          <div className="space-y-3">
            {resultUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`result-${index}`}
                className="w-full max-h-[480px] object-contain rounded-md border"
              />
            ))}
            <div className="flex gap-2">
              {resultUrls.map((url, index) => (
                <Button asChild key={index}>
                  <a href={url} download={`banana-wrapper-result-${index}.png`}>
                    Download {index + 1}
                  </a>
                </Button>
              ))}
              <Button variant="outline" onClick={onClear}>
                Clear
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-[320px] bg-muted rounded-md flex items-center justify-center">
              <div className="text-sm text-muted-foreground flex flex-col items-center gap-2">
                <div className="loading-spinner h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <div>Generating... {Math.floor(loadingTime)}s</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No result yet</div>
        )}
      </div>
    </div>
  );
}
