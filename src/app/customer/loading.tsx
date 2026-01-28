import { Loader2 } from "lucide-react";

export default function CustomerLoading() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
