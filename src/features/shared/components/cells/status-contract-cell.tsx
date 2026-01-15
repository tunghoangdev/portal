import { Icons } from '~/components/icons';
import { Chip } from '~/components/ui';
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
};

interface StatusColumnProps {
	status: string;
}
export function StatusContractCell({ status }: StatusColumnProps) {
	return (
		<Chip
			variant="bordered"
			size="sm"
			radius="sm"
			color={statusContracts?.[status]?.color}
			startContent={statusContracts?.[status]?.icon}
		>
			{statusContracts?.[status]?.name}
		</Chip>
	);
}
