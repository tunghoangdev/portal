import { useMemo, useState } from "react";
import { useAuth, useCommon, useCommonData } from "~/hooks";
import { DataTable } from "~/features/shared/components/data-table";
import { DEFAULT_PARAMS } from "~/constant";
import { getColumns } from "~/features/shared/common/get-columns";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useCrud } from "~/hooks/use-crud-v2";
import {  docMemberColumns } from "~/features/shared/common";
const logColumns = getColumns<any>(docMemberColumns, {
  isLog: true
});
interface IProps {
  id: number;
  url: string;
}
export default function DocMemberHistoryList({ id, url }: IProps) {
  // Global state
  const { role } = useAuth();
  const { agentLevels } = useCommon();
  // Local state
  const [filter, setFilter] = useState(DEFAULT_PARAMS);
  // CRUD HOOKS
  useCommonData("agentLevels", API_ENDPOINTS.dic.agentLevel, {
    enabled: !agentLevels?.length,
  });
  const { getAll } = useCrud(
    [url, filter],
    {
      endpoint: role,
      ...filter,
      id: id,
    },
    {
      enabled: !!id && !!url,
      staleTime: 1,
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

  const newListData = useMemo(() => {
    if (!data?.list?.length) {
      return [];
    }
    return data?.list?.map((item: any) => {
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
  }, [agentLevels, data]);

  return (
    <DataTable
      data={newListData}
      columns={logColumns}
      loading={isFetching}
      searchValue={filter.info}
      isFetchingNextPage={isFetchingNextPage}
      total={total || 0}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      groupingColumnId="document_type_name"
      toolbar={{
        onSearch: (value) => {
          setFilter({ ...filter, info: value });
        },
      }}
    />
  );
}
