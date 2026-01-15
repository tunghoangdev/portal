import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { transformToOptions, useAuth, useCommon, useCommonData } from "~/hooks";
import { useCommonStore } from "~/stores";
import { SelectField } from "./select-field";
import { ROLES } from "~/constant";
interface ContactTypeFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  control: Control<any>;
  defaultOption?: number;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
}

export function PermissionField<TFormValues extends FieldValues>({
  name,
  control,
  defaultOption,
  label,
  isRequired,
  placeholder,
}: ContactTypeFieldProps<TFormValues>) {
  const { permissionList } = useCommon();
  const {role} = useAuth();
  const basePath = role === ROLES.SAMTEK ? `/root/${API_ENDPOINTS.dic.permission}` : API_ENDPOINTS.dic.permission;
  const { isFetching } = useCommonData(
    "permissionList",
    basePath,
    {
      enabled: true,
    }
  );
  const listData = transformToOptions(permissionList, "permission_name");
  return (
    <SelectField
      control={control}
      name={name}
      options={listData}
      defaultSelectedKeys={
        defaultOption !== undefined &&
        listData &&
        listData[defaultOption]?.value
          ? listData[defaultOption]?.value
          : undefined
      }
      label={label}
      isRequired={isRequired}
      placeholder={isFetching ? "Đang tải..." : placeholder}
    />
  );
}
