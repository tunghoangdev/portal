import { Icons } from "@/components/icons";
import { Button } from "@/components/ui";
import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { TextField } from "@/features/shared/components/form-fields";
import { usePermissionAction } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SCHEMA = z.object({
  permission_name: z.string().min(1, "Tên quyền không được để trống"),
});

export const PermissionFormView = ({ onRefresh, data, idForm }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const basePath = API_ENDPOINTS.staff.permission;
  const { create, update } = useCrud([basePath.list], {
    endpoint: "",
  });
  // *** HOOK FORM ***
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  }: any = useForm({
    mode: "onChange",
    resolver: zodResolver(SCHEMA),
    defaultValues: { permission_name: "" },
  });

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  const { runAction } = usePermissionAction({
    onAction: handleToggle,
  });

  // *** EFFECT ***
  useEffect(() => {
    if (data) {
      setIsExpanded(true);
      reset(data);
    }
  }, [data]);

  const { mutateAsync: onAdd } = create();
  const { mutateAsync: onUpdate } = update();
  const handleSuccess = () => {
    onRefresh();
    setIsExpanded(false);
    reset({
      permission_name: "",
    });
  };

  // *** SUBMIT ***
  const onSubmit = async (values: any) => {
    if (data) {
      await onUpdate(
        {
          ...values,
          id: data.id,
          _customUrl: basePath.update,
          _customMessage: "Cập nhật quyền thành công",
        },
        {
          onSuccess: handleSuccess,
        },
      );
    } else {
      await onAdd(
        {
          ...values,
          _customUrl: basePath.create,
          _customMessage: "Thêm mới quyền thành công",
        },
        {
          onSuccess: handleSuccess,
        },
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center space-x-2">
          <Button
            color="secondary"
            onPress={() => runAction(CRUD_ACTIONS.ADD)}
            size="sm"
            isIconOnly
            className={`transition-all duration-300 ease-in-out ${
              !isExpanded
                ? "w-6 scale-100 opacity-100"
                : "w-0 scale-95 opacity-0 hidden"
            }`}
          >
            <Icons.add size={14} />
          </Button>
          <div
            className={`flex items-center space-x-2 transition-all overflow-hidden duration-700 ease-in-out 
          ${
            isExpanded
              ? "w-full scale-100 opacity-100"
              : "w-0 scale-95 opacity-0"
          }`}
          >
            <TextField
              control={control}
              name="permission_name"
              //   label="Tên quyền"
              placeholder="Nhập tên quyền..."
              isRequired
            />
            <Button
              // onClick={handleSave}
              type="submit"
              startContent={<Icons.save />}
              className={`h-9 ${
                errors?.permission_name?.message ? "mb-[24px]" : ""
              }`}
              color="secondary"
            >
              Lưu
            </Button>
            <Button
              onPress={() => setIsExpanded(false)}
              size="sm"
              isIconOnly
              color="danger"
              className={`p-2 text-gray-500 hover:text-gray-700 h-9 w-9 min-w-9 ${
                errors?.permission_name?.message ? "mb-[24px]" : ""
              }`}
              variant="bordered"
            >
              <Icons.close className="h-6 w-6 text-danger" />
            </Button>
          </div>
        </div>{" "}
      </form>
    </>
  );
};
