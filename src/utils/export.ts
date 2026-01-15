// lib/exportToExcel.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
	formatDate,
	formatDateTimeVN,
	formatNumber,
	getEventStatus,
} from './formater';
import { getBooleanLabel } from './data-conversion';
// Định nghĩa mới cho ColumnConfig để khớp với DataTable columns
interface ColumnConfig<T> {
	header: string;
	accessorKey: keyof T | ((item: T) => React.ReactNode);
}

/**
 * Exports an array of objects to an Excel (.xlsx) file with custom headers.
 * @param data The array of data objects to export.
 * @param columns The column configuration from DataTable, containing header and accessorKey.
 * @param fileName The desired name for the Excel file (without extension).
 * @param sheetName The name for the sheet within the Excel file.
 */
// lib/exportToExcel.ts

export const exportToExcel = <T>(
	data: T[],
	columns: any[],
	fileName: string,
	sheetName = 'Sheet1',
) => {
	// if (!data || data.length === 0) {
	// 	console.warn('No data provided for export.');
	// 	return;
	// }

	// Bước 1: Chuẩn bị cấu hình cột cho việc export
	const exportHeaders: string[] = [];
	const exportGetters: Array<(item: any, index: number) => any> = [];

	// Kiểm tra xem columns đã có cột STT chưa
	const hasSttColumn = columns.some((col) => {
		const { accessorKey } = col?.columnDef || col;
		return accessorKey === 'stt';
	});

	// Chỉ thêm cột STT nếu columns chưa có
	if (!hasSttColumn) {
		exportHeaders.push('STT');
		exportGetters.push((_item, index) => index + 1);
	}

	// custom
	const columnFormats: { [key: number]: string } = {};

	// Duyệt qua các cột và xử lý
	columns.forEach((col) => {
		const { header, accessorKey, meta } = col?.columnDef || col;
		// Bỏ qua cột actions và các cột có cờ hiddenExport
		if (accessorKey === 'actions' || meta?.hiddenExport) {
			return;
		}

		// Chỉ thêm các cột được phép export hoặc không bị ẩn
		if (meta?.exportable || !meta?.hidden) {
			exportHeaders.push(meta?.exportTitle || header);
			const currentColIndex = exportHeaders.length - 1;

			// Apply number format if type is number
			if (meta?.type === 'number') {
				columnFormats[currentColIndex] = '#,##0';
			}

			// Xây dựng getter function cho cột này để tối ưu performance (tránh find trong loop)
		if (accessorKey === 'stt') {
			exportGetters.push((_item, index) => index + 1);
		} else if (accessorKey === 'created_month') {
				exportGetters.push((item) => {
					const d = item.real_date || item.created_date;
					return d
						? (new Date(d).getMonth() + 1).toString().padStart(2, '0')
						: '';
				});
			} else if (accessorKey === 'created_year') {
				exportGetters.push((item) => {
					const d = item.real_date || item.created_date;
					return d ? new Date(d).getFullYear() : '';
				});
			} else if (accessorKey === 'status_meeting') {
				exportGetters.push(
					(item) => getEventStatus(item.start_date, true).status,
				);
			} else {
				// Getter cho cột thông thường


				exportGetters.push((item) => {
					if (typeof accessorKey === 'function') {
						return accessorKey(item);
					}

					const valueItem = item[accessorKey];

					// Format dữ liệu
					if (meta?.type === 'date') return formatDate(valueItem);
					if (meta?.type === 'datetime') return formatDateTimeVN(valueItem);
					if (meta?.type === 'number') {
						if (valueItem == null || Number.isNaN(Number(valueItem))) return '';
						return Number(valueItem);
					}

					const boolLabel = getBooleanLabel(accessorKey, valueItem);
					if (boolLabel) return boolLabel.label || valueItem;

					return valueItem;
				});
			}
		}
	});

	// Bước 2: Chuẩn bị dữ liệu cho việc export
	const exportData = data.map((item: any, index) => {
		const rowData: { [key: string]: any } = {};

		exportHeaders.forEach((header, colIndex) => {
			// Sử dụng getter đã chuẩn bị
			rowData[header] = exportGetters[colIndex](item, index);
		});

		return rowData;
	});

	// Bước 3: Tạo Worksheet và xuất file
	const ws = XLSX.utils.json_to_sheet(exportData);

	// Apply column formats
	const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
	for (let C = range.s.c; C <= range.e.c; ++C) {
		if (columnFormats[C]) {
			for (let R = range.s.r + 1; R <= range.e.r; ++R) {
				const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
				if (ws[cellRef]) {
					ws[cellRef].z = columnFormats[C];
					ws[cellRef].t = 'n'; // Ensure it is treated as number
				}
			}
		}
	}
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, sheetName);

	const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
	try {
		const blob = new Blob([wbout], { type: 'application/octet-stream' });
		saveAs(blob, `${fileName}.xlsx`);
	} catch (e) {
		console.error('Error saving file:', e);
	}
};
export const exportDataToExcel = (
	data: any,
	columns: any,
	fileName: string,
) => {
	const ws = XLSX.utils.json_to_sheet(data as any, { header: columns });
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
	const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
	try {
		const blob = new Blob([wbout], { type: 'application/octet-stream' });
		saveAs(blob, `${fileName}.xlsx`);
	} catch (e) {
		console.error('Error saving file:', e);
	}
};
