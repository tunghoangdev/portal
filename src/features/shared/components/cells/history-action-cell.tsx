type IProps = {
	name: string;
};
const HistoryActionCell = ({ name }: IProps) => (
	<span className="text-secondary text-xs font-medium flex items-center justify-center">
		{name}
	</span>
);

HistoryActionCell.displayName = 'HistoryActionCell';

const HistoryActionRevoCell = (h: any, { props }: any) => {
	const { name } = props || '';
	return h(
		'div',
		{
			class:
				'text-secondary text-xs font-medium flex items-center justify-center',
		},
		name,
	);
};
export { HistoryActionCell, HistoryActionRevoCell };
