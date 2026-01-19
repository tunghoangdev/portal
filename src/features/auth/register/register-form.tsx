
import { useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { Button, Grid } from "@/components/ui";
import {
  agentRegisterSchema,
  initialFormValues,
  registerFormFields,
} from "@/schema-validations/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/features/shared/components/form-fields";
import { Icons } from "@/components/icons";

const AgentRegisterForm = ({ data, onUpdate }: any) => {
  const { control, reset, handleSubmit, getValues, setValue, trigger } =
    useForm({
      mode: "onChange",
      resolver: zodResolver(agentRegisterSchema),
      defaultValues: initialFormValues,
    });
  // Data initialization
  useEffect(() => {
    if (data?.agent_phone && getValues()?.agent_phone === "") {
      reset({ ...initialFormValues, ...data });
    }
  }, [data, reset]);

  return (
    <form onSubmit={handleSubmit(onUpdate)}>
      <Grid container spacing={3}>
        {registerFormFields.map((field, index) => {
          return field.type === "hidden" ? (
            <FormField
              key={field.name}
              control={control}
              name={field.name}
              {...field}
            />
          ) : (
            <Grid item key={`${field.name}-${index}`} sm={field.col}>
              {field.extra ? (
                <field.extra
                  control={control}
                  {...field}
                  formMethods={{ setValue, trigger, reset }}
                />
              ) : (
                <FormField
                  control={control}
                  key={field.name}
                  {...field}
                  formMethods={{ setValue, trigger, reset }}
                  isDisabled={
                    (field.name === "agent_phone" && data?.agent_phone) ||
                    (field.name === "email" && data?.email)
                  }
                  // fieldProps={{
                  // 	isDisabled:
                  // 		field.name === 'agent_phone' && data?.agent_phone,
                  // }}
                />
              )}
              {/* {field.isCustom ? (
							<InputField
								isRequired={field.isRequired}
								name={field.name}
								label={field.label}
								value={watch(field.name)}
								disabled
							/>
						) : (
							<ControllerField
								control={control}
								errors={errors}
								isRequired={field.isRequired}
								name={field.name}
								label={field.label}
								Component={field.Component}
								componentProps={field.props}
							/>
						)} */}
            </Grid>
          );
        })}
        <Grid item xs={12} className="items-center">
          <Button
            type="submit"
            color="secondary"
            startContent={<Icons.save size={16} />}
            className="mx-auto mt-5 md:mt-10 inline-flex relative"
          >
            Khởi tạo thành viên
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
export default memo(AgentRegisterForm);
