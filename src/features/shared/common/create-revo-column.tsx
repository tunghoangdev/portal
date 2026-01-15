import { createElement } from 'react';
import { cn } from '@heroui/react';
import { formatCurrency, formatDate, formatNumber } from '~/utils/formater';
export function createRevoColumn<T>(options: any) {
	const {
		title,
		key,
		type = 'text',
		sortable = true,
		hidden = false,
		align = 'left',
		className = '',
		width,
		minWidth,
		maxWidth,
		render,
		summary,
		actions,
		exportable,
		exportTitle,
		hiddenExport,
		customActions,
	} = options;

	if (hidden) return null;

	const prop = key;
	const name = title;

	// style alignment
	const alignClass =
		align === 'right'
			? 'justify-end text-right'
			: align === 'center'
				? 'justify-center text-center'
				: 'justify-start text-left';

	const baseClass = cn(
		'flex items-center h-full whitespace-normal w-full',
		alignClass,
		className,
	);

	// RevoGrid cellTemplate function
	const cellTemplate = render
		? (createElementFn: typeof createElement, props: any) =>
				createElementFn('div', { class: baseClass }, render(props.model))
		: (createElementFn: typeof createElement, props: any) => {
				const value = props.model[prop];
				let displayValue = value;
				switch (type) {
					case 'currency':
						displayValue = formatCurrency(value);
						break;
					case 'date':
						displayValue = formatDate(value);
						break;
					case 'total':
					case 'number':
						displayValue = formatNumber(value);
						break;
				}
				return createElementFn('div', { class: baseClass }, displayValue ?? '');
			};

	return {
		prop,
		name,
		size: width ?? 160,
		minSize: minWidth,
		maxSize: maxWidth,
		sortable,
		cellTemplate,
		meta: {
			align,
			summary,
			type,
			actions,
			exportable,
			exportTitle,
			hiddenExport,
			customActions,
		},
	};
}
