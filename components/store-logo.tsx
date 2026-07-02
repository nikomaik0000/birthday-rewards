import Image from "next/image";
import { storeInitial, cn } from "@/lib/utils";

export function StoreLogo({
  name,
  logoUrl,
  size = 32,
  className,
}: {
  name: string;
  logoUrl: string | null;
  size?: number;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <div
        className={cn("relative shrink-0 overflow-hidden rounded-full bg-bg dark:bg-bg-dark", className)}
        style={{ width: size, height: size }}
      >
        <Image src={logoUrl} alt={`${name} logo`} fill sizes={`${size}px`} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-accent-coffee/20 font-medium text-accent-coffee",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      {storeInitial(name)}
    </div>
  );
}
