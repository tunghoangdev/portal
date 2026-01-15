import { hIcon, Icons, IconStatic } from '~/components/icons';
import { Stack } from '~/components/ui';
interface Props {
	is_main?: boolean;
	name: string;
}
const ProductCell = ({ is_main, name }: Props) => {
	return (
		<Stack alignItems={'center'} className="gap-x-2">
			{name}
			{is_main ? (
				<Icons.circleCheck className="text-success" size={16} />
			) : null}
		</Stack>
	);
};
ProductCell.displayName = 'ProductCell';

const ProductRevoCell = (h: any, { props }: any) => {
	const { is_main, name } = props || {};
	return h(
		'div',
		{
			class: {
				'flex items-center gap-x-2': true,
			},
		},
		[
			h('span', {}, name ?? ''),
			is_main
				? hIcon(IconStatic.circleCheck, { size: 16, className: 'text-success' })
				: null,
		],
	);
};
export { ProductCell, ProductRevoCell };
