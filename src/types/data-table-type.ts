import type { TExportFormFields, TItemFormFields } from "~/types/form-field";
import type { ColumnDef, ColumnPinningState } from "@tanstack/react-table";
import type { Control, FormState } from "react-hook-form";
import type { ReactNode } from "react";
import type z from "zod";
import type { ButtonProps } from "@heroui/react";
import type { CRUD_ACTIONS } from "~/constant";
export type SummaryType = "sum" | "count" | "avg";
export type ColumnPinning = "none" | "start" | "end";

export type ColumnType =
  | "text"
  | "currency"
  | "date"
  | "datetime"
  | "number"
  | "total"
  | "content";

export type ColumnAlign = "left" | "center" | "right";
export type CrudActionType =
  | (typeof CRUD_ACTIONS)[keyof typeof CRUD_ACTIONS]
  | "all";
// export type CrudActionType =
//   | "add"
//   | "edit"
//   | "delete"
//   | "detail"
//   | "view"
//   | "log"
//   | "config_policy";

export type ActionItem<T> = {
  type: CrudActionType | string;
  label: string;
  action?: (row: T) => void;
  icon?: ReactNode;
  color?: string;
  bgColor?: ButtonProps["color"];
  bg?: string;
  permission?: number;
  isHidden?: (row: T) => boolean;
};
export type BaseColumnOptions<T> = {
  title: string;
  key: keyof T;
  type?: ColumnType;
  sortable?: boolean;
  hidden?: boolean | (() => boolean);
  roles?: string[];
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  align?: ColumnAlign;
  className?: string;
  render?: (row: T) => ReactNode;
  cellTemplate?: (row: T) => HTMLDivElement;
  summary?: SummaryType;
  actions?: CrudActionType[] | ["all"];
  customActions?: ActionItem<T>[];
  exportable?: boolean;
  hiddenExport?: boolean;
  exportTitle?: string;
  pin?: "colPinStart" | "colPinEnd";
};

export type ToolbarAction =
  | "add"
  | "edit"
  | "detail"
  | "export-excel"
  | "export-pdf"
  | "export-excel-agent"
  | "search"
  | "enter"
  | undefined;

export interface CustomToolbarButton {
  id: string;
  label: string;
  icon?: React.ComponentType<any>; // Icon là một React component
  onClick?: (selectedRows: any, table: any) => void; // Callback cho click
  actionType?: string; // Loại action để truyền vào onAction
  roleRequired?: string[]; // Quyền yêu cầu
  isHidden?: boolean;
  isDisabled?: boolean;
  className?: string;
  position?: "start" | "end";
  // type có thể là 'button' hoặc một React Component để render
  type?: "button" | React.ComponentType<any>; // Thêm kiểu React.ComponentType
  // Thêm các props khác có thể cần cho các loại component khác
  onChange?: (value: any) => void; // Callback cho change (ví dụ: cho input, select)
  value?: any; // Giá trị hiện tại cho các input
}

export type FormModalConfig<T> = {
  title?: string;
  isOpen: boolean;
  submitButtonLabel?: string; // Nhãn nút submit
  cancelButtonLabel?: string; // Nhãn nút cancel
  itemSchema?: z.ZodObject<any, any, any, any, any>; // Schema cho các thao tác item (create/edit)
  defaultItemValues?: any; // Giá trị mặc định cho item form
  exportButtonLabel?: string; // Nhãn nút export (tùy chọn)
  isOnlyExport?: boolean;
  renderFormContent?: React.ComponentType<{
    action: ToolbarAction;
    control: Control<TItemFormFields & TExportFormFields>;
    formState?: FormState<TItemFormFields & TExportFormFields>;
  }>;
  onSubmit?: (values: TItemFormFields & TExportFormFields) => void;
  onCancel?: () => void;
  onClose?: () => void;
  onFormSubmitSuccess?: () => void;
  onExport?: (values: TExportFormFields, data: T[]) => void;
};

export type ToolbarOptions = {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  customToolbarActions?:
    | React.ReactNode
    | ((
        onAction: (type: CrudActionType, data?: TItemFormFields) => void
      ) => React.ReactNode);
  actions?: ToolbarAction[];
  filters?: React.ReactNode;
  canExportPdf?: boolean;
  canSort?: boolean;
  hideExportExcel?: boolean;
  canAdd?: boolean; // Để bật/tắt hiển thị nút "Thêm mới"
  addLabel?: string; // Để thay đổi nhãn của nút
  actionType?: string;
  addRoleRequired?: string[]; // (TÙY CHỌN) Để kiểm tra vai trò nếu bạn vẫn muốn kiểm soát bên trong
  keyword?: string;
  hideSearch?: boolean;
  hiddenFilters?: boolean;
  showReport?: boolean;
  showReportMonth?: boolean;
  showMonth?: boolean;
  showPeriodic?: boolean;
  hiddenPeriodic?: boolean;
  hideColumnVisibility?: boolean;
  onSearch?: (value: string) => void;
  moreActions?: CustomToolbarButton[];
  customAdd?: boolean;
};

export interface ColumnPinningConfig {
  [columnId: string]: ColumnPinning;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T | any>[];
  searchValue?: string;
  className?: string;
  loading?: boolean;
  pageSizeOptions?: number[];
  queryKey?: any[];
  enableRowDrag?: boolean;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  onRowOrderChange?: (newData: T[]) => void; // Bổ sung callback reorder
  columnPinningConfig?: ColumnPinningState;
  onRowAction?: (type: CrudActionType, row: T) => void;
  toolbar?: ToolbarOptions;
  onAction?: (type: CrudActionType, data?: TItemFormFields) => void;
  customToolbarActions?: React.ReactNode;
  onToolbarAction?: (
    type: ToolbarAction,
    data?: TItemFormFields[] | string
  ) => void;
  renderToolbar?: (props: {
    selectedRows: T[];
    onToolbarAction?: DataTableProps<T>["onToolbarAction"];
  }) => React.ReactNode;
  customActions?: ActionItem<T>[];
  renderNoData?: () => React.ReactNode;
  renderRowActions?: (data?: T) => React.ReactNode;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  // FORM
  formModal?: FormModalConfig<T | any>;
  filterFields?: any;
  enableRowExpand?: boolean; // Thêm prop này
  renderSubComponent?: (props: { row: any }) => ReactNode;
  groupingColumnId?: string;
  // Hàm để render nội dung form (các trường input)
  // Component cha sẽ truyền component ProductForm hoặc UserForm... vào đây
  // renderFormContent: (
  //   action: ToolbarAction,
  //   control: Control<TItemFormFields & TExportFormFields>,
  //   formState?: FormState<TItemFormFields & TExportFormFields>
  // ) => ReactNode;
}
