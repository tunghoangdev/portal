export const twColorMap: Record<string, string> = {
	default: 'border-gray-300 text-gray-700 bg-gray-50',
	primary: 'border-primary text-primary bg-primary/50',
	success: 'border-success text-success bg-success/50',
	danger: 'border-danger text-danger bg-danger/50',
	warning: 'border-warning text-warning bg-warning/50',
	secondary: 'border-secondary text-secondary bg-secondary/50',
	info: 'border-cyan-500 text-cyan-600 bg-cyan-50',
};

export const getChipColorClass = (
	color?: string,
	variant: 'bordered' | 'solid' | 'flat' = 'bordered',
) => {
	const base = twColorMap[color || 'default'] || twColorMap.default;

	if (variant === 'solid') {
		return base
			.replace(/bg-[^\s]+/, (match) => match.replace('50', '500'))
			.replace(/text-[^\s]+/, 'text-white')
			.replace(/border-[^\s]+/, '');
	}

	if (variant === 'flat') {
		return base.replace(/border-[^\s]+/, 'border-transparent');
	}

	return base.replace(/bg-[^\s]+/, 'bg-transparent');
};
