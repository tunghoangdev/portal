// components/Grid.tsx
import type React from "react";
import { cn } from "@heroui/react"; // Giả sử cn là một utility giúp hợp nhất các class names

// Định nghĩa các kiểu prop cho căn chỉnh nội dung
// Với CSS Grid, justify/align có thể khác một chút so với Flexbox
// Tuy nhiên, Tailwind vẫn cung cấp các utilities tương tự
type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly"; // Dùng các giá trị của Tailwind
type AlignItems = "start" | "center" | "end" | "stretch" | "baseline"; // Dùng các giá trị của Tailwind
type Direction = "row" | "col"; // Tailwind flex-row/flex-col
type RowSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; // Thêm prop cho row span

interface GridProps {
  children: React.ReactNode;
  className?: string; // Các class tùy chỉnh khác

  // === MUI Grid specific props ===
  container?: boolean; // Nếu là container, sẽ là grid layout
  item?: boolean; // Nếu là item, sẽ chiếm cột/hàng trong grid container
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; // Khoảng cách giữa các item (gap)

  // Các props cho container (khi container=true)
  // Với CSS Grid, direction thường được điều khiển bởi grid-flow-row/col
  // Hoặc bạn có thể dùng flexbox bên trong container nếu bạn vẫn muốn flex direction
  // Mình sẽ bỏ direction ở đây để tập trung vào CSS Grid.
  // Nếu muốn flex direction, bạn có thể tự thêm lại flexbox classes.

  justifyContent?: JustifyContent; // Căn chỉnh các items trong container theo trục ngang
  alignItems?: AlignItems; // Căn chỉnh các items trong container theo trục dọc

  // Các breakpoint props (chỉ có tác dụng khi `item` là true)
  xs?: number; // col-span
  sm?: number; // sm:col-span
  md?: number; // md:col-span
  lg?: number; // lg:col-span
  xl?: number; // xl:col-span

  // Thêm prop cho việc chiếm hàng (MUI Grid V2)
  xsRow?: RowSpan; // row-span
  smRow?: RowSpan; // sm:row-span
  mdRow?: RowSpan; // md:row-span
  lgRow?: RowSpan; // lg:row-span
  xlRow?: RowSpan; // xl:row-span
}

// Hàm trợ giúp để tạo ra lớp col-span-* hoặc row-span-*
const getSpanClass = (
  span?: number | RowSpan,
  prefix?: string,
  type: "col" | "row" = "col"
): string => {
  if (span === undefined || span < 1 || span > 12) {
    return ""; // Không áp dụng lớp nếu không hợp lệ
  }
  const baseClass = `${type}-span-${span}`;
  return prefix ? `${prefix}:${baseClass}` : baseClass;
};

// Mapping cho justifyContent (dành cho container)
const justifyContentMap: Record<JustifyContent, string> = {
  start: "justify-items-start", // hoặc justify-start nếu là flex
  center: "justify-items-center",
  end: "justify-items-end",
  between: "justify-between", // Thường là flexbox, không trực tiếp cho grid items
  around: "justify-around", // Thường là flexbox
  evenly: "justify-evenly", // Thường là flexbox
};

// Mapping cho alignItems (dành cho container)
const alignItemsMap: Record<AlignItems, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

export function Grid({
  children,
  className,
  container,
  item,
  spacing,
  justifyContent,
  alignItems,
  xs,
  sm,
  md,
  lg,
  xl,
  xsRow,
  smRow,
  mdRow,
  lgRow,
  xlRow,
}: GridProps) {
  const classes: string[] = [];

  if (container) {
    classes.push("grid", "grid-cols-12"); // Luôn là grid container với 12 cột

    // Áp dụng gap nếu có spacing
    if (spacing !== undefined) {
      classes.push(`gap-${spacing}`);
    }

    // Căn chỉnh các item trong grid container
    if (justifyContent) {
      // Đối với grid, justify-items/align-items là phổ biến hơn
      // Nếu bạn muốn căn chỉnh các tracks (cột), sẽ cần justify-content
      // Giữ lại các classes này để mô phỏng MUI
      classes.push(justifyContentMap[justifyContent]);
    }
    if (alignItems) {
      classes.push(alignItemsMap[alignItems]);
    }
  }

  if (item) {
    // Áp dụng các lớp col-span
    if (xs !== undefined) {
      classes.push(getSpanClass(xs, undefined, "col"));
    } else {
      // Mặc định item chiếm 12 cột trên di động nếu không có xs
      classes.push(getSpanClass(12, undefined, "col"));
    }

    if (sm !== undefined) {
      classes.push(getSpanClass(sm, "sm", "col"));
    }
    if (md !== undefined) {
      classes.push(getSpanClass(md, "md", "col"));
    }
    if (lg !== undefined) {
      classes.push(getSpanClass(lg, "lg", "col"));
    }
    if (xl !== undefined) {
      classes.push(getSpanClass(xl, "xl", "col"));
    }

    // Áp dụng các lớp row-span
    if (xsRow !== undefined) {
      classes.push(getSpanClass(xsRow, undefined, "row"));
    }
    if (smRow !== undefined) {
      classes.push(getSpanClass(smRow, "sm", "row"));
    }
    if (mdRow !== undefined) {
      classes.push(getSpanClass(mdRow, "md", "row"));
    }
    if (lgRow !== undefined) {
      classes.push(getSpanClass(lgRow, "lg", "row"));
    }
    if (xlRow !== undefined) {
      classes.push(getSpanClass(xlRow, "xl", "row"));
    }
  }
  return <div className={cn(...classes, className)}>{children}</div>;
}
