import { hIcon, Icons, IconStatic } from '~/components/icons';
import { Chip } from '~/components/ui';
import { cn } from '~/lib/utils';
type StatusColumnProps = {
	id: number;
	name: string;
	selector?: string;
	className?: string;
	isNoneLife?: boolean;
};

const statusVariants: any = {
	1: {
		color: 'text-warning-600 border-warning-600',
		icon: (
			<Icons.loader size={12} strokeWidth={1} className="text-warning-600" />
		),
	},
	2: {
		color: 'text-blue-500 border-blue-500',
		icon: (
			<Icons.circleCheck
				size={14}
				className="text-blue-500 fill-blue-500 stroke-white"
			/>
		),
	},
	3: {
		color: 'text-secondary border-secondary',
		icon: (
			<Icons.circleCheck size={12} strokeWidth={1} className="text-secondary" />
		),
	},
	4: {
		color: 'text-success border-success',
		icon: (
			<Icons.calendarCheck
				size={14}
				strokeWidth={1.5}
				className="text-success"
			/>
		),
	},
};

const statusNoneLifeVariants: any = {
	1: {
		color: 'text-warning-600 border-warning-600',
		icon: (
			<Icons.loader size={12} strokeWidth={1} className="text-warning-600" />
		),
	},
	2: {
		color: 'text-secondary border-secondary',
		icon: (
			<Icons.circleCheck size={12} strokeWidth={1} className="text-secondary" />
		),
	},
	3: {
		color: 'text-success border-success',
		icon: (
			<Icons.calendarCheck
				size={14}
				strokeWidth={1.5}
				className="text-success"
			/>
		),
	},
};

const StatusCell = (props: StatusColumnProps) => {
	const { id, name, className, isNoneLife } = props;
	const newVariants = isNoneLife ? statusNoneLifeVariants : statusVariants;
	return (
		<Chip
			size="sm"
			//   radius="md"
			className={cn(
				'text-xs border font-semibold text-[#737373]',
				newVariants?.[id]?.color,
				className,
			)}
			variant="bordered"
			startContent={newVariants?.[id]?.icon}
		>
			{name}
		</Chip>
	);
};
StatusCell.displayName = 'StatusCell';

const StatusRevoCell = (h: any, { props }: any) => {
	const { id, name, isNoneLife } = props;
	// ===== VARIANTS =====
	const statusVariants = {
		1: {
			color: 'text-warning-600 border-warning-600',
			icon: hIcon(IconStatic.loader, {
				size: 12,
				strokeWidth: 1,
				className: 'text-warning-600',
			}),
		},
		2: {
			color: 'text-blue-500 border-blue-500',
			icon: hIcon(IconStatic.circleCheck, {
				size: 14,
				strokeWidth: 1.5,
				className: 'text-blue-500',
			}),
		},
		3: {
			color: 'text-secondary border-secondary',
			icon: hIcon(IconStatic.circleCheck, {
				size: 12,
				strokeWidth: 1,
				className: 'text-secondary',
			}),
		},
		4: {
			color: 'text-success border-success',
			icon: hIcon(IconStatic.circleCheck, {
				size: 14,
				strokeWidth: 1.5,
				className: 'text-success',
			}),
		},
	};

	const statusNoneLifeVariants = {
		1: {
			color: 'text-warning-600 border-warning-600',
			icon: hIcon(IconStatic.loader, {
				size: 12,
				strokeWidth: 1,
				className: 'text-warning-600',
			}),
		},
		2: {
			color: 'text-secondary border-secondary',
			icon: hIcon(IconStatic.circleCheck, {
				size: 12,
				strokeWidth: 1,
				className: 'text-secondary',
			}),
		},
		3: {
			color: 'text-success border-success',
			icon: hIcon(IconStatic.circleCheck, {
				size: 14,
				strokeWidth: 1.5,
				className: 'text-success',
			}),
		},
	};

	const newVariants: any = isNoneLife ? statusNoneLifeVariants : statusVariants;
	const variant = newVariants[id] || {
		color: 'text-default-600 border-default-300',
		icon: null,
	};

	return h(
		'div',
		{
			class: [
				'flex items-center gap-1 border rounded-md px-2 py-[2px] md:py-[3px] leading-[10px] md:leading-[12px]',
				variant.color,
			].join(' '),
		},
		[
			variant.icon,
			h(
				'span',
				{
					class: 'text-xs',
				},
				name || '',
			),
		],
	);
};
export { StatusCell, StatusRevoCell };
