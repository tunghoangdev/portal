import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { type InputProps } from "~/components/ui";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { transformToOptions, useCommon, useCommonData } from "~/hooks";
import { SelectField } from "./select-field";
import { useEffect } from "react";

interface PermissionDocFieldProps<TFormValues extends FieldValues>
  extends Omit<InputProps, "name" | "ref"> {
  name: Path<TFormValues>;
  control: Control<TFormValues>;
  formMethods?: UseFormReturn<TFormValues>;
  defaultOption?: number;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

export function PermissionDocTypeField<TFormValues extends FieldValues>({
  name,
  control,
  defaultOption,
  label,
  isRequired,
  placeholder,
  formMethods,
  defaultValue,
}: PermissionDocFieldProps<TFormValues>) {
  const { agentLevels } = useCommon();
  const { setValue } = formMethods || {};
  const watchPermissType = useWatch({
    control,
    name,
  });
  const { isFetching } = useCommonData(
    "agentLevels",
    API_ENDPOINTS.dic.agentLevel,
    {
      enabled: true,
    }
  );
  useEffect(() => {
    if (watchPermissType) {
      const type = watchPermissType?.split(",")?.map(Number);
      if (type?.length) {
        const typeValue = agentLevels?.filter((item: any) =>
          type?.includes(item.id)
        );
        setValue?.(
          "permission_doc_name" as any,
          typeValue?.map((item: any) => item.level_code)?.join(";"),
          { shouldValidate: true, shouldDirty: true }
        );
      }
    } else {
      setValue?.("permission_doc_name" as any, "" as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [watchPermissType, agentLevels]);

  useEffect(() => {
    if (
      defaultValue === "all" &&
      agentLevels?.length &&
      control._formValues.permission_doc === "all"
    ) {
      setValue?.(name, agentLevels?.map((item: any) => item.id)?.join(","), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [defaultValue, name, setValue, agentLevels, control]);
  const listData = transformToOptions(agentLevels, "level_code", "id");
  return (
    <SelectField
      control={control}
      name={name}
      options={listData}
      // defaultSelectedKeys={
      // 	defaultOption !== undefined &&
      // 	listData &&
      // 	listData[defaultOption]?.value
      // 		? listData[defaultOption]?.value
      // 		: undefined
      // }
      selectionMode="multiple"
      label={label}
      isRequired={isRequired}
      placeholder={isFetching ? "Đang tải..." : placeholder}
    />
  );
}
