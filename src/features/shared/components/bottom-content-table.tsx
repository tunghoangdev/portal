import { Pagination, Stack, Typography } from "~/components/ui";
import { type Table } from "@tanstack/react-table";

type TableFooterProps<TData> = {
  table: Table<TData>;
  onPageChange?: (page: number) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
};

export function TableFooterContent<TData>({
  table,
  onPageChange,
  fetchNextPage,
  hasNextPage,
}: TableFooterProps<TData>) {
  if (fetchNextPage || hasNextPage || table.getPageCount() <= 1) {
    return null;
  }

  return (
    <Stack justifyContent="between" alignItems="center" className="mt-3">
      <Typography variant="body2r" className="text-default-700 leading-0">
        Tổng cộng: <b>{table.getFilteredRowModel().rows.length} dòng</b>
      </Typography>
      <Pagination
        isCompact
        showControls
        color="secondary"
        page={table.getState().pagination.pageIndex + 1}
        total={table.getPageCount()}
        onChange={(page) => onPageChange?.(page)}
        size="sm"
        radius="sm"
      />
    </Stack>
  );
}
