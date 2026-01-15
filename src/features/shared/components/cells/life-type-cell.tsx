import { Chip } from '~/components/ui';
interface LifeTypeCellProps {
	id: number;
	name: string;
	selector?: string;
	className?: string;
}

const lifeTypeVariants: any = {
	1: {
		color: 'success',
		textColor: 'text-success',
		// cls: 'bg-success-600/10 text-success-600',
	},
	2: {
		color: 'primary',
		textColor: 'text-primary',
		// cls: 'bg-primary-100',
	},
	3: {
		color: 'warning',
		textColor: 'text-warning',
		// cls: 'bg-primary-100',
	},
	4: {
		color: 'secondary',
		textColor: 'text-secondary',
		// cls: 'bg-primary-100',
	},
};
const LifeTypeCell = ({ id, name, className }: LifeTypeCellProps) => {
	return (
		<Chip
			size="sm"
			radius="sm"
			variant="bordered"
			color={lifeTypeVariants?.[id]?.color}
		>
			{name}
		</Chip>
	);
};
LifeTypeCell.displayName = 'LifeTypeCell';

const LifeTypeRevoCell = (h: any, { props }: any) => {
	const { id, name } = props;

	return h(
		'div',
		{
			class: [
				'flex items-center gap-1 border rounded-md px-2 py-[2px] md:py-[3px] leading-[10px] md:leading-[12px]',
				lifeTypeVariants?.[id]?.textColor,
			].join(' '),
		},
		[
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
export { LifeTypeCell, LifeTypeRevoCell };
