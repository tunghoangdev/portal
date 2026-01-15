import {
	type Control,
	type FieldValues,
	type Path,
	useFieldArray,
	useWatch,
} from 'react-hook-form';
import { Button, Grid } from '~/components/ui';
import { useSwal } from '~/hooks';
import { Icons } from '~/components/icons';
interface FieldProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	control: Control<any>;
	subFields: any[];
	placeholder?: string;
	isDisabled?: boolean;
	isRequired?: boolean;
	label?: string;
	customPath?: string;
	showRemove?: boolean;
}

export function ArrayButtonField<TFormValues extends FieldValues>({
	name,
	control,
	subFields,
}: FieldProps<TFormValues>) {
	const providerId = useWatch({
		control,
		name: 'id_life_provider',
	});
	const productMainId = useWatch({
		control,
		name: 'id_product_main',
	});
	const { confirm } = useSwal();
	const { fields, remove, append } = useFieldArray({
		control,
		name,
	});
	const handleDelete = async (k: number) => {
		const res = await confirm({
			title: 'Xác nhận',
			html: 'Bạn có chắc chắn xóa sản phẩm bổ trợ này không?',
		});
		if (res.isConfirmed) {
			remove(k);
		}
	};
	// const handleAdd = () => {
	//   append({
	//     id_life_product: "",
	//     fee: "",
	//   });
	// };
	return (
		<div className="bg-amber-50 p-2.5 shadow-sm">
			{fields.map((field, index) => {
				return (
					<Grid
						container
						key={field.id}
						className="my-2 md:my-5 gap-2 md:gap-4"
					>
						{subFields.map((subField: any, i: number) => (
							<Grid item xs={subField.col} key={i}>
								<subField.extra
									{...subField}
									control={control}
									name={`${name}.${index}.${subField.name}`}
									endContent={
										i > 0 ? (
											<button
												className="focus:outline-none hover:cursor-pointer rounded-full p-1 text-danger"
												type="button"
												onClick={() => handleDelete(index)}
											>
												<Icons.trash
													size={16}
													className="pointer-events-none"
												/>
											</button>
										) : undefined
									}
								/>
							</Grid>
						))}
					</Grid>
				);
			})}
			<Button
				isDisabled={!providerId || !productMainId}
				onPress={() => {
					append(subFields[0]);
				}}
				variant="bordered"
				color="secondary"
				size="sm"
				startContent={<Icons.add size={12} strokeWidth={1} />}
				className="h-8 md:h-9 mt-2.5"
			>
				Thêm sản phẩm bổ trợ
			</Button>
		</div>
	);
}
