import debounce from "lodash/debounce";
import { useEffect, useMemo } from "react";
import { FieldValues } from "react-hook-form";
import { Icons } from "~/components/icons";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Stack,
} from "~/components/ui";
import { CRUD_ACTIONS, TOOLBAR_ACTION_TYPES } from "~/constant";
import { useAuth, useFilter } from "~/hooks";
import { useIsMobile } from "~/hooks/use-mobile";
import type {
  CrudActionType,
  CustomToolbarButton,
  ToolbarAction,
  ToolbarOptions,
} from "~/types/data-table-type";
import type { TItemFormFields } from "~/types/form-field";
import { MonthField, PeriodField, RangeField } from "./filter-fields";
import SelectPeriodDic from "./select-period-dic";
import SelectReport from "./select-report";
import SelectReportMonth from "./select-report-month";

interface TableToolbarProps<T> {
  rows?: T[];
  onAction?: (
    type: ToolbarAction | CrudActionType,
    data?: TItemFormFields[] | TItemFormFields | string
  ) => void;
  setGlobalFilter?: (filter: string) => void;
  options?: ToolbarOptions;
}

export default function ToolbarGrid<T>({
  onAction,
  options,
  rows,
}: TableToolbarProps<T>) {
  const {
    filters,
    showReport,
    showReportMonth,
    showPeriodic,
    canSort,
    startContent,
    endContent,
    hideSearch,
    canExportPdf,
    hideExportExcel,
    keyword,
    canAdd = false,
    addLabel = "Thêm mới",
    actionType,
    addRoleRequired,
    moreActions,
    customAdd,
    customToolbarActions,
    hiddenFilters,
    onSearch,
  } = options ?? {};
  // const selectedRows = table
  // 	.getSelectedRowModel()
  // 	.flatRows.map((row) => row.original);
  const { role } = useAuth();
  const isMobile = useIsMobile();
  const selectedRows: string | FieldValues | FieldValues[] | undefined = [];
  const { enableFilters, setFilter } = useFilter();
  const { rangeFilter, periodFilter, monthFilter } = enableFilters || {};
  const shouldShowAddButton = useMemo(() => {
    if (!canAdd) {
      return false;
    }
    if (addRoleRequired && addRoleRequired.length > 0) {
      return role && addRoleRequired.includes(role as string);
    }
    return true;
  }, [canAdd, addRoleRequired, role]);

  const handleSearch = (value: string) => {
    if (onSearch) {
      onSearch(value);
    } else {
      setFilter("info", value);
    }
  };

  const debouncedSearch = useMemo(() => debounce(handleSearch, 500), []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const renderCustomButton: any = (
    button: CustomToolbarButton,
    selectedRows: any, // Đảm bảo selectedRows được truyền vào
    table: any, // Đảm bảo table được truyền vào
    onAction: (actionType: string, selectedRows: any[]) => void, // Đảm bảo onAction được truyền vào
    role: string | undefined // Đảm bảo role được truyền vào
  ) => {
    if (button.isHidden) {
      return null;
    }

    // --- Xử lý cho các loại component khác button ---
    if (button.type && button.type !== "button") {
      const ComponentToRender = button.type as React.ComponentType<any>; // Cast sang ComponentType

      // Xử lý props cho component
      const componentProps: any = {
        key: button.id,
        className: button.className,
        isDisabled: button.isDisabled,
        // Truyền các props chung
      };

      // Xử lý onClick cho component nếu có
      if (button.onClick) {
        componentProps.onClick = () => button.onClick?.(selectedRows, table);
      }
      // Xử lý onChange cho component nếu có
      if (button.onChange) {
        componentProps.onChange = (
          event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        ) => {
          button.onChange?.(event.target.value); // Truyền giá trị của input
        };
      }
      // Truyền các props đặc thù của button
      if (button.label) {
        componentProps.children = button.label;
      }
      if (button.value !== undefined) {
        componentProps.value = button.value;
      }
      return <ComponentToRender {...componentProps} />;
    }

    // --- Xử lý cho các button thông thường ---
    // Kiểm tra quyền truy cập cho custom button
    if (button.roleRequired && button.roleRequired.length > 0) {
      if (!role || !button.roleRequired.includes(role as string)) {
        return null;
      }
    }

    const IconComponent = button.icon;

    return (
      <Button
        key={button.id}
        onClick={() => {
          if (button.onClick) {
            button.onClick(selectedRows, table); // Truyền selectedRows và table instance
          } else if (button.actionType) {
            onAction?.(button.actionType, selectedRows); // Sử dụng actionType nếu onClick không được định nghĩa
          }
        }}
        isDisabled={button.isDisabled}
        className={button.className}
        startContent={
          IconComponent ? (
            <IconComponent size={16} fill="currentColor" />
          ) : undefined
        }
      >
        {button.label}
      </Button>
    );
  };
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 w-full">
      <div className="flex gap-1 md:gap-2">
        {!hideSearch && (
          <Input
            isClearable
            type="text"
            placeholder="Tìm kiếm..."
            value={keyword}
            onValueChange={(val) => {
              debouncedSearch(val);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                debouncedSearch.cancel();
                handleSearch((e.target as HTMLInputElement).value);
              }
            }}
            startContent={
              <Icons.search strokeWidth={1} className="text-default-600" />
            }
            className="max-w-[180px] md:max-w-[250px]"
            classNames={{
              inputWrapper: "min-h-8 h-8 md:min-h-9 md:h-9",
              input: "text-xs md:text-sm",
            }}
          />
        )}
        {showReport && <SelectReport placeholder="Chọn tháng..." />}
        {showReportMonth && <SelectReportMonth placeholder="Chọn tháng..." />}
        {showPeriodic && <SelectPeriodDic placeholder="Chọn kỳ..." />}
        {/* new filter  */}
        {rangeFilter && !hiddenFilters && (
          <RangeField placeholder="Chọn tháng..." />
        )}
        {monthFilter && !hiddenFilters && (
          <MonthField placeholder="Chọn tháng..." />
        )}
        {periodFilter && !hiddenFilters && (
          <PeriodField placeholder="Chọn kỳ..." />
        )}
        {startContent}
        {filters}
        {moreActions
          ?.filter((action) => action.position === "start")
          .map(renderCustomButton)}
        {rows?.length ? (
          <>
            {canExportPdf ? (
              <Button
                onPress={() => onAction?.(CRUD_ACTIONS.EXPORT, rows)}
                endContent={<Icons.download size={16} />}
                color="secondary"
                className="flex-1 h-8 md:h-9 px-2.5 min-w-32"
                size="sm"
              >
                Xuất PDF
              </Button>
            ) : null}
            {!hideExportExcel ? (
              <Button
                size="sm"
                onPress={() =>
                  onAction?.(TOOLBAR_ACTION_TYPES.EXPORT_EXCEL, rows)
                }
                isIconOnly
                color="success"
                variant="bordered"
                className="hover:bg-green-700 hover:text-white h-8 md:h-9 md:min-w-9 md:w-9 p-0"
              >
                <Icons.excel size={18} strokeWidth={1.5} />
              </Button>
            ) : null}
          </>
        ) : null}
        {canSort ? (
          <Button
            // data-tooltip-id="order_btn"
            // data-tooltip-content="Sắp xếp thứ tự"
            className="btn-icon h-9 border-orange-500 text-orange-500"
            size="sm"
            color="secondary"
            variant="bordered"
            onPress={() => onAction?.(CRUD_ACTIONS.ORDER, selectedRows)}
          >
            <Icons.shuffle size={16} className="text-orange-500" />
          </Button>
        ) : null}
      </div>
      <Stack alignItems={"center"} className="gap-x-2">
        {shouldShowAddButton && (
          <Button
            onPress={() =>
              onAction?.(
                (actionType as CrudActionType) || CRUD_ACTIONS.ADD,
                selectedRows
              )
            }
            color="secondary"
            startContent={<Icons.add size={16} fill="currentColor" />}
            isIconOnly={isMobile}
            size="sm"
          >
            {!isMobile ? addLabel : ""}
          </Button>
        )}
        {customAdd && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                color="secondary"
                startContent={<Icons.add size={16} fill="currentColor" />}
                isIconOnly={isMobile}
                size="sm"
              >
                {!isMobile ? "Tạo hợp đồng" : ""}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              onAction={(val: any) =>
                onAction?.((actionType as CrudActionType) || CRUD_ACTIONS.ADD, {
                  ...selectedRows,
                  contractType: val,
                })
              }
            >
              <DropdownItem key="new">Khai thác mới</DropdownItem>
              <DropdownItem key="renew">Tái tục</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        {moreActions
          ?.filter((action) => action.position === "end" || !action.position)
          .map(renderCustomButton)}
        {endContent}
        {typeof customToolbarActions === "function"
          ? // biome-ignore lint/style/noNonNullAssertion: <explanation>
            customToolbarActions(onAction!)
          : customToolbarActions}
        {/* {!hideColumnVisibility && (
					<ColumnVisibilityToggle columns={table.getAllLeafColumns()} />
				)} */}
      </Stack>
    </div>
  );
}
