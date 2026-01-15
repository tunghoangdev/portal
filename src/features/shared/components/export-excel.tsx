import { FC, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { Button, Input } from '~/components/ui';
import { useCrud } from '~/hooks/use-crud-v2';
import { useFilter } from '~/hooks';
import { exportToExcel } from '~/utils/export';
import { toast } from 'sonner';
import { useFormModalStore } from '~/stores';
import { useAuth } from '~/hooks/use-auth';
export interface IProps {
	columns: any[];
}
export const ExportExcel: FC<IProps> = ({ columns }) => {
	const [filter, setFilter] = useState<any>();
	const { user } = useAuth();
	const { queryParamsState, queryKeyState, itemId, logUrl, provider_code, contract_type } = useFilter();
	const { closeModal } = useFormModalStore();
	const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
	// const { getAll: getReportingPeriod } = useCrud(
	// 	['reporting_period/get', selectedReport],
	// 	{
	// 		endpoint: 'system',
	// 		id: +selectedReport,
	// 	},
	// 	{
	// 		enabled: !!selectedReport && !!enableFilters?.rangeFilter,
	// 		staleTime: 1,
	// 	},
	// );

	const isLog = useMemo(
		() => columns.some((col) => col.prop === 'action_staff'),
		[columns],
	);

	const finalQueryKey = useMemo(() => {
		const baseKey = queryKeyState || [];
		if (logUrl) {
			const newKey = [...baseKey];
			// newKey[0] = newKey[0].replace("list", "log_list");
			newKey[0] = logUrl;
			return [...newKey, 'export-excel'];
		}
		return [...baseKey, 'export-excel'];
	}, [queryKeyState, logUrl]);

	const { getAll } = useCrud(finalQueryKey, filter, {
		enabled: false,
		staleTime: 1,
	});

	const { data, isFetching, refetch }: any = getAll();
	// const { data: periodData }: any = getReportingPeriod();
	const [fileName, setFileName] = useState<string>(`Export-${currentDate}`);

	useEffect(() => {
		// if (queryParamsState) {
		// 	if (isLog) {
		// 		setFilter({
		// 			id: itemId,
		// 			info: queryParamsState.info || '',
		// 			endpoint: queryParamsState.endpoint || role || '',
		// 			page_size: 1000000,
		// 		});
		// 	} else {
		// 		setFilter({
		// 			...queryParamsState,
		// 			page_size: 1000000,
		// 		});
		// 	}
		// }
		if (logUrl) {
			let filterData: any = {
				id: itemId,
				id_agent: user?.id,
				info: '',
				page_num: 1,
				page_size: 1000000,
				endpoint: '',
			}
			if(logUrl.includes('detail') && queryKeyState){	 // export detail
				filterData = {
					...queryParamsState,
					...filterData,
				}
			}
			if(provider_code !== undefined){
				filterData.provider_code = provider_code;
			}
			if(contract_type !== undefined){
				filterData.contract_type = contract_type;
			}
			setFilter(filterData);
		} else if (queryParamsState) {
			
			setFilter({
				...queryParamsState,
				page_size: 1000000,
			});
		}
	}, [queryParamsState, isLog]);

	// useEffect(() => {
	// 	if (reportList?.length) {
	// 		const periods = reportList?.find((report: any) => report.id === 30);
	// 		setSelectedReport(periods?.id?.toString());
	// 	}
	// }, [reportList]);

	// useEffect(() => {
	// 	if (periodData) {
	// 		const [period_start, period_end] = periodData.split('-');
	// 		setFilter({
	// 			...filter,
	// 			from_date: formatDate(period_start),
	// 			to_date: formatDate(period_end),
	// 		});
	// 	}
	// }, [periodData]);

	const [isExporting, setIsExporting] = useState(false);

	useEffect(() => {
		if (!isExporting || isFetching) return;
		const exportData = Array.isArray(data) ? data : data?.list || [];
		if (!exportData || exportData.length === 0) {
			toast.error('Không có dữ liệu để xuất file');
			setIsExporting(false);
			return;
		}
		exportToExcel(exportData, columns, fileName);
		toast.success('Tải file thành công');
		setIsExporting(false);
		closeModal();
	}, [data, isFetching, isExporting]);

	const handleExportFile = async () => {
		if (fileName) {
			setIsExporting(true);
			refetch();
		}
	};

	return (
		<div className="flex items-center justify-center gap-2 py-5">
			<Input
				name="fileName"
				placeholder="Nhập tên file"
				type="text"
				value={fileName}
				onChange={(e) => setFileName(e.target.value)}
			/>
			<Button
				onPress={handleExportFile}
				isDisabled={isFetching || !fileName}
				isLoading={isFetching}
				color="secondary"
				className="h-9"
			>
				Tải file
			</Button>
		</div>
	);
};
