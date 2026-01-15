import { BOOLEAN_LABELS } from "./boolean-labels";
/**
 * Chuyển đổi giá trị boolean của một trường thành label và màu tương ứng.
 * * @param fieldName Tên cột (key) cần chuyển đổi (e.g., 'is_active')
 * @param value Giá trị boolean (true/false) từ database
 * @returns Object chứa label và color. Trả về null nếu cột không được định nghĩa.
 */
export function getBooleanLabel(
  fieldName: string,
  value: boolean | number | null
) {
  const map = BOOLEAN_LABELS[fieldName];

  if (!map) {
    // Nếu cột không có trong ánh xạ (ví dụ: cột bool mới)
    return null;
  }

  // Chuyển đổi giá trị về boolean chuẩn (MySQL/Drizzle có thể trả về 0/1)
  const isTrue = value === true || value === 1;

  if (isTrue) {
    return {
      label: map.true,
      //   color: map.colorTrue || "default",
    };
  } else {
    return {
      label: map.false,
      //   color: map.colorFalse || "default",
    };
  }
}
