import { cn } from "@/lib/utils";
import { FC, ImgHTMLAttributes } from "react";

export type Props = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height" | "loading" | "decoding"
> & {
  src: NonNullable<ImgHTMLAttributes<HTMLImageElement>["src"]>;
  alt: NonNullable<ImgHTMLAttributes<HTMLImageElement>["alt"]>;
  width: NonNullable<ImgHTMLAttributes<HTMLImageElement>["width"]>;
  height: NonNullable<ImgHTMLAttributes<HTMLImageElement>["height"]>;
  fallbackSrc?: string;
  loading?: NonNullable<ImgHTMLAttributes<HTMLImageElement>["loading"]>;
  decoding?: NonNullable<ImgHTMLAttributes<HTMLImageElement>["decoding"]>;
};

const DEFAULT_FALLBACK_SRC = "/cardback.jpg";

export const HextechImage: FC<Props> = ({
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  className,
  loading = "lazy",
  decoding = "async",
  ...imgProps
}) => {
  return (
    <span
      className="block bg-cover bg-no-repeat bg-center rounded-3xl"
      style={{
        backgroundImage: `url(${fallbackSrc})`,
      }}
    >
      <img
        {...imgProps}
        loading={loading}
        decoding={decoding}
        className={cn("w-full h-auto object-cover", className)}
      />
    </span>
  );
};
