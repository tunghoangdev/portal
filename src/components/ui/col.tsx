import { cn } from "@heroui/react"; // Giả sử cn là một utility giúp hợp nhất các class names
import type { ReactNode } from "react";

interface ColProps {
  children: ReactNode;
  className?: string; // Các class tùy chỉnh khác
  // Các prop để kiểm soát số cột trên từng breakpoint
  xs?: number; // Mặc định cho màn hình extra small (không tiền tố)
  sm?: number; // Màn hình nhỏ (sm:)
  md?: number; // Màn hình trung bình (md:)
  lg?: number; // Màn hình lớn (lg:)
  xl?: number; // Màn hình extra large (xl:)
}

// Hàm trợ giúp để tạo ra lớp col-span-*
const getColSpanClass = (span?: number, prefix?: string): string => {
  if (span === undefined || span < 1 || span > 12) {
    return ""; // Không áp dụng lớp nếu không hợp lệ
  }
  const baseClass = `col-span-${span}`;
  return prefix ? `${prefix}:${baseClass}` : baseClass;
};

export function Col({ children, className, xs, sm, md, lg, xl }: ColProps) {
  // Tạo mảng các lớp Tailwind CSS
  const colClasses: string[] = [];
  if (xs !== undefined) {
    colClasses.push(getColSpanClass(xs));
  } else {
    colClasses.push(getColSpanClass(12));
  }

  // Áp dụng các lớp cho các breakpoint khác
  if (sm !== undefined) {
    colClasses.push(getColSpanClass(sm, "sm"));
  }
  if (md !== undefined) {
    colClasses.push(getColSpanClass(md, "md"));
  }
  if (lg !== undefined) {
    colClasses.push(getColSpanClass(lg, "lg"));
  }
  if (xl !== undefined) {
    colClasses.push(getColSpanClass(xl, "xl"));
  }

  return <div className={cn(...colClasses, className)}>{children}</div>;
}
