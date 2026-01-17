import { MENU_SETTINGS } from "~/constant/site-menu";
import { NORMALIZE_URLS } from "~/constant/api-endpoints";

/**
 * Hàm lấy idForm từ pathname
 * @param pathname - Đường dẫn hiện tại
 * @returns ID của form tương ứng với pathname
 */
export const getIdFormFromPathname = (pathname: string): number => {
  const normalizedPath = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  if (NORMALIZE_URLS.includes(normalizedPath)) {
    return 0;
  }

  // Xử lý cho menu staff
  if (normalizedPath.startsWith("/staff")) {
    // Kiểm tra trong menu cấp 1
    for (const section of MENU_SETTINGS.staff) {
      if (typeof section === "object") {
        // Kiểm tra nếu section có url trùng với normalizedPath
        if ("url" in section && section.url === normalizedPath) {
          return section.id_form || 0;
        }

        // Kiểm tra trong children của section (menu cấp 2)
        if (section.children && Array.isArray(section.children)) {
          for (const subSection of section.children) {
            if (typeof subSection === "object" && "url" in subSection) {
              if (subSection.url === normalizedPath) {
                return subSection.id_form || 0;
              }

              // Kiểm tra trong children của subSection (menu cấp 3 nếu có)
              if (subSection.children && Array.isArray(subSection.children)) {
                for (const subSubSection of subSection.children) {
                  if (
                    typeof subSubSection === "object" &&
                    "url" in subSubSection
                  ) {
                    if (subSubSection.url === normalizedPath) {
                      return subSubSection.id_form || 0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return 0;
};
