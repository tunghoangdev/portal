import { useForm, useWatch } from "react-hook-form";
import { Button, Grid, Stack } from "~/components/ui";
import {
  customerFormFields,
  customerSchema,
  initialCustomerFormValues,
} from "~/schema-validations/customer.schema";
import { useEffect, useMemo } from "react";
import { useCrud } from "~/hooks/use-crud-v2";
import { ROLES } from "~/constant";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "~/components/icons";
import { FormField } from "./form-fields";
interface Props {
  formControl: any;
  onClose?: () => void;
  onRefetch?: () => void;
  formData?: any;
}
export function CustomerForm({
  onClose,
  formControl,
  onRefetch,
  formData,
}: Props) {
  const basePath = API_ENDPOINTS.agent.customers;
  const { create, update } = useCrud([basePath.create], {
    endpoint: ROLES.AGENT,
  });
  const { mutateAsync: createCustomerMutation } = create();
  const { mutateAsync: updateCustomerMutation } = update();
  const { setValue, control, handleSubmit, reset } = useForm({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: initialCustomerFormValues,
  });
  const customerId = useWatch({
    control: formControl,
    name: "id_customer",
  });
  const agentPhone = useWatch({
    control: formControl,
    name: "agent_phone",
  });

  const agentId = useWatch({
    control: formControl,
    name: "id_agent",
  });
  const customerPhone = useWatch({
    control: formControl,
    name: "customer_phone",
  });

  useEffect(() => {
    if (customerId) {
      setValue?.("id_customer", customerId?.toString(), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    if (customerPhone) {
      setValue?.("customer_phone", customerPhone, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    if (agentId) {
      setValue?.("id_agent", agentId, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    if (agentPhone) {
      setValue?.("agent_phone", agentPhone, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    if (formData) {
      reset({
        ...formData,
        id_province: formData?.id_province?.toString(),
        id_commune: formData?.id_commune?.toString(),
        id_agent: formData?.id_agent?.toString(),
      });
    }
  }, [customerId, agentId, formData, agentPhone]);

  const onSubmit = async (data: any) => {
    if (formData) {
      await updateCustomerMutation(
        {
          ...data,
          id: formData?.id?.toString(),
          _customUrl: basePath.update,
          _closeModal: false,
        },
        {
          onSuccess: (data) => {
            if (!data?.error_code) {
              reset(initialCustomerFormValues);
              onClose?.();
              onRefetch?.();
            }
          },
        }
      );
      return;
    }
    await createCustomerMutation(
      {
        ...data,
        _customUrl: basePath.create,
        _closeModal: false,
      },
      {
        onSuccess: (data) => {
          if (!data?.error_code) {
            reset(initialCustomerFormValues);
            onClose?.();
            onRefetch?.();
          }
        },
      }
    );
  };

  const newFormFields = useMemo(() => {
    return customerFormFields.map((f) => {
      f.isDisabled = !!formData?.id && f.name === "customer_phone";
      return f;
    });
  }, [formData]);

  return (
    <form>
      <Grid container spacing={4}>
        {newFormFields.map((item, index) => {
          return item.type === "hidden" ? (
            <FormField
              key={index}
              control={control}
              {...item}
              formMethods={{ setValue }}
            />
          ) : (
            <Grid item xs={6} lg={item.col} key={index}>
              {item.extra ? (
                <item.extra
                  control={control}
                  {...item}
                  formMethods={{ setValue }}
                  isDisabled={agentPhone && item.name === "agent_phone"}
                />
              ) : (
                <FormField key={item.name} control={control} {...item} />
              )}
            </Grid>
          );
        })}
      </Grid>
      <Stack
        alignItems={"center"}
        className="mt-4 gap-x-2"
        justifyContent={"end"}
      >
        <Button variant="bordered" size="sm" onPress={() => onClose?.()}>
          Hủy
        </Button>
        <Button
          color="primary"
          size="sm"
          startContent={<Icons.save size={16} />}
          onPress={() => {
            handleSubmit(onSubmit)();
          }}
        >
          {formData ? "Cập nhật" : "Tạo mới"}
        </Button>
      </Stack>
    </form>
  );
}
CustomerForm.displayName = "CustomerForm";
