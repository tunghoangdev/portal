import React, { forwardRef, HTMLAttributes } from "react";

// Định nghĩa các loại props cho Stack component
interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Nội dung bên trong Stack.
   */
  children?: React.ReactNode;
  /**
   * Hướng của Stack.
   * 'flex-col' cho cột, 'flex-row' cho hàng.
   * @default 'flex-col'
   */
  direction?: "flex-col" | "flex-row";
  /**
   * Khoảng cách giữa các phần tử con.
   * Sử dụng giá trị số tương ứng với các spacing utility của Tailwind (ví dụ: 1 = 0.25rem, 2 = 0.5rem, v.v.).
   * Nếu spacing là 0, sẽ không có khoảng cách.
   * @default 0
   */
  spacing?: number;
  /**
   * Căn chỉnh các phần tử theo trục vuông góc với trục chính.
   * @default 'items-start'
   */
  alignItems?:
    | "items-start"
    | "items-center"
    | "items-end"
    | "items-stretch"
    | "items-baseline";
  /**
   * Căn chỉnh các phần tử theo trục chính.
   * @default 'justify-start'
   */
  justifyContent?:
    | "justify-start"
    | "justify-center"
    | "justify-end"
    | "justify-between"
    | "justify-around"
    | "justify-evenly";
  /**
   * Cho phép các phần tử xuống dòng khi không đủ chỗ.
   * @default 'flex-no-wrap'
   */
  wrap?: "flex-wrap" | "flex-no-wrap";
  /**
   * Thêm các class CSS tùy chỉnh.
   */
  className?: string;
}

// Bọc component Stack bằng forwardRef và định nghĩa kiểu props
const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      direction = "flex-col",
      spacing = 0,
      alignItems = "items-start",
      justifyContent = "justify-start",
      wrap = "flex-no-wrap",
      className = "",
      ...rest // Các props HTML khác được truyền vào div gốc
    },
    ref
  ) => {
    const spacingClass =
      typeof spacing === "number" && spacing > 0
        ? direction === "flex-col"
          ? `space-y-${spacing}`
          : `space-x-${spacing}`
        : "";

    const classes = [
      "flex",
      direction,
      spacingClass,
      alignItems,
      justifyContent,
      wrap,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      // Gắn ref vào phần tử DOM gốc (div)
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  }
);

// Đặt displayName để dễ debug hơn trong React DevTools
Stack.displayName = "Stack";

export default Stack;
