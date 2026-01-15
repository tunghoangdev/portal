import {
	type Control,
	type FieldValues,
	type Path,
	useController,
	type UseFormReturn,
} from 'react-hook-form';
import { Input, type InputProps } from '~/components/ui';
import { Icons } from '~/components/icons';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud } from '~/hooks';
import { Alert } from '@heroui/react';
import { useEffect, useState, useMemo } from 'react';
import { UserCell } from '../cells';

interface FieldProps<TFormValues extends FieldValues>
	extends Omit<InputProps, 'name' | 'ref'> {
	name: string;
	control: Control<TFormValues>;
	formMethods?: any;
	isCheckOpen?: boolean;
	watchName?: string;
}

export function PhoneSearchField<TFormValues extends FieldValues>(
	props: FieldProps<TFormValues>,
) {
	const {
		name,
		control,
		formMethods,
		isRequired,
		label,
		// isCheckOpen, // Không thấy dùng trong logic hiện tại
		watchName = 'id_agent',
		...rest
	} = props;

	const { setValue, formState, setError, getValues, trigger, register } =
		formMethods || {};
	const { errors } = formState || {};

	const {
		field,
		fieldState: { error },
	} = useController({
		name: name as Path<TFormValues>,
		control,
	});

	const value = field.value;
	// ----------------------------------------------------
	// 1. Logic Đăng ký Field WATCH_NAME
	// Đảm bảo trường watchName luôn được đăng ký để RHF theo dõi.
	// ----------------------------------------------------
	useEffect(() => {
		if (register && watchName) {
			// Đăng ký field watchName vào form.
			register(watchName as Path<TFormValues>);
		}
	}, [register, watchName]);

	// ----------------------------------------------------
	// 2. Logic API Search (useCrud)
	// Chỉ kích hoạt search khi giá trị nhập vào hợp lệ và load lần đầu đã xong
	// ----------------------------------------------------
	const phoneValue = useMemo(() => {
		// Chỉ search khi giá trị nhập vào thay đổi và là chuỗi hợp lệ (dài hơn 8 ký tự)
		if (typeof value === 'string' && value.length > 8) {
			return value;
		}
		return '';
	}, [value]);
	const { getAll } = useCrud(
		[API_ENDPOINTS.agent.search.byPhone, phoneValue],
		{
			endpoint: '',
			agent_phone: phoneValue,
		},
		{
			enabled: !!phoneValue, // Chỉ bật khi phoneValue hợp lệ
			staleTime: 1,
		},
	);
	const { data, isFetched }: any = getAll();
	// const { content } = data || {}; // Không thấy content được dùng

	// ----------------------------------------------------
	// 3. Xử lý Chế độ Edit và Kết quả API
	// ----------------------------------------------------
	useEffect(() => {
		if (isFetched) {
			// BƯỚC B: XỬ LÝ KẾT QUẢ API (Sau khi nhập/Load xong)
			if (data?.id) {
				// API trả về kết quả thành công
				const newId = data.id.toString();
				// Set giá trị id_agent
				setValue?.(watchName as Path<TFormValues>, newId, {
					shouldDirty: true,
					shouldValidate: true,
				});
				trigger?.(name as Path<TFormValues>);
			} else if (!data?.id && phoneValue) {
				// Reset giá trị id_agent
				setValue?.(watchName as Path<TFormValues>, '' as any, {
					shouldDirty: true,
					shouldValidate: true,
				});

				// Set lỗi cho field phone
				setError?.(
					name as Path<TFormValues>,
					{
						type: 'manual',
						message: 'Số điện thoại không tồn tại',
					},
					{ shouldFocus: true },
				);
			}
		}
	}, [data]);
	// ----------------------------------------------------

	const displayLabel = (
		<div className="flex items-center">
			{label}
			{isRequired && label && <span className={'text-danger ml-1'}>*</span>}
		</div>
	) as any;

	return (
		<>
			<Input
				{...field}
				isInvalid={!!error || !!errors?.id_agent}
				errorMessage={
					error?.message || errors?.id_agent?.message?.toString() || ''
				}
				variant="bordered"
				labelPlacement="outside"
				label={displayLabel}
				classNames={{
					inputWrapper: 'border border-default-400 min-h-9 h-9 bg-white',
					label: 'text-black/90 top-[20px] font-medium',
					input: 'text-[13px] !shadow-none text-default-700',
				}}
				{...rest}
				startContent={<Icons.phone size={16} className="text-default-800" />}
			/>
			{/* Hiển thị Alert khi không tìm thấy và giá trị đã nhập đủ dài */}
			{isFetched && !data?.id && phoneValue ? (
				<Alert
					color="warning"
					title={'Không tìm thấy thành viên trong hệ thống!'}
					hideIconWrapper
					icon={<Icons.triangle size={16} />}
					classNames={{
						base: 'mt-2.5 p-1.5',
						title: 'text-xs',
						alertIcon: 'fill-transparent',
						iconWrapper: 'w-5',
						mainWrapper: 'm-0 ml-1.5',
					}}
					variant={'flat'}
				/>
			) : data?.id ? (
				// Hiển thị UserCell khi tìm thấy thành viên
				<div className="shadow-sm bg-success/5 rounded-md p-2 mt-2">
					<UserCell
						data={data}
						showLevel
						isLocked={!data?.is_open}
						levelCodeKey="agent_level_code"
						levelIdKey="id_agent_level"
					/>
				</div>
			) : null}
		</>
	);
}
