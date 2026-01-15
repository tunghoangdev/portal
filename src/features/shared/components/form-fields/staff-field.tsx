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
import { useEffect } from 'react';
import { UserCell } from '../cells';
interface FieldProps<TFormValues extends FieldValues>
	extends Omit<InputProps, 'name' | 'ref'> {
	name: string;
	control: Control<TFormValues>;
	formMethods?: UseFormReturn<TFormValues>;
	isCheckOpen?: boolean;
	watchName?: string;
}

export function StaffField<TFormValues extends FieldValues>(
	props: FieldProps<TFormValues>,
) {
	const {
		name,
		control,
		formMethods,
		isRequired,
		label,
		isCheckOpen,
		watchName = 'id_agent',
		...rest
	} = props;
	const displayLabel = (
		<div className="flex items-center">
			{label}
			{isRequired && label && <span className={'text-danger ml-1'}>*</span>}
		</div>
	) as any;
	const { setValue, formState, setError } = formMethods || {};
	const { errors } = formState || {};
	const {
		field,
		fieldState: { error, isDirty },
	} = useController({
		name: name as Path<TFormValues>,
		control,
	});

	const value = field.value;
	const { getAll } = useCrud(
		[API_ENDPOINTS.agent.search.byStaffCode, value],
		{
			endpoint: '',
			staff_code: value,
		},
		{
			enabled: !!value && value?.length === 4,
			staleTime: 1,
		},
	);
	const { data }: any = getAll();
	const { content } = data || {};
	useEffect(() => {
		if (control?._formValues?.[name]?.length === 4 && !isDirty) {
			// on update
			setValue?.(name as Path<TFormValues>, control?._formValues?.[name], {
				shouldDirty: true,
				shouldValidate: true,
			});
		}

		if (data?.id) {
			setValue?.(watchName as Path<TFormValues>, data.id.toString(), {
				shouldDirty: true,
				shouldValidate: true,
			});
		} else if (!content && value) {
			// @ts-ignore
			setValue?.(watchName as Path<TFormValues>, '', {
				shouldDirty: true,
				shouldValidate: true,
			});
			setError?.(
				name as Path<TFormValues>,
				{
					type: 'manual',
					message: 'Mã số nhân viên không tồn tại',
				},
				{
					shouldFocus: true,
				},
			);
			// trigger?.(["id_agent" as Path<TFormValues>, name as Path<TFormValues>]);
		}
	}, [data, value, setValue, watchName]);
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
				// startContent={<Icons.phone size={16} className="text-default-800" />}
			/>
			{data?.status === 1 && !content ? (
				<Alert
					color="warning"
					title={'Không tìm thấy nhân viên trong hệ thống!'}
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
			) : data ? (
				<div className="shadow-sm bg-success/5 rounded-md p-2 mt-2">
					<UserCell
						data={data}
						phoneKey="staff_phone"
						nameKey="staff_name"
						avatarKey="staff_avatar"
						// showLevel
						// isLocked={!data?.is_open}
						// levelCodeKey="agent_level_code"
						// levelIdKey="id_agent_level"
					/>
				</div>
			) : null}
		</>
	);
}
