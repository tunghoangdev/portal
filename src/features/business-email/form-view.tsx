import type { FieldValues, Control, UseFormReturn } from "react-hook-form";
import { Grid } from "~/components/ui";
import { formFields, formStaffFields } from "./form.schema";
import { useMemo } from "react";
import { FormField } from "~/features/shared/components/form-fields";

interface FormViewProps<T extends FieldValues> {
  control: Control<T>;
  formMethods?: UseFormReturn<T>;
  isStaff?: boolean;
}

export function FormView<T extends FieldValues>({
  control,
  formMethods,
  isStaff,
}: FormViewProps<T>) {
  const newFields = useMemo(() => {
    if (isStaff) {
      return formStaffFields;
    }
    return formFields;
  }, [isStaff]);

  return (
    <Grid container spacing={4}>
      {newFields.map((field: any, k: number) => {
        return field.type === "hidden" ? (
          <FormField key={k} control={control} {...field} />
        ) : (
          <Grid item xs={6} lg={field.col} key={k}>
            {field.extra ? (
              <field.extra
                control={control}
                formMethods={formMethods}
                {...field}
              />
            ) : (
              <FormField key={field.name} control={control} {...field} />
            )}
          </Grid>
        );
      })}
    </Grid>
  );
}
FormView.displayName = "FormView";
