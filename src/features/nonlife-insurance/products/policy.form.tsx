import { FieldValues, Control, UseFormReturn } from "react-hook-form";
import { Grid } from "@/components/ui";
import { FormFieldConfig } from "@/types/form-field";
import { FormField } from "@/features/shared/components/form-fields";

interface NoneLifeProductPolicyFormProps<T extends FieldValues> {
  control: Control<T>;
  formMethods?: UseFormReturn<T>;
  fields?: any[];
}
export function NoneLifeProductPolicyForm<T extends FieldValues>({
  control,
  fields,
}: NoneLifeProductPolicyFormProps<T>) {
  if (!fields) return null;
  return (
    <Grid container spacing={6}>
      {fields.map((item: any, index: number) => (
        <Grid item xs={6} lg={item.col} key={index}>
          {item.extra ? (
            <item.extra control={control} {...item} />
          ) : (
            <FormField key={item.name} control={control} {...item} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
NoneLifeProductPolicyForm.displayName = "NoneLifeProductPolicyForm";
