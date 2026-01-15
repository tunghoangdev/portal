import { hIcon, Icons, IconStatic } from '~/components/icons';
import { Stack } from '~/components/ui';

type IProps = {
	active: boolean;
};
const ActiveStatusCell = ({ active }: IProps) => (
	<Stack alignItems={'center'} className="gap-2 w-full">
		{active ? (
			<Icons.circleCheck className="text-success" size={14} />
		) : (
			<Icons.closeCircle className="text-danger" size={14} />
		)}
	</Stack>
);

ActiveStatusCell.displayName = 'ActiveStatusCell';

const ActiveStatusRevoCell = (h: any, { props }: any) => {
	const isShow = props?.active ?? false;
	return h(
		'div',
		{
			class: 'flex items-center gap-2 w-full [&>span]:inline-flex',
		},
		isShow
			? hIcon(IconStatic.circleCheck, {
					size: 14,
					className: 'text-success',
				})
			: hIcon(IconStatic.closeCircle, {
					size: 14,
					className: 'text-danger',
				}),
	);
};
export { ActiveStatusCell, ActiveStatusRevoCell };
