import { BaseColumnOptions } from "~/types/data-table-type";
import { useMemo } from "react";
import { useCrud } from "./use-crud-v2";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { createColumnDef, createColumnUserDef } from "~/features/shared/common/create-column";
import {
  columnMonthYears,
  getColumns,
  InsertKeyPosition,
} from "~/features/shared/common";
import { ColumnDef } from "@tanstack/react-table";
interface MoreCol<T> {
  showMonthYear?: boolean;
  showLevel?: boolean;
  showCommission?: boolean;
  hiddenPercent?: boolean;
  levelKey?: string;
  actions?: any[];
  omitKeys?: (keyof T)[];
  extraConfigs?: BaseColumnOptions<T>[];
  insertExtraAt?: {
    position: InsertKeyPosition;
    key?: keyof T;
  };
}
export const useTableColumns = <T>(
  baseColumns: BaseColumnOptions<T>[],
  options?: MoreCol<T>
) => {
  const {
    showMonthYear,
    showLevel,
    showCommission,
    hiddenPercent,
    levelKey = "level_",
    actions,
    omitKeys,
    extraConfigs,
    insertExtraAt,
  } = options || {};
  const { getAll: getAllAgentLevel } = useCrud(
    [API_ENDPOINTS.dic.agentLevel],
    {
      endpoint: "",
      listUrl: "dic",
    },
    {
      enabled: showLevel,
    }
  );
  const { data: agentLevelList }: any = getAllAgentLevel();
  const levelColumns = useMemo(() => {
    if (!showLevel || !agentLevelList?.length) return [];
    return agentLevelList.map(createColumnUserDef('level_', ""));
  }, [agentLevelList, showLevel]);

  const commissionColumns = useMemo(() => {
    if (!showCommission || !agentLevelList?.length) return [];
    const rewardColumns = agentLevelList.map(
      createColumnDef('com_level_', 'Thưởng', { hiddenPercent }),
    );
    const sameLevelColumns = agentLevelList.map(
      createColumnDef('com_level_same_', 'Thưởng đồng cấp', { hiddenPercent }),
    );
    return [...rewardColumns, ...sameLevelColumns];
  }, [agentLevelList, showCommission, hiddenPercent]);

  // Memoize combined configs để tránh tạo array mới mỗi render
  const combinedConfigs = useMemo(() => {
    const newColumns = showMonthYear
      ? [...baseColumns, ...columnMonthYears()]
      : baseColumns; // Không cần spread nếu không thêm gì
    
    // Flat và concat một lần
    const allColumns = [
      ...newColumns,
      ...(levelColumns.flat() || []),
      ...(commissionColumns.flat() || [])
    ];
    
    return allColumns;
  }, [baseColumns, showMonthYear, levelColumns, commissionColumns]);

  const tableCol = useMemo(() => {
    const completeColumns = getColumns<T>(combinedConfigs, {
      actions,
      omitKeys,
      extraConfigs,
      insertExtraAt,
    });
    
    const logColumns = getColumns<T>(combinedConfigs, {
      isLog: true,
    });
    
    return {
      columns: completeColumns as ColumnDef<T>[],
      logColumns: logColumns as ColumnDef<T>[],
    };
  }, [
    combinedConfigs,
    actions,
    omitKeys,
    extraConfigs,
    insertExtraAt,
  ]);
  const { columns, logColumns } = tableCol;
  return { columns, logColumns };
};
