import type { FC } from 'react';
import {
	NoRowsOverlay,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui';

interface NoDataTableProps {
	columns: any[];
	message?: string;
	loading?: boolean;
}

const NoDataTable: FC<NoDataTableProps> = ({
	columns,
	message = 'Không có dữ liệu',
	loading = false,
}) => {
	return (
		<div className="w-full overflow-hidden rounded-lg border border-gray-200">
			<Table className="min-w-full divide-y divide-gray-200">
				<TableHeader className="bg-gray-50">
					<TableRow>
						{columns.map((col: any, index: number) => (
							<TableHead
								key={col.prop || col.accessorKey || col.id || col.name || index}
								className="px-6 py-3 text-left text-[13px] font-medium"
								style={{ width: col.size ? `${col.size}px` : 'auto' }}
							>
								{col.name || col.header || col.prop || ''}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody className="bg-white divide-y divide-gray-200">
					{loading ? (
						// Render 10 skeleton rows
						Array.from({ length: 10 }).map((_, rowIndex) => (
							<TableRow key={rowIndex}>
								{columns.map((col: any, colIndex: number) => (
									<TableCell key={colIndex} colSpan={columns.length}>
										<div className="h-6 bg-gray-200 rounded animate-pulse w-full" />
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						// Render No Data message
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="px-6 py-16 text-center"
							>
								<div className="w-full max-w-[100vw] sticky left-0 right-0 flex items-center justify-start pl-[calc(45vw-var(--sidebar-width))] h-[30vh]">
									<NoRowsOverlay title={message} className=" my-5 !w-70" />
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default NoDataTable;
