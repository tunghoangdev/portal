import { FieldValues, Control, UseFormReturn } from 'react-hook-form';
import { Card, CardBody, Grid, Typography } from '@/components/ui';
import { FormFieldConfig } from '@/types/form-field';
import { FormField } from '@/features/shared/components/form-fields';

interface LifeProductPolicyFormProps<T extends FieldValues> {
	control: Control<T>;
	formMethods?: UseFormReturn<T>;
	fields: any[];
}

export function LifeProductPolicyForm<T extends FieldValues>({
	control,
	formMethods,
	fields,
}: LifeProductPolicyFormProps<T>) {
	return (
		<Grid container spacing={6}>
			{fields.map((block: any, idx: number) => (
				<Grid item xs={12} key={idx}>
					<Card
						key={idx}
						radius="sm"
						shadow="sm"
						classNames={{
							body: 'px-4 pb-4 pt-1',
						}}
					>
						<Typography
							variant={'body2r'}
							className="font-bold text-blue-500 ml-4 mt-2"
						>{`Cấu hình thưởng năm ${idx + 1}`}</Typography>
						<CardBody>
							<Grid container spacing={5} key={idx}>
								{/* <Divider
                classNames={{
                  base: "my-3",
                  line: "!border-secondary-500 !border-dashed",
                  lineAfter: "!border-secondary-500 !border-dashed",
                  textWrapper: "!text-secondary font-bold",
                }}
              >
                <Typography variant={"body2r"}>{`Cấu hình thưởng năm ${
                  idx + 1
                }`}</Typography>
              </Divider> */}
								{block.map((item: FormFieldConfig, index: number) => (
									<Grid item xs={6} lg={item.col} key={index}>
										{item.extra ? (
											<item.extra
												control={control}
												{...item}
												formMethods={formMethods}
											/>
										) : (
											<FormField key={item.name} control={control} {...item} />
										)}
									</Grid>
								))}
							</Grid>
						</CardBody>
					</Card>
				</Grid>
			))}
		</Grid>
	);
}
LifeProductPolicyForm.displayName = 'LifeProductPolicyForm';
