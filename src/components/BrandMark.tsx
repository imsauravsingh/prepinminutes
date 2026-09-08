import Image from "next/image";

export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <Image
      src="/images/icons/icon.png"
      alt=""
      width={36}
      height={36}
      unoptimized
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
