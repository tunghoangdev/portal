import { hIcon, Icons, IconStatic } from '~/components/icons';
import { Chip } from '~/components/ui';
const NOT_AVAILABLE = 'Chưa phát sinh';
const PENDING = 'Chờ ký';
const PENDING_APPROVE = 'Chờ duyệt/ký';
const PROCESSING = 'Chưa ký';
export const COMPLETED = 'Hoàn thành';
const statusContracts: any = {
	[PENDING]: {
		name: PENDING,
		color: 'warning',
		icon: <Icons.loader size={12} strokeWidth={1} />,
	},
	[PENDING_APPROVE]: {
		name: PENDING_APPROVE,
		color: 'info',
		icon: <Icons.loader size={12} strokeWidth={1} className="text-blue-500" />,
	},
	[PROCESSING]: {
		name: PROCESSING,
		color: 'secondary',
		icon: <Icons.loader size={12} strokeWidth={1} />,
	},
	[COMPLETED]: {
		name: COMPLETED,
		color: 'success',
		icon: <Icons.check size={12} strokeWidth={1} />,
	},
	[NOT_AVAILABLE]: {
		name: NOT_AVAILABLE,
		color: 'default',
		icon: <Icons.emptyData size={12} strokeWidth={1} />,
	},
};
interface Props {
	status: string;
	className?: string;
}
const StatusEcontractCell = ({ status, className }: Props) => {
	return (
		<Chip
			variant="bordered"
			size="sm"
			radius="sm"
			color={statusContracts?.[status]?.color}
			startContent={statusContracts?.[status]?.icon}
			className={className}
		>
			{statusContracts?.[status]?.name}
		</Chip>
	);
};
StatusEcontractCell.displayName = 'StatusEcontractCell';
const StatusEcontractRevoCell = (h: any, { props }: any) => {
	const status = props?.status ?? '';

	const statusContracts: Record<
		string,
		{ name: string; color: string; icon: any }
	> = {
		[PENDING]: {
			name: PENDING,
			color: 'text-warning-600 border-warning-600',
			icon: hIcon(IconStatic.loader, { size: 12, strokeWidth: 1 }),
		},
		[PENDING_APPROVE]: {
			name: PENDING_APPROVE,
			color: 'text-blue-500 border-blue-500',
			icon: hIcon(IconStatic.loader, {
				size: 12,
				strokeWidth: 1,
				className: 'text-blue-500',
			}),
		},
		[PROCESSING]: {
			name: PROCESSING,
			color: 'text-secondary border-secondary',
			icon: hIcon(IconStatic.loader, { size: 12, strokeWidth: 1 }),
		},
		[COMPLETED]: {
			name: COMPLETED,
			color: 'text-success border-success',
			icon: hIcon(IconStatic.check, { size: 12, strokeWidth: 1 }),
		},
		[NOT_AVAILABLE]: {
			name: NOT_AVAILABLE,
			color: 'text-default-700 border-default-600',
			icon: hIcon(IconStatic.emptyData, { size: 12, strokeWidth: 1 }),
		},
	};

	const variant = statusContracts[status] || {
		name: status || '-',
		color: 'text-default-500 border-default-300',
		icon: null,
	};

	return h('div', { class: 'flex items-center w-full h-full justify-start' }, [
		h(
			'div',
			{
				class: [
					'flex items-center gap-1 border rounded-md px-2 py-[2px] md:py-[3px]',
					'text-xs leading-[10px] md:leading-[12px]',
					'text-[#737373]',
					variant.color,
				].join(' '),
			},
			[variant.icon, h('span', {}, variant.name)],
		),
	]);
};

export { StatusEcontractCell, StatusEcontractRevoCell };
