import React, { ReactNode } from "react";
import { cn } from "~/lib/utils"; // Giả sử bạn có utility function này để combine classNames

// Định nghĩa các kiểu prop cho Divider
interface DividerProps {
  /**
   * Hướng của divider. Mặc định là 'horizontal'.
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Biến thể của divider.
   * - 'fullWidth': Kéo dài toàn bộ chiều rộng/chiều cao.
   * - 'inset': Có margin ở hai bên.
   * - 'middle': Giống 'inset' nhưng với margin lớn hơn (thường là cho list items).
   */
  variant?: "fullWidth" | "inset" | "middle";
  /**
   * Nếu true, làm cho divider phù hợp hơn với nền sáng/tối.
   */
  light?: boolean;
  /**
   * Nếu true, divider sẽ tự động chiếm hết chiều cao còn lại
   * khi được sử dụng trong container flex với orientation="vertical".
   */
  flexItem?: boolean;
  /**
   * Nội dung tùy chỉnh hiển thị ở giữa divider.
   * Khi có children, divider sẽ đóng vai trò như một đường kẻ với text ở giữa.
   */
  children?: ReactNode;
  /**
   * Các class CSS tùy chỉnh cho phần tử gốc của divider.
   */
  className?: string; // Class cho wrapper chính của component
  /**
   * Các class CSS tùy chỉnh cho các phần tử con của divider.
   */
  classNames?: {
    // ✨ MỚI: Prop classNames là một đối tượng ✨
    base?: string; // Class cho phần tử gốc (thay cho className trực tiếp nếu muốn)
    line?: string; // Class cho đường kẻ chính (khi không có children) hoặc đường kẻ trước (khi có children)
    textWrapper?: string; // Class cho phần tử chứa children
    lineAfter?: string; // Class cho đường kẻ sau (khi có children)
  };
  /**
   * Các props HTML div chuẩn khác.
   */
  [key: string]: any; // Để chấp nhận các prop HTML div khác
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  variant = "fullWidth",
  light = false,
  flexItem = false,
  children,
  className, // Class cho wrapper chính vẫn giữ lại nếu muốn cung cấp 2 cách
  classNames, // Destructure prop mới
  ...rest
}) => {
  const isHorizontal = orientation === "horizontal";

  // Base line styles
  const baseLineClasses = cn(
    "border-b", // Border mặc định
    {
      "border-gray-300 dark:border-gray-700": !light, // Màu border mặc định
      "border-gray-200 dark:border-gray-800": light, // Màu border cho light variant
    }
  );

  return (
    <div
      role="separator" // Thêm role='separator' cho ngữ nghĩa ngữ cảnh (accessibility)
      className={cn(
        "shrink-0", // Ngăn không cho flex item bị co lại
        {
          // Orientation styles
          "h-px w-full my-4": isHorizontal && !children, // Chiều cao nhỏ, chiều rộng đầy đủ, margin dọc khi KHÔNG có children
          "w-px h-full mx-4": !isHorizontal, // Chiều rộng nhỏ, chiều cao đầy đủ, margin ngang

          // Variant styles (chỉ áp dụng cho horizontal theo MUI)
          "mx-4": isHorizontal && variant === "inset", // Margin ngang cho inset
          "mx-8": isHorizontal && variant === "middle", // Margin lớn hơn cho middle

          // Flex item (chủ yếu cho vertical divider trong flex container)
          "self-stretch": flexItem && !isHorizontal, // Chiếm hết chiều cao

          // Styles khi có children (divider với text ở giữa)
          "flex items-center text-gray-500 relative my-4":
            children && isHorizontal, // Khi có text, cần flex và relative, margin dọc
        },
        className, // Class từ prop className trực tiếp
        classNames?.base // Class từ prop classNames.base
      )}
      {...rest}
    >
      {/* Logic để render đường kẻ và children */}
      {children ? (
        // Khi có children, tạo 2 đường kẻ và 1 wrapper cho text
        <>
          <span
            className={cn(
              "flex-grow", // Đường kẻ đầu tiên chiếm phần còn lại
              baseLineClasses, // Base styles cho line
              classNames?.line // Class tùy chỉnh cho line trước từ prop classNames
            )}
          />
          <span
            className={cn(
              "px-2 text-sm", // Padding và font size cho text
              { "text-gray-600 dark:text-gray-400": !light }, // Màu text mặc định
              { "text-gray-500 dark:text-gray-500": light }, // Màu text cho light variant
              classNames?.textWrapper // Class tùy chỉnh cho text wrapper từ prop classNames
            )}
          >
            {children}
          </span>
          <span
            className={cn(
              "flex-grow", // Đường kẻ thứ hai chiếm phần còn lại
              baseLineClasses, // Base styles cho line
              classNames?.lineAfter // Class tùy chỉnh cho line sau từ prop classNames
            )}
          />
        </>
      ) : (
        // Khi KHÔNG có children, chỉ render một đường kẻ duy nhất
        <span
          className={cn(
            "block", // Hiển thị dưới dạng block
            isHorizontal ? "w-full h-px" : "h-full w-px", // Kích thước dựa trên orientation
            baseLineClasses, // Base styles cho line
            classNames?.line // Class tùy chỉnh cho line từ prop classNames
          )}
        />
      )}
    </div>
  );
};
