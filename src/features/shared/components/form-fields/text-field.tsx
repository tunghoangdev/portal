import { forwardRef } from "react";
import { Input, type InputProps } from "~/components/ui";
import { Controller, type Control, type FieldValues } from "react-hook-form";
interface TextFieldProps extends Omit<InputProps, "name"> {
  name: string;
  control: Control<FieldValues>; // Sử dụng FieldValues để linh hoạt hơn trong type
}

// Sử dụng forwardRef để chuyển tiếp ref từ bên ngoài vào Input component
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ name, control, ...props }, ref) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Input
            // {...field} sẽ bao gồm onChange, onBlur, value, và đặc biệt là ref
            // Khi bạn truyền ref từ forwardRef vào đây, nó sẽ được gán cho input bên trong
            // Input component của @heroui/react có thể đã nhận ref trực tiếp
            // hoặc chuyển tiếp nó đến phần tử <input> nội bộ của nó.
            {...field}
            // ref={ref} // Chuyển tiếp ref nhận được từ forwardRef
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            classNames={{
              label: "font-semibold",
              inputWrapper: "border shadow-xs bg-white",
            }}
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
TextField.displayName = "TextField";
