import { getEventStatus } from '~/utils/formater';
import { Chip } from '@heroui/react';

type IProps = {
	startDate: string | Date;
	type?: string;
};
const STATUS_COLORS: Record<string, string> = {
	'danger': 'border-danger text-danger',
	'success': 'border-success text-success',
	'secondary': 'border-secondary text-secondary',
}
const EventDateCell = (props: IProps) => {
	const { startDate, type } = props;
	const date = getEventStatus(startDate).formattedDate
		? getEventStatus(startDate).formattedDate?.split(',')
	: [];
	if(type === 'status'){
		return (
			<Chip
				color={getEventStatus(startDate).color as any}
				size="sm"
				variant="bordered"
				radius="sm"
			>
				{getEventStatus(startDate).status}
			</Chip>
		)
	}
	return (
		<>
			{date?.length ? (
				<div className="text-blue-700 font-medium text-[11px]">
					<div className="text-primary">
						{date[0]}, Lúc: {date[1]}, Ngày: {date[2]}
					</div>
				</div>
			) : (
				<Chip
					color={getEventStatus(startDate).color as any}
					size="sm"
					variant="bordered"
					radius="sm"
				>
					{getEventStatus(startDate).status}
				</Chip>
			)}
		</>
	);
};
EventDateCell.displayName = 'EventDateCell';

const EventDateRevoCell = (h: any, { props }: any) => {
	const { startDate, type } = props;
	const date = getEventStatus(startDate).formattedDate
		? getEventStatus(startDate).formattedDate?.split(',')
		: [];
	const eventStatus = getEventStatus(startDate);
	if(type === 'status'){
		return h(
			'div',
			{
				class: `inline-flex items-center justify-center border rounded-sm px-2 py-[1px] text-[11px] font-medium ${STATUS_COLORS[eventStatus?.color || 'secondary']}`,
			},
			eventStatus.status,
		);
	}
	if (date?.length) {
		return h(
			'div',
			{
				class: 'flex flex-col text-blue-700 font-medium text-[11px]',
			},
			[
				h(
					'div',
					{
						class: 'text-primary',
					},
					`${date[0]}, Lúc: ${date[1]}, Ngày: ${date[2]}`,
				),
			],
		);
	}
	return h(
		'div',
		{
			class: `inline-flex items-center justify-center border rounded-sm px-2 py-[1px] text-[11px] font-medium border-${eventStatus.color} text-${eventStatus.color}`,
		},
		eventStatus.status,
	);
};

export { EventDateCell, EventDateRevoCell };
