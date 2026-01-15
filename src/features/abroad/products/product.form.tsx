import type { FieldValues, Control, UseFormReturn } from "react-hook-form";
import { Grid } from "~/components/ui";
import { FormField } from "~/features/shared/components/form-fields";
import { productFormFields } from "./form-schema";
interface ProductFormProps<T extends FieldValues> {
  control: Control<T>;
  formMethods?: UseFormReturn<T>;
}

export const ProductForm = <T extends FieldValues>({
  control,
  formMethods,
}: ProductFormProps<T>) => {
  return (
    <Grid container spacing={4}>
      {productFormFields.map((item: any, index: number) => (
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
};
