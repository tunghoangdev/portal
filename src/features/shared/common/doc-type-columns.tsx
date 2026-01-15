import type { BaseColumnOptions } from "~/types/data-table-type";

export const docTypeColumns: BaseColumnOptions<any>[] = [
  {
    title: "Loại tài liệu",
    key: "document_type_name",
  },
];

export const docTypeInternalColumns: BaseColumnOptions<any>[] = [
  {
    title: "Loại tài liệu",
    key: "document_internal_type_name",
  },
];
