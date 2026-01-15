import { createColumn } from "./create-column";
import type {
  BaseColumnOptions,
  CrudActionType,
} from "~/types/data-table-type";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { actionInfoColumns } from "~/features/shared/common";
import { makeRevoCellTemplate } from "./convert-cell-revo";
export type InsertKeyPosition = "start" | "end" | "after-key" | "before-key";

function createIndexColumnDef<T>(): ColumnDef<T> & {
  prop?: string;
  name?: string;
  cellTemplate?: any;
  pin?: string;
} {
  return {
    header: "STT",
    id: "stt",
    prop: "stt",
    name: "STT",
    accessorKey: "stt",
    cell: (info: CellContext<T, unknown>) => info.row.index + 1,
    size: 50,
    minSize: 80,
    maxSize: 80,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    meta: {
      align: "center",
    },
    cellTemplate: makeRevoCellTemplate({
      render(row) {
        return row.rowIndex + 1;
      },
    }),
  };
}
export function getColumns<T>(
  configs: BaseColumnOptions<T>[],
  options?: {
    omitKeys?: (keyof T)[];
    actions?: CrudActionType[];
    isLog?: boolean;
    disableIndexColumn?: boolean;
    extraConfigs?: BaseColumnOptions<T>[];
    insertExtraAt?: {
      position: InsertKeyPosition;
      key?: keyof T;
    };
  }
): ColumnDef<T>[] {
  const {
    omitKeys = [],
    actions,
    isLog,
    disableIndexColumn,
    extraConfigs,
    insertExtraAt,
  } = options || {};
  let processedConfigs = configs.filter((config) => {
    if (omitKeys.includes(config.key)) return false;

    if (typeof config?.hidden === "function") {
      return !config.hidden();
    }
    if (!disableIndexColumn && config.key === "stt") {
      return false;
    }
    return !config?.hidden;
  });

  if (isLog) {
    processedConfigs = processedConfigs.map((config) => ({
      ...config,
      summary: undefined,
    }));
  }

  let finalColumnDefs: ColumnDef<T>[] = processedConfigs
    .map((config) => createColumn<T>(config))
    .filter(Boolean);
  if (!disableIndexColumn) {
    const indexColumn = createIndexColumnDef<T>();
    finalColumnDefs = [indexColumn, ...finalColumnDefs];
  }
  let currentExtraConfigs: BaseColumnOptions<T>[] = extraConfigs || [];
  let currentInsertExtraAt = insertExtraAt;
  if (isLog) {
    // Thêm các cột log mặc định vào đầu mảng extra configs
    currentExtraConfigs = actionInfoColumns.concat(currentExtraConfigs);
    // Ghi đè vị trí chèn thành sau cột STT
    if (
      !currentInsertExtraAt ||
      !currentInsertExtraAt.key ||
      currentInsertExtraAt.position !== "after-key"
    ) {
      currentInsertExtraAt = {
        position: "after-key",
        key: "stt" as keyof T,
      };
    }
  }

  if (currentExtraConfigs.length > 0) {
    const position = currentInsertExtraAt?.position || "end";
    const key = currentInsertExtraAt?.key;
    const extraConfigDefs = (
      isLog
        ? currentExtraConfigs.map((config) => ({ ...config, summary: "" }))
        : currentExtraConfigs
    )
      .map((config) => createColumn<T>(config as BaseColumnOptions<T>))
      .filter(Boolean);
    if (position === "start") {
      finalColumnDefs = [...extraConfigDefs, ...finalColumnDefs];
    } else if (position === "end") {
      finalColumnDefs = [...finalColumnDefs, ...extraConfigDefs];
    } else if (key) {
      const targetId = String(key);
      const targetIndex = finalColumnDefs.findIndex(
        (col: any) => col.id === targetId || col.key === targetId
      );

      if (targetIndex !== -1) {
        let insertIndex = targetIndex;
        if (position === "after-key") {
          insertIndex = targetIndex + 1;
        }
        finalColumnDefs = [
          ...finalColumnDefs.slice(0, insertIndex),
          ...extraConfigDefs,
          ...finalColumnDefs.slice(insertIndex),
        ];
      } else {
        finalColumnDefs = [...finalColumnDefs, ...extraConfigDefs];
      }
    }
  }

  if (actions && actions.length > 0) {
    const actionColumnConfig: BaseColumnOptions<T> = {
      title: "Thao tác",
      key: "actions" as keyof T,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      align: "center",
      actions,
      pin: "colPinEnd",
    };
    const actionColumnDef = createColumn<T>(actionColumnConfig);
    finalColumnDefs = [...finalColumnDefs, actionColumnDef];
  }

  return finalColumnDefs;
  // return finalColumnDefs.filter((col: any) => !col?.meta?.exportable);
  // if (actions && actions.length > 0) {
  // 	const actionColumnConfig: BaseColumnOptions<T> = {
  // 		title: 'Thao tác',
  // 		key: 'actions' as keyof T,
  // 		width: 80,
  // 		minWidth: 80,
  // 		maxWidth: 80,
  // 		align: 'center',
  // 		actions,
  // 	};
  // 	processedConfigs = [...processedConfigs, actionColumnConfig];
  // }

  // return processedConfigs
  // 	.map((config) => createColumn<T>(config))
  // 	.filter(Boolean);
}
