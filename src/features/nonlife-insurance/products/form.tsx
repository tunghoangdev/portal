import { Grid } from "@/components/ui";
import { FormField } from "@/features/shared/components/form-fields";
import { noneLifeProductFormFields } from "@/schema-validations";
import type { Control, FieldValues, UseFormReturn } from "react-hook-form";
interface NoneLifeProductFormProps<T extends FieldValues> {
  control: Control<T>;
  formMethods?: UseFormReturn<T>;
}

export function NoneLifeProductForm<T extends FieldValues>({
  control,
  formMethods,
}: NoneLifeProductFormProps<T>) {
  return (
    <Grid container spacing={4}>
      {noneLifeProductFormFields.map((item: any, index) => (
        <Grid item xs={6} lg={item.col} key={index}>
          {item.extra ? (
            <item.extra control={control} formMethods={formMethods} {...item} />
          ) : (
            <FormField key={item.name} control={control} {...item} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
NoneLifeProductForm.displayName = "NoneLifeProductForm";
