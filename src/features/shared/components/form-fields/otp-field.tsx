import { forwardRef } from "react";
import { InputOtp, type InputOtpProps } from "~/components/ui";
import { Controller, type Control, type FieldValues } from "react-hook-form";
interface OtpFieldProps extends Omit<InputOtpProps, "name"> {
  name: string;
  control: Control<FieldValues>;
  rules?: any;
}

export const OtpField = forwardRef<HTMLInputElement, OtpFieldProps>(
  ({ name, control, rules, ...props }, ref) => {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <InputOtp
            {...field}
            variant="bordered"
            radius="sm"
            {...props}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    );
  }
);

// Gán displayName cho component để dễ dàng debug trong React DevTools
OtpField.displayName = "OtpField";
