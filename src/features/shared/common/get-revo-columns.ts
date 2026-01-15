import { createRevoColumn } from './create-revo-column';
import type {
	BaseColumnOptions,
	CrudActionType,
} from '~/types/data-table-type';
import { actionInfoColumns } from '~/features/shared/common';

export type InsertKeyPosition = 'start' | 'end' | 'after-key' | 'before-key';

/**
 * Hàm tạo cột STT cho RevoGrid
 */
function createIndexRevoColumn() {
	return {
		prop: 'stt',
		name: 'STT',
		size: 50,
		minSize: 50,
		maxSize: 50,
		sortable: false,
		cellTemplate: (createElement: any, props: any) =>
			createElement(
				'div',
				{ class: 'flex justify-center items-center w-full h-full text-center' },
				props.rowIndex + 1,
			),
		meta: {
			align: 'center',
		},
	};
}

/**
 * Chuyển danh sách cấu hình cột (BaseColumnOptions) sang RevoGrid Columns
 */
export function getRevoColumns<T>(
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
	},
) {
	const {
		omitKeys = [],
		actions,
		isLog,
		disableIndexColumn,
		extraConfigs,
		insertExtraAt,
	} = options || {};

	// Lọc cột
	let processedConfigs = configs.filter((config) => {
		if (omitKeys.includes(config.key)) return false;
		if (isLog && !!config?.summary) return false;
		if (typeof config?.hidden === 'function') {
			return !config.hidden();
		}
		if (!disableIndexColumn && config.key === 'stt') {
			return false;
		}
		return !config?.hidden;
	});

	// Tạo cột chính từ config
	let finalColumns = processedConfigs
		.map((config) => createRevoColumn<T>(config))
		.filter(Boolean);

	// Thêm cột STT nếu chưa tắt
	if (!disableIndexColumn) {
		const indexColumn: any = createIndexRevoColumn();
		finalColumns = [indexColumn, ...finalColumns];
	}

	let currentExtraConfigs: BaseColumnOptions<T>[] = extraConfigs || [];
	let currentInsertExtraAt = insertExtraAt;

	// Nếu là log, thêm cột log
	if (isLog) {
		currentExtraConfigs = actionInfoColumns.concat(currentExtraConfigs);
		if (
			!currentInsertExtraAt ||
			!currentInsertExtraAt.key ||
			currentInsertExtraAt.position !== 'after-key'
		) {
			currentInsertExtraAt = {
				position: 'after-key',
				key: 'stt' as keyof T,
			};
		}
	}

	// Thêm các extra config
	if (currentExtraConfigs.length > 0) {
		const position = currentInsertExtraAt?.position || 'end';
		const key = currentInsertExtraAt?.key;
		const extraConfigDefs = currentExtraConfigs
			.map((config) => createRevoColumn<T>(config))
			.filter(Boolean);

		if (position === 'start') {
			finalColumns = [...extraConfigDefs, ...finalColumns];
		} else if (position === 'end') {
			finalColumns = [...finalColumns, ...extraConfigDefs];
		} else if (key) {
			const targetId = String(key);
			const targetIndex = finalColumns.findIndex(
				(col: any) => col.prop === targetId || col.key === targetId,
			);
			if (targetIndex !== -1) {
				let insertIndex = targetIndex;
				if (position === 'after-key') {
					insertIndex = targetIndex + 1;
				}
				finalColumns = [
					...finalColumns.slice(0, insertIndex),
					...extraConfigDefs,
					...finalColumns.slice(insertIndex),
				];
			} else {
				finalColumns = [...finalColumns, ...extraConfigDefs];
			}
		}
	}

	// Thêm cột Thao tác
	if (actions && actions.length > 0) {
		const actionColumnConfig: BaseColumnOptions<T> = {
			title: 'Thao tác',
			key: 'actions' as keyof T,
			width: 80,
			minWidth: 80,
			maxWidth: 80,
			align: 'center',
			actions,
		};
		const actionColumnDef = createRevoColumn<T>(actionColumnConfig);
		finalColumns = [...finalColumns, actionColumnDef];
	}

	return finalColumns;
}
