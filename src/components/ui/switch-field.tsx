import { cn } from "~/lib/utils";
import { Switch, type SwitchProps } from "@heroui/react";
import { Controller, type Control } from "react-hook-form";
// Omit 'name' and 'checked', 'onChange' as Controller handles them
interface CheckboxFieldProps
  extends Omit<SwitchProps, "name" | "checked" | "onCheckedChange"> {
  name: string;
  label?: string;
  control: Control<any>;
  classNames?: {
    label?: string;
    wrapper?: string;
  };
}

export const SwitchField = ({
  name,
  control,
  label,
  classNames,
  ...props
}: CheckboxFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn(classNames?.wrapper)}>
          <Switch
            isSelected={field.value}
            onValueChange={field.onChange}
            size="sm"
          >
            <span className={cn(classNames?.label)}>{label}</span>
          </Switch>
          {fieldState.error?.message && <p>{fieldState.error?.message}</p>}
        </div>
        // <Checkbox
        // 	isSelected={!!field.value} // `isSelected` is common for boolean state in UI libs
        // 	onValueChange={field.onChange} // Connect to react-hook-form's onChange
        // 	radius="sm"
        // 	classNames={{
        // 		// Add any custom classes for the Checkbox here if needed
        // 		label: 'font-semibold',
        // 	}}
        // 	{...props}
        // 	isInvalid={!!fieldState.error}
        // 	errorMessage={fieldState.error?.message}
        // />
      )}
    />
  );
};
