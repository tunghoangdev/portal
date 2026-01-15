import type { ColumnDef } from '@tanstack/react-table';
import type { ColumnRegular } from '@revolist/revogrid';

export function convertToRevoColumns<T>(
	columns: ColumnDef<T>[],
): ColumnRegular[] {
	return columns.map((col: any) => {
		const prop = col.accessorKey ? String(col.accessorKey) : col.id || '';
		return {
			prop,
			name: col.header ? String(col.header) : prop,
			size: col.size,
			align: col.meta?.align as 'left' | 'center' | 'right',
			sortable: col.enableSorting ?? true,
			// nếu có cell custom
			cellTemplate: col.cell
				? (createElement, props) => {
						const model = props.model;
						const val =
							model?.[prop] ??
							model?.[col.meta?.key] ??
							model?.[col.key] ??
							model?.[col.id] ??
							'';

						const el = document.createElement('div');
						el.className = 'px-2 text-sm text-gray-800';
						el.textContent = String(val);
						return el;
					}
				: undefined,
		};
	});
}
