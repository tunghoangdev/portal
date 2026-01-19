import { FieldValues, Control } from "react-hook-form";
import { Grid } from "@/components/ui";
import { FormField } from "@/features/shared/components/form-fields";
import { providerFormFields } from "@/schema-validations";

interface LifeProviderFormProps<T extends FieldValues> {
  control: Control<T>;
}

export function LifeProviderForm<T extends FieldValues>({
  control,
}: LifeProviderFormProps<T>) {
  return (
    <Grid container spacing={6}>
      {providerFormFields.map((item: any, idx: number) => (
        <Grid item xs={6} lg={item.col} key={idx}>
          <FormField
            key={item.name}
            control={control}
            name={item.name}
            label={item.label}
            placeholder={item.placeholder}
            type={item.type}
            isRequired={item.isRequired}
            options={item.options}
          />
        </Grid>
      ))}
    </Grid>
  );
}
LifeProviderForm.displayName = "LifeProductPolicyForm";
