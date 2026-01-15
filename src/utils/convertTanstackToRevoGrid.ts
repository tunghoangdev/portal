import { Template } from '@revolist/react-datagrid';

// utils/convertTanstackToRevoGrid.ts
export function convertTanstackToRevoGrid(columns: any[], rows: any[]) {
	const revogridColumns = columns.map((col) => {
		const prop = col.accessorKey ? String(col.accessorKey) : col.id || '';
		const column: any = {
			prop,
			name: col.header ? String(col.header) : prop,
			size: col.size ?? 120,
			minSize: col.minSize ?? 60,
			maxSize: col.maxSize,
			sortable: col.enableSorting ?? true,
			resizable: col.enableResizing ?? true,
			autoSize: true,
			align: col.meta?.align ?? 'left',
		};
		if (col.cell) {
			column.cellTemplate = Template(({ value, prop, model }: any) => {
				const rawValue = value;
				if (prop === 'agent_name') {
					console.log('column agent_name', typeof col.cell);
					console.log('model agent_name', model);
				} else if (prop === 'issued_date') {
					console.log('column issued_date', typeof col.cell);
					console.log('model issued_date', value);
				}
				let renderedValue: any;
				// try {
				// 	renderedValue = col.cell({ value: rawValue, row: model });
				// } catch (e) {
				// 	console.error('Render cell error:', e);
				// 	renderedValue = rawValue;
				// }

				// 🧩 PHÂN BIỆT KIỂU DỮ LIỆU
				// 1️⃣ Nếu là React element hoặc object JSX
				if (
					renderedValue &&
					typeof renderedValue === 'object' &&
					('$$typeof' in renderedValue || 'type' in renderedValue)
				) {
					const container = document.createElement('div');
					container.className = 'px-2 text-sm text-gray-800';
					// import('react-dom').then((ReactDOM) => {
					// 	ReactDOM.render(renderedValue, container);
					// });
					return container;
				}

				// 2️⃣ Nếu là HTMLElement (VD col.cell trả về <div> thủ công)
				if (renderedValue instanceof HTMLElement) {
					return renderedValue;
				}

				// 3️⃣ Nếu là string có HTML tags (VD: "<b>Hello</b>")
				if (
					typeof renderedValue === 'string' &&
					/<\/?[a-z][\s\S]*>/i.test(renderedValue)
				) {
					const container = document.createElement('div');
					container.className = 'px-2 text-sm text-gray-800';
					container.innerHTML = renderedValue;
					return container;
				}

				// 4️⃣ Mặc định: chỉ là text/number → render bình thường
				const el = document.createElement('div');
				el.className = 'px-2 text-sm text-gray-800';
				// el.textContent = String(renderedValue ?? rawValue ?? '');
				return el;
			});
		}

		return column;
	});
	const revogridRows = rows.map((row, index) => ({
		stt: index + 1,
		...row,
	}));

	return { columns: revogridColumns, rows: revogridRows };
}

// Optional helpers
function formatMoney(value?: number) {
	if (value == null) return '';
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(value);
}

function formatPhone(phone?: string) {
	if (!phone) return '';
	return `<a href="tel:${phone}" style="color:#2563eb">${phone}</a>`;
}

function formatDate(date?: string) {
	if (!date) return '';
	const d = new Date(date);
	return d.toLocaleDateString('vi-VN');
}
