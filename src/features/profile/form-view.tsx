import type { FieldValues, Control } from "react-hook-form";
import { Divider, Grid, Stack, Typography } from "@/components/ui";
import { formFields } from "./form.schema";
import { FormField } from "@/features/shared/components/form-fields";
import { cn } from "@/lib/utils";
import UpdateEmailForm from "./edit-email-form";

interface FormViewProps<T extends FieldValues> {
  control: Control<T>;
  formMethods?: any;
  canEdit?: boolean;
}

export function FormView<T extends FieldValues>({
  control,
  formMethods,
  canEdit,
}: FormViewProps<T>) {
  const { formState } = formMethods || {};
  const { errors } = formState || {};
  return (
    <>
      <Grid container spacing={4}>
        {formFields.map((block: any, k: number) => {
          return (
            <Grid item xs={12} key={k}>
              <Divider
                classNames={{
                  base: "my-3 ",
                  line: "!border-secondary-500 !border-dashed",
                  lineAfter: "!border-secondary-500 !border-dashed",
                }}
              >
                <Typography
                  variant={"h5"}
                  className={cn(
                    `font-medium text-lg ${
                      k === 0 ? "text-primary" : "mt-5 text-secondary"
                    }`
                  )}
                >
                  {block.title}
                </Typography>
              </Divider>
              <Grid container spacing={4}>
                {block.fields.map((field: any, k2: number) => {
                  field.isDisabled = field.isDisabled || !canEdit;
                  return (
                    <Grid item xs={6} lg={field.col} key={k2}>
                      {field.name === "email" && !canEdit ? (
                        <Stack alignItems={"end"} className="gap-x-2">
                          <FormField
                            key={field.name}
                            name={field.name}
                            control={control}
                            {...field}
                          />
                          <UpdateEmailForm />
                        </Stack>
                      ) : (
                        <>
                          {field.type === "hidden" ? (
                            <FormField
                              key={field.name}
                              name={field.name}
                              control={control}
                              {...field}
                            />
                          ) : (
                            <>
                              {field.extra ? (
                                <field.extra
                                  control={control}
                                  formMethods={formMethods}
                                  {...field}
                                />
                              ) : (
                                <FormField
                                  key={field.name}
                                  name={field.name}
                                  control={control}
                                  {...field}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                      {/* {field.type === 'upload' ? (
												<ControllerField
													control={control}
													errors={errors}
													isRequired={field.isRequired}
													name={field.name}
													label={field.label}
													Component={field.extra}
													componentProps={{
														...field.props,
														disabled: !canEdit,
														isDisabled: !canEdit,
													}}
												/>
											) : (
												<>
													{field.name === 'email' && !canEdit ? (
														<Stack alignItems={'end'} className="gap-x-2">
															<FormField
																key={field.name}
																name={field.name}
																control={control}
																{...field}
															/>
															<UpdateEmailForm />
														</Stack>
													) : (
														<>
															{field.type === 'hidden' ? (
																<FormField
																	key={field.name}
																	name={field.name}
																	control={control}
																	{...field}
																/>
															) : (
																<>
																	{field.extra ? (
																		<field.extra
																			control={control}
																			formMethods={formMethods}
																			{...field}
																		/>
																	) : (
																		<FormField
																			key={field.name}
																			name={field.name}
																			control={control}
																			{...field}
																		/>
																	)}
																</>
															)}
														</>
													)}
												</>
											)} */}
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
FormView.displayName = "FormView";
