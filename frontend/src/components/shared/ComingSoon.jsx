import { Sparkles } from "lucide-react";
import CardSurface from "./CardSurface";

export default function ComingSoon({ title, description }) {
  return (
    <CardSurface className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Sparkles className="h-5 w-5" />
      </div>
      <h1 className="text-page-title font-display mt-4">{title}</h1>
      <p className="text-body mt-2 max-w-md text-muted-foreground">{description}</p>
    </CardSurface>
  );
}
