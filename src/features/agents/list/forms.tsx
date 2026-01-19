import React from 'react';
import { formFields } from './form.schema';
import { FormField } from '@/features/shared/components/form-fields';
import { Grid, MyImage, Typography } from '@/components/ui';
import { formatDate } from '@/utils/formater';
import { getFullFtpUrl } from '@/lib/auth';
type Props = {
	name: string;
	control: any;
	data?: any;
};
export default function FormActions({ name, control, data }: Props) {
	const field = formFields.find((field) => field.name === name);
	if (!field) return null;
	return (
		<>
			<Grid
				container
				spacing={4}
				className="shadow p-2.5 rounded-md shadow-gray-200"
			>
				<Grid item xs={6}>
					{/* <Typography
						variant="body2m"
						className="text-left text-sm mb-5 inline-flex uppercase"
					>
						CCCD mặt trước
					</Typography> */}
					{renderContent('', data?.link_front_id, true)}
				</Grid>
				<Grid item xs={6} className="self-center">
					<Typography
						variant="body2m"
						className="text-left text-sm mb-5 inline-flex uppercase"
					>
						CCCD mặt trước
					</Typography>
					{renderContent('Số CCCD', data?.id_number)}
					{renderContent(
						'Họ và tên',
						`${data?.agent_name} - ${data?.agent_phone}`,
					)}
					{renderContent('Ngày sinh', formatDate(data?.birthday))}
					{renderContent('Giới tính', data?.gender)}
					{renderContent('Địa chỉ', data?.full_address)}
					{/* <Typography
						variant="body2m"
						className="text-left text-sm mb-5 inline-flex uppercase"
					>
						CCCD mặt sau
					</Typography>
					{renderContent('Ngày cấp', formatDate(data?.issued_date))}
					{renderContent('', data?.link_back_id, true)} */}
				</Grid>
			</Grid>
			<Grid container spacing={4} className="shadow p-2.5 rounded-md">
				<Grid item xs={6}>
					{/* <Typography
						variant="body2m"
						className="text-left text-sm mb-2.5 inline-flex uppercase"
					>
						CCCD mặt sau
					</Typography> */}

					{renderContent('', data?.link_back_id, true)}
				</Grid>
				<Grid item xs={6} className="flex flex-col justify-between">
					<div>
						<Typography
							variant="body2m"
							className="text-left text-sm mb-5 inline-flex uppercase"
						>
							CCCD mặt sau
						</Typography>
						{renderContent('Ngày cấp', formatDate(data?.issued_date))}
					</div>
					<div className="mt-5 border-t border-gray-200 pt-2.5">
						<Typography
							variant="body2m"
							className="text-left text-sm mb-5 inline-flex uppercase"
						>
							Thông tin Ngân hàng
						</Typography>
						{renderContent('Số tài khoản', data?.bank_number)}
						{renderContent('Ngân hàng', data?.bank_name)}
						{renderContent('Họ và tên', data?.agent_name)}
					</div>
					{field?.extra ? (
						<field.extra
							control={control}
							name={name}
							{...field}
							label="TRẠNG THÁI"
						/>
					) : (
						<FormField {...field} control={control} />
					)}
				</Grid>
			</Grid>
			{/* <table>
				<thead>
					<tr>
						<th className="text-left p-1.5 text-sm">Thông tin Thành viên</th>
						<th className=" border-l border-gray-200 text-left p-1.5 text-sm">
							Thông tin CCCD
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="p-1.5" style={{ verticalAlign: 'top' }}>
							<ul>
								{renderContent('Họ và tên', data?.agent_name)}
								{renderContent('Số điện thoại', data?.agent_phone)}

								{renderContent('Giới tính', data?.gender)}
								{renderContent('Địa chỉ', data?.full_address)}
								{renderContent('Số tài khoản', data?.bank_number)}
								{renderContent('Ngân hàng', data?.bank_name)}
							</ul>
						</td>
						<td className="p-1.5 border-l border-gray-200">
							<ul>
								{renderContent('Số CCCD', data?.id_number)}
								{renderContent('Ngày cấp', formatDate(data?.issued_date))}
								{renderContent('Nơi cấp', data?.issued_place)}
							</ul>
						</td>
					</tr>
					<tr>
						<td className="text-center p-1.5">
							<p className="text-sm font-semibold mb-2.5">CCCD mặt trước</p>
							{renderContent('', data?.link_front_id, true)}
						</td>
						<td className="text-center p-1.5 border-l border-gray-200">
							<p className="text-sm font-semibold mb-2.5">CCCD mặt sau</p>
							{renderContent('', data?.link_back_id, true)}
						</td>
					</tr>
				</tbody>
			</table> */}
		</>
	);
}
function renderContent(label: string, value: any, isImg?: boolean) {
	const url = getFullFtpUrl('cccd', value);
	return (
		<li className="grid grid-cols-12 gap-y-1.5 mb-1.5 even:bg-amber-50">
			{label && <p className="col-span-3 text-xs font-semibold">{label}:</p>}
			<div className={label ? 'col-span-9' : 'col-span-12'}>
				{isImg ? (
					<div className="rounded-xl">
						<MyImage src={url} alt={label} width={500} height={350} />
					</div>
				) : (
					<p className="text-sm">{value}</p>
				)}
			</div>
		</li>
	);
}
