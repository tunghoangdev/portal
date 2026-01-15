import { BaseColumnOptions } from "~/types/data-table-type";

export const columnMonthYears = (col?: any): BaseColumnOptions<any>[] => [
  {
    title: "Tháng",
    key: "created_month",
    align: "center",
    render: (row) => {
      const field = col || "created_date";
      const date = new Date(row[field]);
      return `${(date?.getMonth() + 1).toString().padStart(2, "0")}`;
    },
  },
  {
    title: "Năm",
    key: "created_year",
    type: "currency",
    align: "center",
    render: (row) => {
      const field = col || "created_date";
      const date = new Date(row[field]);
      return date?.getFullYear();
    },
  },
];
