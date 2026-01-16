import { useRef } from "react";
const DEFAULT_SRC =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
interface MyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  unoptimized?: boolean;
}

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);
const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
export const cloudinaryUrl = (
  src: string,
  options?: { w?: number; q?: number }
) => {
  if (!src) return "";
  if (
    src.startsWith("/") ||
    src.startsWith("blob:") ||
    src.startsWith("data:")
  ) {
    return src;
  }
  const width = options?.w || 800;
  const quality = options?.q || 70;
  const base = "https://res.cloudinary.com/dnckohpw2/image/fetch";
  return `${base}/w_${width},q_${quality},f_auto/${encodeURIComponent(src)}`;
  // const encodedSrc = encodeURIComponent(src);
  // return `https://res.cloudinary.com/demo/image/fetch/w_${width},q_${quality}/${encodedSrc}`;
};
export const MyImage = ({
  fallbackSrc,
  className = "",
  ...props
}: MyImageProps) => {
  const { src, width, height, alt } = props || {};
  const imgRef = useRef<HTMLImageElement>(null);

  if (!src) return null;
  return (
    <img
      key={src as string}
      ref={imgRef}
      src={cloudinaryUrl(src as string, { w: width as number, q: 90 })}
      alt={alt || ""}
      width={width}
      height={height}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (fallbackSrc && target.src !== fallbackSrc) {
          target.src = fallbackSrc;
        }
      }}
      className={`transition-opacity duration-500 opacity-0 select-none ${className}`}
      onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
    />
  );
};
