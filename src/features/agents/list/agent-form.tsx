import {
	type FieldValues,
	type Control,
	type UseFormReturn,
	useWatch,
} from 'react-hook-form';
import { Divider, Grid } from '@/components/ui';
import { formFields } from './agent-form.schema';
import { Fragment } from 'react';
import { FormField } from '@/features/shared/components/form-fields';

interface FormViewProps<T extends FieldValues> {
	control: Control<T>;
	formMethods?: UseFormReturn<T>;
	isEdit?: boolean;
}

const titles = ['', 'Thông tin thành viên', '', ''];

export function AgentFormView<T extends FieldValues>({
	control,
	formMethods,
	isEdit,
}: FormViewProps<T>) {
	const { formState, getValues } = formMethods || {};
	const { errors } = formState || {};
	const values: any = getValues?.() || {};

	const parent_phone = useWatch({
		control,
		name: 'parent_phone' as any,
	});

	// Use watched value for reactivity
	const isDisabled = !parent_phone || errors?.parent_phone;

	return (
		<Grid container spacing={4}>
			{formFields.map((field: any, k: number) => {
				return (
					<Fragment key={k}>
						{titles[k] && field.length > 1 && (
							<Grid item xs={12} lg={12}>
								<Divider
									variant="middle"
									classNames={{
										line: 'border-warning-500',
										lineAfter: 'border-warning-500',
									}}
									className="mx-0"
								>
									<h5 className="text-base font-medium text-secondary">
										{titles[k]}
									</h5>
								</Divider>
							</Grid>
						)}
						<Grid
							item
							xs={12}
							lg={12}
							// className={
							//   k > 0
							//     ? "bg-warning-50 p-5 border border-blue-300 border-dashed rounded-md"
							//     : ""
							// }
						>
							<Grid container spacing={4}>
								{field.map((block: any, k: number) => {
									return block.type === 'hidden' ? (
										<FormField
											key={block.name}
											control={control}
											name={block.name}
											type={block.type}
										/>
									) : (
										<Grid item xs={6} lg={block.col} key={k}>
											{block.extra ? (
														<block.extra
															control={control}
															isDisabled={
																(isDisabled && block.name !== 'parent_phone') ||
																(!!parent_phone &&
																	block.name === 'parent_phone' &&
																	isEdit)
															}
															{...block}
															formMethods={formMethods}
														/>
													) : (
														<FormField
															key={block.name}
															control={control}
															fieldProps={{
																isDisabled:
																	isDisabled ||
																	(!!values?.agent_phone &&
																		block.name === 'agent_phone' &&
																		isEdit),
															}}
															{...block}
														/>
													)}
											{/* {block.type === 'upload' ? (
												<ControllerField
													control={control}
													errors={errors}
													isRequired={block.isRequired}
													name={block.name}
													label={block.label}
													Component={block.extra}
													componentProps={{
														...block.fieldProps,
														isDisabled,
													}}
												/>
											) : (
												<>
													{block.extra ? (
														<block.extra
															control={control}
															isDisabled={
																(isDisabled && block.name !== 'parent_phone') ||
																(!!parent_phone &&
																	block.name === 'parent_phone' &&
																	isEdit)
															}
															{...block}
															formMethods={formMethods}
														/>
													) : (
														<FormField
															key={block.name}
															control={control}
															fieldProps={{
																isDisabled:
																	isDisabled ||
																	(!!values?.agent_phone &&
																		block.name === 'agent_phone' &&
																		isEdit),
															}}
															{...block}
														/>
													)}
												</>
											)} */}
										</Grid>
									);
								})}
							</Grid>
						</Grid>
					</Fragment>
				);
			})}
		</Grid>
	);
}
AgentFormView.displayName = 'AgentFormView';
