import { Icons } from "@/components/icons";
import { Button } from "@/components/ui";
import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common";
import { COMPLETED } from "@/features/shared/components/cells";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery, useModal, usePermissionAction } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import { toUnaccentedLower } from "@/utils/util";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { reportPaidoutColumns } from "./columns";
const columns = getColumns<any>(reportPaidoutColumns);
export default function PageClient() {
  const { role } = useAuth();
  const [shouldExport, setShouldExport] = useState(false);
  const { openDetailModal, closeModal } = useModal();
  const basePath = API_ENDPOINTS[role].reports.paidoutList;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    monthFilter: true,
    periodFilter: true,
  });
  const { getInfinite } = useCrud(queryKey, queryParams, {
    enabled: isQueryEnabled,
  });

  const { getAll } = useCrud(
    [...queryKey, "export-excel"],
    {
      ...queryParams,
      page_size: 1000000,
    },
    {
      enabled: false,
    },
  );
  const { data: dataExport, isFetching: isLoading, refetch }: any = getAll();
  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getInfinite();
  useEffect(() => {
    if (!dataExport?.list?.length || isLoading || !shouldExport) {
      return;
    }
    setShouldExport(false);
    exportToExcel(dataExport.list, queryParams?.period_name);
  }, [dataExport, isLoading, shouldExport, queryParams]);
  const handleExport = useCallback(() => {
    if (isLoading) return;
    setShouldExport(true);
    refetch();
  }, [isLoading, refetch]);
  const { runAction } = usePermissionAction({
    onAction: handleExport,
  });

  const exportToExcel = async (dataList: any, periodName: string) => {
    const newData = dataList.filter(
      (item: any) => item.econtract_status === COMPLETED,
    );

    if (!newData.length) {
      toast.error("Không có dữ liệu để xuất file");
      return;
    }

    const fileName = `Ngoai ${periodName || ""}`;
    const list = newData.map((item: any, index: number) => ({
      STT: index + 1,
      "Ho va ten": toUnaccentedLower(item.agent_name).toUpperCase(),
      "So tai khoan": item.bank_number,
      "So tien": item.total,
      "Loai tien": "VND",
      "Ngan hang": item.bank_name,
      "Dien giai": `Exw TT ${periodName || ""}`,
    }));
    const defaultFont = {
      name: "Times New Roman",
      size: 10,
    };
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.columns = [
      {
        header: "STT",
        key: "STT",
        width: 5,
        alignment: { horizontal: "center" },
      },
      { header: "Ho va ten", key: "Ho va ten", width: 20 },
      { header: "So tai khoan", key: "So tai khoan", width: 20 },
      {
        header: "So tien",
        key: "So tien",
        width: 10,
      },
      { header: "Loai tien", key: "Loai tien", width: 10 },
      { header: "Ngan hang", key: "Ngan hang", width: 40 },
      { header: "Dien giai", key: "Dien giai", width: 20 },
    ];

    // Thêm dữ liệu vào sheet
    worksheet.addRows(list);
    worksheet.columns.forEach((column) => {
      column.font = defaultFont;
    });
    // Áp dụng Style TÔ ĐẬM & MÀU NỀN cho Header
    const headerRow = worksheet.getRow(1);
    const totalColumn = worksheet.getColumn("So tien");
    totalColumn.numFmt = "#,##0";
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { ...defaultFont, bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "f2f2f2" },
      };
    });
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${fileName}.xlsx`);
    } catch (e) {
      console.error("Error saving file:", e);
    }
  };
  return (
    <DataTable
      data={listData}
      columns={columns}
      loading={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      total={total || 0}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      columnPinningConfig={{
        left: ["agent_name"],
      }}
      toolbar={{
        endContent: (
          <Button
            onPress={() => runAction(CRUD_ACTIONS.EXPORT_EXCEL)}
            color="primary"
            size="sm"
            variant="bordered"
            startContent={<Icons.banknote size={16} />}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Xuất ngân hàng
          </Button>
        ),
      }}
    />
  );
}
