import fallback from "@/assets/cardback.jpg";
import { cn } from "@/lib/utils";
import { FC, HTMLAttributes, ImgHTMLAttributes } from "react";

export type Props = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height" | "loading" | "decoding"
> & {
  src: NonNullable<ImgHTMLAttributes<HTMLImageElement>["src"]>;
  alt: NonNullable<ImgHTMLAttributes<HTMLImageElement>["alt"]>;
  width: number;
  height: number;
  fallbackSrc?: string;
  loading?: NonNullable<ImgHTMLAttributes<HTMLImageElement>["loading"]>;
  decoding?: NonNullable<ImgHTMLAttributes<HTMLImageElement>["decoding"]>;
  options?: {
    wrapperClass?: HTMLAttributes<HTMLSpanElement>;
  };
};

export const HextechImage: FC<Props> = ({
  fallbackSrc = fallback.src,
  className,
  loading = "lazy",
  decoding = "async",
  width,
  height,
  options,
  ...imgProps
}) => {
  const {
    className: wrapperClassName,
    style,
    ...wrapperProps
  } = options?.wrapperClass ?? {};

  return (
    <span
      className={cn("block bg-cover bg-no-repeat bg-center", wrapperClassName)}
      style={{
        ...style,
        backgroundColor: "#033651",
        backgroundImage: `url(${fallbackSrc})`,
        width: width,
        height: height,
        borderRadius: Math.max(...[2, 0.047 * width]),
      }}
      {...wrapperProps}
    >
      <img
        {...imgProps}
        className={cn("w-full h-auto object-cover", className)}
        style={{
          width: width,
          height: height,
        }}
        loading={loading}
        decoding={decoding}
      />
    </span>
  );
};
