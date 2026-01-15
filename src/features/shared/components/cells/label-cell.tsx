import { Chip, ChipProps } from '~/components/ui';
import { getChipColorClass } from '~/utils/tw-color';

type IProps = Omit<ChipProps, 'children' | 'ref'> & {
	active: boolean;
	activeLabel: string;
	inactiveLabel: string;
	activeColor?: ChipProps['color'];
	inactiveColor?: ChipProps['color'];
};

const LabelCell = (props: IProps) => {
	const {
		active,
		activeLabel,
		activeColor,
		inactiveLabel,
		inactiveColor,
		...rest
	} = props;
	return (
		<div className="flex w-full h-full items-center">
			<Chip
				size="sm"
				radius="sm"
				color={active ? activeColor || 'success' : inactiveColor || 'danger'}
				variant="bordered"
				{...rest}
			>
				{active ? activeLabel : inactiveLabel}
			</Chip>
		</div>
	);
};
LabelCell.displayName = 'LabelCell';

const LabelRevoCell = (h: any, { props }: any) => {
	const {
		active = false,
		activeLabel = 'Kích hoạt',
		inactiveLabel = 'Tạm dừng',
		activeColor = 'success',
		inactiveColor = 'danger',
	} = props || {};
	const label = active ? activeLabel : inactiveLabel;
	const color = active ? activeColor || 'success' : inactiveColor || 'danger';
	return h('div', { class: 'flex items-center justify-start w-full h-full' }, [
		h(
			'span',
			{
				class: `min-w-[70px] text-center inline-flex items-center justify-center text-[11px] font-medium px-2 py-0.5 rounded-md border ${getChipColorClass(
					color,
					'bordered',
				)}`,
			},
			label,
		),
	]);
};

export { LabelCell, LabelRevoCell };
