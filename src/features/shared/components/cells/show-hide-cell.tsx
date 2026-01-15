import { hIcon, Icons, IconStatic } from '~/components/icons';
import { Stack } from '~/components/ui';

type IProps = {
	isShow: boolean;
};
const ShowHideCell = ({ isShow }: IProps) => (
	<Stack alignItems={'center'} className="gap-2 w-full">
		{isShow ? (
			<Icons.eye className="text-success" size={14} />
		) : (
			<Icons.eyeOff className="text-danger" size={14} />
		)}
	</Stack>
);

ShowHideCell.displayName = 'ShowHideCell';

const ShowHideRevoCell = (h: any, { props }: any) => {
	const isShow = props?.isShow ?? false;
	return h(
		'div',
		{
			class: 'flex items-center gap-2 w-full [&>span]:inline-flex',
		},
		isShow
			? hIcon(IconStatic.eye, {
					size: 14,
					className: 'text-success',
				})
			: hIcon(IconStatic.eyeOff, {
					size: 14,
					className: 'text-danger',
				}),
	);
};
export { ShowHideCell, ShowHideRevoCell };
