import { useCallback, useState } from "react"; // Thêm useRef, useCallback
import { useCrud } from "~/hooks/use-crud-v2";
import { DataTable } from "~/features/shared/components/data-table";
import { DEFAULT_PARAMS, ROLES } from "~/constant";
import { getColumns } from "~/features/shared/common";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { Endpoint } from "~/types/axios";
import { useAuth, useCommon, useModal } from "~/hooks";
import { listColumns } from "./commission-columns";
import { CrudActionType } from "~/types/data-table-type";
import { useDisclosure } from "~/components/ui";
import { CommissionPdfView } from "../../commission-pdf";
const columns = getColumns<any>(listColumns);

type ICommissionTable = {
  id: number;
};
export const CommissionTable = ({ id }: ICommissionTable) => {
  const { periodDate, period_name } = useCommon();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { role } = useAuth();
  const [pdfUrl, setPdfUrl] = useState<any>();

  const { openDetailModal } = useModal();
  const [filter, setFilter] = useState(DEFAULT_PARAMS);

  const { getAll } = useCrud(
    [
      API_ENDPOINTS[ROLES.AGENT].commissionTable.list,
      filter,
      periodDate,
      period_name,
      id,
    ],
    {
      endpoint: ROLES.AGENT as Endpoint,
      ...filter,
      id,
      period_name: period_name || "",
      ...periodDate,
    },
    {
      enabled: !!periodDate && !!id,
    }
  );

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getAll();

  const handleCrudAction = useCallback(
    async (action: CrudActionType, detail: any) => {
      openDetailModal(detail, {
        title: "",
        size: "full",
        renderContent: () => <CommissionPdfView id={id} />,
      });
    },
    [openDetailModal]
  );

  return (
    <DataTable
      data={data?.list || []}
      columns={columns}
      loading={isFetching}
      searchValue={filter.info}
      isFetchingNextPage={isFetchingNextPage}
      total={total || 0}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      onAction={handleCrudAction}
      toolbar={{
        hideSearch: true,
        canExportPdf: true,
        // showMonth: true,
        showReport: true,
        showPeriodic: true,
        onSearch: (value) => {
          setFilter({ ...filter, info: value });
        },
      }}
    />
  );
};
