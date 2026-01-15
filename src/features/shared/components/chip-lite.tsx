import { h } from '@revolist/react-datagrid';

export const ChipLite = (props: any) => {
	const {
		variant = 'solid',
		size = 'md',
		radius = 'md',
		color = 'default',
		startContent,
		className = '',
		children,
	} = props;

	// ✅ Map màu
	const colorMap: Record<string, string> = {
		default: 'border-default-300 bg-default-100 text-default-700',
		primary: 'border-primary-300 bg-primary-50 text-primary-600',
		success: 'border-success-300 bg-success-50 text-success-600',
		warning: 'border-warning-300 bg-warning-50 text-warning-600',
		danger: 'border-danger-300 bg-danger-50 text-danger-600',
	};

	// ✅ Map border variant
	const variantMap: Record<string, string> = {
		solid: '',
		bordered: 'bg-transparent border',
		flat: 'bg-opacity-20',
	};

	// ✅ Map size
	const sizeMap: Record<string, string> = {
		sm: 'text-xs px-2 py-[2px]',
		md: 'text-sm px-2.5 py-[3px]',
		lg: 'text-base px-3 py-1',
	};

	// ✅ Map radius
	const radiusMap: Record<string, string> = {
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		full: 'rounded-full',
	};

	return h(
		'div',
		{
			className: `flex items-center space-x-2 ${colorMap[color]} ${variantMap[variant]} ${sizeMap[size]} ${radiusMap[radius]} ${className}`,
		},
		[
			startContent &&
				h('span', { className: 'flex items-center' }, [startContent]),
			h('span', {}, children),
		],
	);
};
