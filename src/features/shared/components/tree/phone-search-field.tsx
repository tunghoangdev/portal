import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";
import { Input, type InputProps } from "~/components/ui";
import { Icons } from "~/components/icons";

interface FieldProps<TFormValues extends FieldValues>
  extends Omit<InputProps, "name" | "ref"> {
  name: string;
  control: Control<TFormValues>;
  isRequired?: boolean;
  label?: string;
}

export function PhoneSearchField<TFormValues extends FieldValues>(
  props: FieldProps<TFormValues>
) {
  const { name, control, isRequired, label, ...rest } = props;

  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as Path<TFormValues>,
    control,
  });

  const displayLabel = (
    <div className="flex items-center">
      {label}
      {isRequired && label && <span className={"text-danger ml-1"}>*</span>}
    </div>
  ) as any;

  return (
    <>
      <Input
        {...field}
        isInvalid={!!error}
        errorMessage={error?.message || ""}
        variant="bordered"
        labelPlacement="outside"
        label={displayLabel}
        classNames={{
          base: "!mt-0",
          inputWrapper: "border border-default-400 min-h-9 h-9 bg-white",
          label: "text-black/90 top-[20px] font-medium",
          input: "text-[13px] !shadow-none text-default-700",
        }}
        {...rest}
        startContent={<Icons.phone size={16} className="text-default-800" />}
      />
      {/* {!agentData && !invalid && isDirty ? (
        <Alert
          color="warning"
          title={"Không tìm thấy thành viên trong hệ thống!"}
          hideIconWrapper
          icon={<Icons.triangle size={16} />}
          classNames={{
            base: "mt-2.5 p-1.5",
            title: "text-xs",
            alertIcon: "fill-transparent",
            iconWrapper: "w-5",
            mainWrapper: "m-0 ml-1.5",
          }}
          variant={"flat"}
        />
      ) : null} */}
    </>
  );
}
