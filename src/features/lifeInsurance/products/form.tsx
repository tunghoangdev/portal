import { Grid } from "@/components/ui";
import { FormField } from "@/features/shared/components/form-fields";
import { productFormFields } from "@/schema-validations";
import type { Control, FieldValues, UseFormReturn } from "react-hook-form";
interface ProductFormProps<T extends FieldValues> {
  control: Control<T>;
  formMethods?: UseFormReturn<T>;
}

export function LifeProductForm<T extends FieldValues>({
  control,
  formMethods,
}: ProductFormProps<T>) {
  return (
    <Grid container spacing={4}>
      {productFormFields.map((item, index) => (
        <Grid item xs={6} lg={item.col} key={index}>
          {item.extra ? (
            <item.extra
              control={control}
              name={item.name}
              label={item.label}
              placeholder={item.placeholder}
              defaultOption={item.defaultOption}
              formMethods={formMethods}
              fieldProps={item.fieldProps}
            />
          ) : (
            <FormField
              key={item.name}
              control={control}
              name={item.name}
              label={item.label}
              placeholder={item.placeholder}
              type={item.type as any}
              // isRequired={item.isRequired}
              options={item.options}
            />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
LifeProductForm.displayName = "LifeProductForm";
