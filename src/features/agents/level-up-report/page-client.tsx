import { useAuth, useDataQuery } from '@/hooks';
import { DataTable } from '@/features/shared/components/data-table';
import { CRUD_ACTIONS } from '@/constant';
import { getColumns } from '@/features/shared/common';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { levelUpReportBaseColumns } from './columns';
import { Icons } from '@/components/icons';
import { useCrud } from '@/hooks/use-crud-v2';

const columns = getColumns<any>(levelUpReportBaseColumns, {
  actions: [CRUD_ACTIONS.LEVEL_UP_APPROVE],
});

export default function PageClient() {
  const { role } = useAuth();
  const basePath = API_ENDPOINTS[role].agents.levelUpReport;
  // CRUD HOOKS
  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
  });
  const { getInfinite, updateConfirm } = useCrud(queryKey, queryParams);
  const {
    listData,
    isFetching,
    fetchNextPage,
    total,
    isFetchingNextPage,
    hasNextPage,
    refetch,
  }: any = getInfinite();
  const handleApprove = async (action: string, row: any) => {
    await updateConfirm(
      {
        id: row.id,
      },
      {
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn duyệt thăng tiến?',
        _customUrl: basePath.approved,
      }
    );
    refetch();
  };
  return (
    <DataTable
      data={listData}
      columns={columns}
      total={total}
      onAction={handleApprove}
      columnPinningConfig={{
        left: ['agent_name'],
        right: ['actions'],
      }}
      loading={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      customActions={[
        {
          type: CRUD_ACTIONS.LEVEL_UP_APPROVE,
          label: 'Duyệt thăng tiến',
          icon: <Icons.check size={16} />,
          isHidden: (row: any) => {
            return !row?.is_pass;
          },
        },
      ]}
    />
  );
}
