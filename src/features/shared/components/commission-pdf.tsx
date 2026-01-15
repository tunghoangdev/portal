
import { Icons } from '~/components/icons';
import { ROLES } from '~/constant';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCommon, useFilter } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { formatNumber } from '~/utils/formater';
import { View, Text, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import { ExportPdfTable } from '~/features/shared/components';

const tw = createTw({});
// Các style và component của bạn giữ nguyên, không cần thay đổi
const billRowStyle = tw(
	'flex flex-row justify-between border-b border-gray-400',
);
const billRowStyleOdd = tw(
	'flex flex-row justify-between border-b border-gray-400 bg-[#f1f1f1]',
);
const billColumnWithRightBorderStyleWidthSmall = tw(
	'w-[15%] py-2 px-1 border-r border-gray-400',
);
const billColumnWithRightBorderStyle = tw(
	'flex-1 py-2 px-1 border-r border-gray-400',
);
const billColumnBaseStyle = tw('w-1/4 py-2 px-1');
const billLabel = tw('text-sm font-semibold');
const billSub = tw('text-sm font-light');
const billValueUppercase = tw('text-sm font-semibold uppercase');
const billValue = tw('text-sm');
const tableRowStyle = tw(
	'flex flex-row border-b border-gray-300 w-full justify-between',
);
const tableCellWithRightBorderStyleSmall = tw(
	'py-2 px-1 text-sm border-r border-gray-300 w-[15%]',
);
const tableCellWithRightBorderStyle =
	'py-2 px-1 text-xs border-r border-gray-300 flex-1';

const tableCellWithRightBorderStyleTotal = tw(
	'py-2 px-1 text-sm border-r border-gray-300 flex-1',
);
const tableCellStyle = tw('py-2 px-1 text-xs w-[15%] text-right');
const tableHeaderCellStyleSmall = tw(
	'py-2 px-1 text-xs leading-tight font-medium border-r border-gray-300 w-[15%] uppercase bg-gray-200',
);
const tableHeaderCellStyle =
	'py-2 px-1 text-xs leading-tight font-medium border-r border-gray-300 flex-1 uppercase bg-gray-200';
const tableHeaderLastCellStyle = tw(
	'py-2 px-1 text-xs leading-tight text-sm font-medium text-center w-[15%] uppercase bg-gray-200',
);
const colWidth15Percent = tw('w-[15%] py-2 px-1 text-right');
const colWidth20Percent = tw('w-[25%] py-2 px-1 border-r border-gray-400');
const InvoiceHeader = ({ data }: any) => (
	<View style={tw('flex flex-col items-center')}>
		<Text style={tw('text-xl leading-tight mb-1')}>Salary Slip For</Text>
		<Text style={tw('text-sm font-light mb-2.5')}>
			({`${data.from_date} - ${data.to_date}`})
		</Text>
	</View>
);

const InvoiceBillTo = ({ invoice }: any) => (
	<View style={tw('border border-b-0 border-gray-400')}>
		<View style={billRowStyle}>
			<View style={billColumnWithRightBorderStyleWidthSmall}>
				<Text style={billLabel}>Tên NV</Text>
				<Text style={billSub}>Emp.Name</Text>
			</View>
			<View style={billColumnWithRightBorderStyle}>
				<Text style={billValueUppercase}>{invoice.agent_name}</Text>
			</View>
			<View style={colWidth20Percent}>
				<Text style={billLabel}>Mã số thuế TNCN</Text>
				<Text style={billSub}>TaxPaper ID Number</Text>
			</View>
			<View style={colWidth15Percent}>
				<Text style={billValue}>{invoice.tax_no}</Text>
			</View>
		</View>
		<View style={billRowStyleOdd}>
			<View style={billColumnWithRightBorderStyleWidthSmall}>
				<Text style={billLabel}>Mã NV</Text>
				<Text style={billSub}>Emp.Code</Text>
			</View>
			<View style={billColumnWithRightBorderStyle}>
				<Text style={billValue}>{invoice.agent_phone}</Text>
			</View>
			<View style={colWidth20Percent}>
				<Text style={billLabel}>Khấu trừ quỹ dự phòng:</Text>
				<Text style={billSub}>Reserve fund deduction</Text>
			</View>
			<View style={colWidth15Percent}>
				<Text style={billValue}>
					{formatNumber(invoice.escrow_period_amount)}
				</Text>
			</View>
		</View>
		<View style={billRowStyle}>
			<View style={billColumnWithRightBorderStyleWidthSmall}>
				<Text style={billLabel}>Chức danh</Text>
				<Text style={billSub}>Title</Text>
			</View>
			<View style={billColumnWithRightBorderStyle}>
				<Text style={billValue}>{invoice.agent_level_code}</Text>
			</View>
			<View style={colWidth20Percent}>
				<Text style={billLabel}>Tổng quỹ dự phòng:</Text>
				<Text style={billSub}>Total reserve fund</Text>
			</View>
			<View style={colWidth15Percent}>
				<Text style={billValue}>{formatNumber(invoice.escrow_amount)}</Text>
			</View>
		</View>
		<View style={billRowStyleOdd}>
			<View style={billColumnWithRightBorderStyleWidthSmall}>
				<Text style={billLabel}>Số tài khoản</Text>
				<Text style={billSub}>Account Number</Text>
			</View>
			<View style={billColumnWithRightBorderStyle}>
				<Text style={billValue}>{invoice.bank_number}</Text>
			</View>
			<View style={colWidth20Percent}>
				<Text style={billLabel}>Hình thức thanh toán</Text>
				<Text style={billSub}>Payment Method</Text>
			</View>
			<View style={colWidth15Percent}>
				<Text style={billLabel}>Chuyển khoản</Text>
				<Text style={billSub}>Bank Transfer</Text>
			</View>
		</View>
		<View style={billRowStyle}>
			<View style={billColumnWithRightBorderStyleWidthSmall}>
				<Text style={billLabel}>Ngân hàng</Text>
				<Text style={billSub}>Bank Name</Text>
			</View>
			<View style={billColumnWithRightBorderStyle}>
				<Text style={billValue}>{invoice.bank_name}</Text>
			</View>
			<View style={colWidth20Percent}>
				<Text style={billLabel}>Tổng tiền thực nhận:</Text>
				<Text style={billSub}>Actual amount received</Text>
			</View>
			<View style={colWidth15Percent}>
				<Text style={billValue}>{formatNumber(invoice.total)}</Text>
			</View>
		</View>
	</View>
);

const InvoiceTableRow = ({ items, data }: any) => {
	const rows = items.map((item: any, index: number) => (
		<View style={tableRowStyle} key={index.toString()}>
			<Text style={tableCellWithRightBorderStyleSmall}>{item.period_name}</Text>
			<Text
				style={tw(
					`${tableCellWithRightBorderStyle.replace('flex-1', '')} w-[20%]`,
				)}
			>
				{item.number_contract}
			</Text>
			<Text style={tw(tableCellWithRightBorderStyle)}>{item.product_name}</Text>
			<Text style={tableCellStyle}>{formatNumber(item.amount)}</Text>
		</View>
	));

	return (
		<>
			{rows}
			<View style={tableRowStyle}>
				<Text style={tableCellWithRightBorderStyleTotal}>
					Tổng tiền trước thuế
				</Text>
				<Text
					style={tw(
						'w-[15%] text-right font-medium text-xs leading-tight p-1.5',
					)}
				>
					{formatNumber(data?.amount || 0)}
				</Text>
			</View>
			<View style={tableRowStyle}>
				<Text style={tableCellWithRightBorderStyleTotal}>Thuế TNCN</Text>
				<Text
					style={tw(
						'w-[15%] text-right font-medium text-xs leading-tight p-1.5',
					)}
				>
					-{formatNumber(data?.tax || 0)}
				</Text>
			</View>
			<View style={tableRowStyle}>
				<Text style={tableCellWithRightBorderStyleTotal}>
					Tổng tiền sau thuế
				</Text>
				<Text
					style={tw(
						'w-[15%] text-right font-medium text-xs leading-tight p-1.5',
					)}
				>
					{formatNumber((data?.amount || 0) - (data?.tax || 0))}
				</Text>
			</View>{' '}
			<View style={tableRowStyle}>
				<Text style={tableCellWithRightBorderStyleTotal}>
					Khấu trừ quỹ dự phòng
				</Text>
				<Text
					style={tw(
						'w-[15%] text-right font-medium text-xs leading-tight p-1.5',
					)}
				>
					-{formatNumber(data?.escrow_period_amount || 0)}
				</Text>
			</View>
			<View style={tableRowStyle}>
				<Text style={tableCellWithRightBorderStyleTotal}>Thực nhận</Text>
				<Text
					style={tw('w-[15%] text-right font-bold text-sm leading-tight p-1.5')}
				>
					{formatNumber(data?.total)}
				</Text>
			</View>
		</>
	);
};

const InvoiceItemsTable = ({ invoice }: any) => (
	<View style={tw('border border-gray-300 border-b-0')}>
		<View style={tableRowStyle}>
			<Text style={tableHeaderCellStyleSmall}>Kỳ tính thưởng</Text>
			<Text style={tw(`${tableHeaderCellStyle.replace('flex-1', '')} w-[20%]`)}>
				Số hợp đồng
			</Text>
			<Text style={tw(tableHeaderCellStyle)}>Nội dung</Text>
			<Text style={tableHeaderLastCellStyle}>Số tiền</Text>
		</View>
		<InvoiceTableRow items={invoice.list_detail} data={invoice} />
	</View>
);

const CommissionExportPdf = ({ data }: any) => (
	<ExportPdfTable title="Bảng thu nhập">
		<InvoiceHeader data={data} />
		<InvoiceBillTo invoice={data} />
		<View style={tw('mt-5 mb-1')}>
			<Text style={tw('text-lg leading-tight')}>Chi tiết</Text>
		</View>
		<InvoiceItemsTable invoice={data} />
		<View style={tw('mt-5')}>
			<Text style={tw('text-[10px] leading-tight underline text-default-600')}>
				Lưu ý:
			</Text>
			<Text
				style={tw(
					'text-[10px] leading-tight text-default-600 font-light my-1 ml-1',
				)}
			>
				- Thu nhập phát sinh từ ngày 1 - 15 của tháng sẽ được thanh toán trước
				ngày 25 hàng tháng
			</Text>
			<Text
				style={tw('text-[10px] leading-tight text-default-600 font-light ml-1')}
			>
				- Thu nhập phát sinh từ ngày 16 - cuối tháng sẽ được thanh toán trước
				ngày 10 tháng liền kề
			</Text>
		</View>
	</ExportPdfTable>
);

export const CommissionPdfView = ({ id }: { id: any }) => {
	const { dateRange, bonusPeriodName } = useFilter();
	const { getAll } = useCrud(
		[
			API_ENDPOINTS?.[ROLES.AGENT]?.commissionTable?.exportPdf,
			dateRange,
			bonusPeriodName,
			id,
		],
		{
			endpoint: ROLES.AGENT,
			period_name: bonusPeriodName || '',
			...dateRange,
			id,
		},
		{
			enabled: !!dateRange && !!id,
		},
	);
	const { data: allData, isFetching }: any = getAll();
	const isNoData = !allData || allData?.status === 0;

	if (isFetching) {
		return (
			<div className="text-center mt-3.5 text-sm">Đang tải dữ liệu...</div>
		);
	}

	if (isNoData && !isFetching) {
		return <div className="text-center mt-3.5 text-sm">Không có dữ liệu</div>;
	}

	return (
		<div className="flex flex-col items-center h-screen gap-y-2.5">
			<PDFDownloadLink
				document={<CommissionExportPdf data={{ ...allData, ...dateRange }} />}
				fileName={`Bang_ke_thu_nhap_${bonusPeriodName || 'thang'}.pdf`}
				className="inline-flex py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				{({ loading }) =>
					loading ? (
						'Đang tạo PDF...'
					) : (
						<>
							<Icons.download className="mr-2" /> Tải bảng kê thu nhập
						</>
					)
				}
			</PDFDownloadLink>
			{/* Sử dụng PDFViewer để hiển thị bản xem trước trực tiếp */}
			<PDFViewer className="w-full h-full" style={{ border: 'none' }}>
				<CommissionExportPdf data={{ ...allData, ...dateRange }} />
			</PDFViewer>
		</div>
	);
};
