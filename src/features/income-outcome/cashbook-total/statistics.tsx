import { Icons } from '~/components/icons';
import { Card, CardBody, Grid } from '~/components/ui';
import { cn } from '~/lib/utils';
import { formatNumber } from '~/utils/formater';
const CardStats = ({ title, value, icon, color, bg }: any) => {
	return (
		<div
			className={`relative overflow-hidden rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${bg}`}
		>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
					<p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
				</div>

				<div
					className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} bg-opacity-10 "transition-transform duration-300 ease-out group-hover:scale-125`}
				>
					{icon}
				</div>
			</div>

			{/* Gradient line */}
			<div
				className={`absolute bottom-0 left-0 h-1 w-full ${color} opacity-60`}
			/>
		</div>
	);
};

const StatsVertical = ({
	icon,
	color,
	stats,
	statTitle,
	className,
	textColor = '',
}: any) => {
	return (
		<Card
			className={cn(
				'group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-none shadow-md bg-white dark:bg-gray-900',
				className,
			)}
		>
			<CardBody className="flex flex-col items-center justify-center p-6 gap-2">
				<div
					className={cn(
						'flex items-center justify-center rounded-2xl mb-2 transition-transform group-hover:scale-110 [&>svg]:text-primary [&>svg]:stroke-primary gap-x-1.5',
						// color || "bg-primary/10"
					)}
				>
					{icon}
					<p className="text-lg font-medium text-primary uppercase tracking-wider">
						{statTitle}
					</p>
				</div>
				<div className="text-center space-y-1">
					<h2 className={cn('text-2xl font-bold tracking-tight', textColor)}>
						{stats}
					</h2>
				</div>
			</CardBody>
		</Card>
	);
};
const iconConfig = {
	size: 22,
	strokeWidth: 1,
};
const CashbookTotalStatistics = ({ data = {} }: any) => {
	const {
		ocash_before_sum = 0,
		ocash_after_sum = 0,
		ocash_income_sum = 0,
		ocash_outcome_sum = 0,
	} = data;
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
			<CardStats
				title="Quỹ đầu kỳ"
				value={ocash_before_sum ? formatNumber(ocash_before_sum) : 0}
				icon={<Icons.wallet {...iconConfig} />}
				color="text-secondary"
				bg="bg-white"
			/>

			<CardStats
				title="Tổng thu"
				value={ocash_income_sum ? formatNumber(ocash_income_sum) : 0}
				icon={<Icons.trendingUp {...iconConfig} />}
				color="text-emerald-600"
				bg="bg-white"
			/>

			<CardStats
				title="Tổng chi"
				value={ocash_outcome_sum ? formatNumber(ocash_outcome_sum) : 0}
				icon={<Icons.trendingDown {...iconConfig} />}
				color="text-rose-600"
				bg="bg-white"
			/>

			<CardStats
				title="Tồn quỹ"
				value={ocash_after_sum ? formatNumber(ocash_after_sum) : 0}
				icon={<Icons.database {...iconConfig} />}
				color="text-primary"
				bg="bg-white"
			/>
		</div>
	);
	// return (
	// 	<Grid container spacing={6}>
	// 		<Grid xl={3} sm={6} item>
	// 			<StatsVertical
	// 				icon={
	// 					<Icons.dollarSign
	// 						size={iconConfig.size}
	// 						strokeWidth={iconConfig.strokeWidth}
	// 						className="text-secondary"
	// 					/>
	// 				}
	// 				color="bg-secondary/10"
	// 				textColor="text-secondary"
	// 				stats={ocash_before_sum ? formatNumber(ocash_before_sum) : 0}
	// 				statTitle="Quỹ đầu kỳ"
	// 			/>
	// 		</Grid>
	// 		<Grid xl={3} sm={6} item>
	// 			<StatsVertical
	// 				icon={
	// 					<Icons.addCircle
	// 						size={iconConfig.size}
	// 						strokeWidth={iconConfig.strokeWidth}
	// 						className="text-success"
	// 					/>
	// 				}
	// 				color="bg-success/10"
	// 				textColor="text-success"
	// 				stats={ocash_income_sum ? formatNumber(ocash_income_sum) : 0}
	// 				statTitle="Tổng thu"
	// 			/>
	// 		</Grid>
	// 		<Grid xl={3} sm={6} item>
	// 			<StatsVertical
	// 				icon={
	// 					<Icons.minusCircle
	// 						size={iconConfig.size}
	// 						strokeWidth={iconConfig.strokeWidth}
	// 						className="text-danger"
	// 					/>
	// 				}
	// 				color="bg-danger/10"
	// 				textColor="text-danger"
	// 				stats={ocash_outcome_sum ? formatNumber(ocash_outcome_sum) : 0}
	// 				statTitle="Tổng chi"
	// 			/>
	// 		</Grid>
	// 		<Grid xl={3} sm={6} item>
	// 			<StatsVertical
	// 				icon={
	// 					<Icons.database
	// 						size={iconConfig.size}
	// 						strokeWidth={iconConfig.strokeWidth}
	// 						className="text-[var(--color-info)]"
	// 					/>
	// 				}
	// 				color="bg-[var(--color-info)]/10"
	// 				textColor="text-[var(--color-info)]"
	// 				stats={ocash_after_sum ? formatNumber(ocash_after_sum) : 0}
	// 				statTitle="Tồn quỹ"
	// 			/>
	// 		</Grid>
	// 	</Grid>
	// );
};

export default CashbookTotalStatistics;
