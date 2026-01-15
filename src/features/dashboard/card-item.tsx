
import { Icons } from '~/components/icons';
import {
	Card,
	CardFooter,
	CardHeader,
	Chip,
	Stack,
	Typography,
} from '~/components/ui';
import { cn } from '~/lib/utils';
import { formatNumber } from '~/utils/formater';

type Props = {
	total: number;
	title: string;
	isCurrency?: boolean;
	icon?: React.ReactNode;
	percent: number;
	description?: string;
	subDescription?: string;
	grow?: boolean;
	colors?: any;
};
const renderGrowthIcon = (grow: boolean, size?: number) => (
	<>
		{!grow ? (
			<Icons.trendingDown size={size || 12} className="text-red-500" />
		) : (
			<Icons.trendingUp size={size || 12} className="text-green-500" />
		)}
	</>
);
export default function CardItem({
	total,
	title,
	percent,
	colors,
	subDescription,
	grow,
}: Props) {
	return (
		<Card
			className="@container/card"
			classNames={{
				header: 'flex-col items-start gap-2',
				base: `shadow-sm bg-gradient-to-b from-white ${colors.bg}`,
			}}
		>
			<CardHeader>
				<Stack
					// direction={'row'}
					justifyContent={'between'}
					alignItems={'center'}
					className="w-full flex-col md:flex-row"
				>
					<Typography variant="body2r" className="text-[10px] md:text-xs">
						{title}
					</Typography>
					<Chip
						variant="bordered"
						// className="text-xs flex items-center w-auto max-w-auto"
						classNames={{
							content: 'flex items-center gap-1.5',
						}}
						size="sm"
					>
						{percent !== 0 && renderGrowthIcon(grow || false)}
						{`${grow ? '+' : ''}`}
						{percent}%
					</Chip>
				</Stack>
				<Typography className="text-sm md:text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
					{/* {isCurrency ? formatCurrency(total) : formatNumber(total)} */}
					{formatNumber(total)}
				</Typography>
			</CardHeader>
			<CardFooter className="flex-col items-start gap-1.5 text-xs md:text-sm">
				<div className={cn('line-clamp-1 flex gap-2 font-medium items-center')}>
					{`${grow ? 'Tăng lên' : percent === 0 ? 'Không thay đổi' : 'Giảm xuống'}`}{' '}
					{percent !== 0 && renderGrowthIcon(grow || false, 14)}
				</div>
				{subDescription && (
					<div className="text-default-700 text-xs">{subDescription}</div>
				)}
			</CardFooter>
		</Card>
	);
}
