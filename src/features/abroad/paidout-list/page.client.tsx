"use client";
import { useAuth, useCrud, useDataQuery } from "@/hooks";
import { getColumns } from "@/features/shared/common";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { noneLifePaidoutColumns } from "./columns";
import { DataTable } from "@/features/shared/components/data-table";

const columns = getColumns<any>(noneLifePaidoutColumns);

export default function PageClient() {
  const { user, role } = useAuth();
  const basePath = API_ENDPOINTS[role].abroad.paidoutList;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    monthFilter: true,
    periodFilter: true,
    filter: {
      id_agent: user?.id,
    },
  });
  const { getInfinite } = useCrud(queryKey, queryParams, {
    enabled: isQueryEnabled,
  });

  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getInfinite();

  return (
    <>
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
      />
    </>
  );
}
