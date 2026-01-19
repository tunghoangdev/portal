
import { useMemo } from "react";
import { useAuth, useCommon, useCommonData, useDataQuery } from "@/hooks";
import { DataTable } from "@/features/shared/components/data-table";
import { ROLES } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { useCrud } from "@/hooks/use-crud-v2";
import { getColumns } from "@/features/shared/common";
import { programColumns } from "./columns";

const columns = getColumns<any>(programColumns, {
  omitKeys: ["permission_doc_name", "permission_doc", "is_hide"],
});

export default function PageClient() {
  // GLOBAL STATE
  const { role, user } = useAuth();
  const { agentLevels } = useCommon();

  const basePath = API_ENDPOINTS[role].program;

  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
    filter: {
      id_agent_level: role === ROLES.AGENT && user?.id_agent_level,
    },
  });
  const { getInfinite } = useCrud(queryKey, queryParams);
  useCommonData("agentLevels", API_ENDPOINTS.dic.agentLevel, {
    enabled: !agentLevels?.length,
  });
  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getInfinite();

  const newListData = useMemo(() => {
    return listData?.map((item: any) => {
      if (
        item.permission_doc &&
        typeof item.permission_doc === "string" &&
        agentLevels?.length
      ) {
        item.permission_doc = item.permission_doc?.split(";");
        item.permissions = agentLevels?.filter((level: any) =>
          item.permission_doc?.includes(level.id.toString())
        );
      }
      return item;
    });
  }, [agentLevels, listData]);

  return (
    <DataTable
      data={newListData}
      columns={columns}
      loading={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      total={total}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      columnPinningConfig={{
        left: ["program_name"],
        right: [],
      }}
    />
  );
}
