import {
	type Control,
	type FieldValues,
	type Path,
	useController,
	type UseFormReturn,
} from 'react-hook-form';
import { Button, Input, Stack, type InputProps } from '~/components/ui';
import { Icons } from '~/components/icons';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud, useSwal } from '~/hooks';
import { ROLES } from '~/constant';
import { useEffect, useState } from 'react';
interface FieldProps<TFormValues extends FieldValues>
	extends Omit<InputProps, 'name' | 'ref'> {
	name: string;
	control: Control<TFormValues>;
	formMethods?: UseFormReturn<TFormValues>;
	isCheckOpen?: boolean;
	defaultValues?: any;
	isRequired?: boolean;
	label?: string;
	isDisabled?: boolean;
}

export function ContractNumberField<TFormValues extends FieldValues>(
	props: FieldProps<TFormValues>,
) {
	const { confirm } = useSwal();
	const {
		name,
		control,
		formMethods,
		isRequired,
		label,
		isCheckOpen,
		defaultValues,
		isDisabled,
		...rest
	} = props;
	const displayLabel = (
		<>
			{label}
			{isRequired && label && <span className={'text-danger ml-1'}>*</span>}
		</>
	);
	const { reset } = formMethods || {};
	const { id_life_provider, id_life_type } = control._formValues;
	const [loading, setLoading] = useState(false);
	// const [isDisabled, setDisabled] = useState(false);
	const {
		field,
		fieldState: { error },
	} = useController({
		name: name as Path<TFormValues>,
		control,
	});

	const { value } = field;
	const queryKey = [
		API_ENDPOINTS[ROLES.AGENT].lifeInsurance.processing.search,
		value,
	];
	const { getAll } = useCrud(
		queryKey,
		{
			endpoint: '',
			number_contract: value,
			id_life_provider,
		},
		{
			enabled: !!value && loading,
			staleTime: 1,
		},
	);
	const { data }: any = getAll();

	useEffect(() => {
		if (value && data && !data?.error_code) {
			setLoading(false);
			reset?.({
				...data,
				id: data?.id.toString(),
				id_agent: data?.id_agent.toString(),
				id_life_provider: data?.id_life_provider.toString(),
				id_life_type,
				id_product_main: data?.id_product_main.toString(),
				id_life_fee_time: data?.id_life_fee_time.toString(),
				id_life_status: data?.id_life_status.toString(),
				id_finan: data?.id_finan.toString(),
				fee_main: data?.fee_main.toString(),
			});
		}
	}, [data]);
	const handleClose = async () => {
		const res = await confirm({
			title: 'Xác nhận',
			html: 'Bạn có chắc muốn hủy?',
			confirmButtonText: 'Đồng ý',
			cancelButtonText: 'Hủy',
			icon: 'warning',
		});
		if (res.isConfirmed) {
			setLoading(false);
			reset?.(defaultValues);
		}
	};

	return (
		<>
			<Stack alignItems={'end'} className="gap-x-2">
				<Input
					{...field}
					isInvalid={!!error}
					errorMessage={error?.message}
					variant="bordered"
					labelPlacement="outside"
					label={displayLabel}
					classNames={{
						inputWrapper: 'border border-default-400 min-h-9 h-9 bg-white pr-0',
						label: 'text-black/90 top-[20px] font-medium',
						input: 'text-[13px] !shadow-none text-default-700',
					}}
					{...rest}
					isDisabled={isDisabled || !!data}
				/>
				<Button
					size="sm"
					onPress={() => (!!value && data ? handleClose() : setLoading(true))}
					isDisabled={(!value && !data) || !!defaultValues?.id}
					isIconOnly
					color="secondary"
					radius="sm"
					className="h-9 min-w-9 -mr-px"
				>
					{data || defaultValues?.id ? (
						<Icons.close size={20} />
					) : (
						<Icons.search size={20} />
					)}
				</Button>
			</Stack>
			{/* {data?.status === 1 && !content ? (
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
			) : data ? (
				<div className="shadow-sm bg-success/5 rounded-md p-2 mt-2">
					<UserCell data={data} showLevel isLocked={!data?.is_open} />
				</div>
			) : null} */}
		</>
	);
}
