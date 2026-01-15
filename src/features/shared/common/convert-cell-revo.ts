import {
	ImageRevoCell,
	LabelRevoCell,
	LevelRevoCell,
	UserRevoCell,
	RowActionRevoCell,
	StatusAgentRevoCell,
	StatusRevoCell,
	StatusEcontractRevoCell,
	FileDownloadRevoCell,
	HotRevoCell,
	ShowHideRevoCell,
	ProductRevoCell,
	ProviderRevoCell,
	HistoryActionRevoCell,
	PermissionRevoCell,
	EventDateRevoCell,
	ContentRevoCell,
	ActiveStatusRevoCell,
	LifeTypeRevoCell,
} from '~/features/shared/components/cells';
import { formatCurrency, formatDate, formatNumber } from '~/utils/formater';

const RENDERER_MAP: Record<string, any> = {
	UserCell: UserRevoCell,
	LabelCell: LabelRevoCell,
	ImageCell: ImageRevoCell,
	LevelCell: LevelRevoCell,
	RowActionsCell: RowActionRevoCell,
	StatusAgentCell: StatusAgentRevoCell,
	StatusCell: StatusRevoCell,
	StatusEcontractCell: StatusEcontractRevoCell,
	FileDowloadCell: FileDownloadRevoCell,
	HotCell: HotRevoCell,
	ShowHideCell: ShowHideRevoCell,
	ProductCell: ProductRevoCell,
	ProviderCell: ProviderRevoCell,
	HistoryActionCell: HistoryActionRevoCell,
	PermissionCell: PermissionRevoCell,
	EventDateCell: EventDateRevoCell,
	ContentCell: ContentRevoCell,
	ActiveStatusCell: ActiveStatusRevoCell,
	LifeTypeCell: LifeTypeRevoCell,
};

// ✅ render cell từ TanStack sang RevoGrid
function renderRevoCell(
	h: any,
	rendered: { props: any; type: any },
	model: any,
) {
	if (!rendered?.props) return rendered;
	const { data, ...componentProps } = rendered.props;
	const compName = rendered.type?.displayName || rendered.type?.name || '';
	const Renderer = RENDERER_MAP[compName];
	if (!Renderer) return null;
	return Renderer(h, { model, props: componentProps });
}

// ✅ tạo cell template dùng được cho mọi cột RevoGrid
export function makeRevoCellTemplate(options: {
	type?: string;
	render?: (row: any) => any;
}) {
	const { type, render } = options;
	return (h: any, props: any) => {
		// Safety check: if no props, return empty cell
		if (!props) return h('div', {}, '');

		const { model, value, prop, type: cellType, rowIndex, column } = props;
		if (prop === 'stt' && cellType !== 'rowPinEnd')
			return h(
				'div',
				{ class: 'font-medium text-center w-full' },
				rowIndex + 1,
			);
		if (cellType === 'rowPinEnd') {
			if (column.lastPinStart) {
				return h(
					'div',
					{ class: 'font-semibold text-right w-full pr-2.5' },
					prop === 'stt' ? 'Tổng:' : (value ?? ''),
				);
			}
			if (!column?.meta?.summary)
				return h('div', { class: 'font-semibold' }, '');
			if (['number', 'currency', 'total'].includes(type || '')) {
				return h(
					'div',
					{ class: 'text-right font-semibold text-default-800' },
					formatNumber(value),
				);
			}
			return h('div', { class: 'font-semibold' }, value ?? '');
		}

		if (!render && !type)
			return h('div', { class: 'line-clamp-2' }, value ?? '');

		// ✅ Nếu là cell render custom từ TanStack Table
		if (render) return renderRevoCell(h, render(model), model);

		// ✅ Các kiểu cell mặc định
		switch (type) {
			case 'currency':
				return h('div', { class: 'w-full text-right' }, formatCurrency(value));
			case 'date':
				return h(
					'div',
					{ class: 'text-xs text-content2' },
					value ? formatDate(value) : '',
				);
			case 'number':
			case 'total':
				return h('div', { class: 'w-full' }, formatNumber(value));
			default:
				return h(
					'div',
					{ class: 'whitespace-normal line-clamp-2' },
					value ?? '',
				);
		}
	};
}
