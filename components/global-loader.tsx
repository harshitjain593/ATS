import { Loader2, Sparkles } from "lucide-react";

export default function GlobalLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background animate-fade-in">
      <div className="relative flex items-center justify-center mb-4">
        <Loader2 className="h-16 w-16 text-primary animate-spin-slow opacity-80" />
        <Sparkles className="absolute h-10 w-10 text-blue-400 animate-pulse opacity-60" style={{ top: 0, right: -10 }} />
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2 animate-text-glow">AI is thinking...</h2>
      <p className="text-muted-foreground text-lg">Please wait while we load your experience</p>
    </div>
  );
} 