import { PawIcon } from "@/components/svg";
import { cn } from "@/lib";

interface PawSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function PawSpinner({ size = "md", fullScreen = false }: PawSpinnerProps) {
  const sizes = { sm: 32, md: 48, lg: 64 };
  const px = sizes[size];

  const spinner = (
    <div className="relative flex items-center justify-center">
      <div
        className={cn(
          "absolute animate-spin rounded-full border-4 border-teal-100 border-t-teal-600"
        )}
        style={{
          width: px + 20,
          height: px + 20,
          animationDuration: "1s",
        }}
      />
      <PawIcon width={px} height={px} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F8FAFC]">
        {spinner}
      </div>
    );
  }

  return spinner;
}
