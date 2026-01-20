"use client";
import { useEffect, useState } from "react";
import FormList from "./form-list";
import FormAccess from "./fform-access";
import FormButton from "./form-button";
import { Grid } from "@/components/ui";
import { useCommon, usePermissionAction } from "@/hooks";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { useCrud } from "@/hooks/use-crud-v2";
import { CRUD_ACTIONS } from "@/constant";

const checkIsAccessForm = (forms: any[], idForm: any) =>
  forms?.find((f: any) => f.id === idForm)?.access || false;

export const RoleList = ({ idPermission }: any) => {
  // *** STATE ***
  const [form, setForm] = useState<any>(null);
  const [isEdit] = useState(true);
  const idForm = form?.id || null;
  const [formGroup, setFormGroup] = useState({});
  const { selectedFormId } = useCommon();
  const basePath = API_ENDPOINTS.staff.form;
  const { getAll, updateConfirm } = useCrud(
    [basePath.list],
    {
      endpoint: "",
      id: idPermission,
    },
    {
      enabled: !!idPermission,
    }
  );
  const { data: formListQuery, isFetching }: any = getAll();

  const { getAll: getAllButton } = useCrud(
    [basePath.buttonList, idForm || selectedFormId],
    {
      endpoint: "",
      id_permission: idPermission,
      id_form: idForm || selectedFormId,
    },
    {
      enabled: !!idPermission,
    }
  );
  const { data: formButtonQuery }: any = getAllButton();

  // *** VARIABLE ***
  const isAccessForm = checkIsAccessForm(formListQuery, idForm);

  // *** EFFECT ***
  useEffect(() => {
    if (formListQuery?.length > 0) {
      const data = formListQuery || [];
      const formGroup = data.reduce((acc: any, d: any) => {
        // Group by `module_group`
        if (!acc[d.module_group]) {
          acc[d.module_group] = [d];
        } else {
          acc[d.module_group].push(d);
        }

        return acc;
      }, {});

      setFormGroup(formGroup);
    }
  }, [formListQuery]);

  const handleCurdAction = async (action: any) => {
    const formAction = [
      CRUD_ACTIONS.PERMISSION_FORM,
      CRUD_ACTIONS.REMOVE_PERMISSION_FORM,
    ].includes(action);
    const formCheck = action === CRUD_ACTIONS.PERMISSION_FORM;
    const buttonAction = [
      CRUD_ACTIONS.PERMISSION_BUTTON,
      CRUD_ACTIONS.REMOVE_PERMISSION_BUTTON,
    ].includes(action);
    const buttonCheck = action === CRUD_ACTIONS.PERMISSION_BUTTON;
    if (formAction) {
      const url = formCheck ? basePath.checkAll : basePath.unCheckAll;
      const message = formCheck ? "phân quyền" : "bỏ phân quyền";
      const title = formCheck ? "Phân quyền" : "Bỏ phân quyền";
      const customMessage = formCheck
        ? "Phân quyền toàn bộ form thành công!"
        : "Bỏ phân quyền toàn bộ form thành công!";
      await updateConfirm(
        {
          id: idPermission,
        },
        {
          title,
          message: `Bạn có chắc chắn muốn ${message} toàn bộ form không?`,
          _customUrl: url,
          _customMessage: customMessage,
        }
      );
      return;
    }
    if (buttonAction) {
      await updateConfirm(
        {
          id_permission: idPermission,
          id_form: idForm,
        },
        {
          title: buttonCheck ? "Phân quyền" : "Bỏ phân quyền",
          message: `Bạn có chắc chắn muốn ${
            buttonCheck ? "phân quyền" : "bỏ phân quyền"
          } toàn bộ nút không?`,
          _customUrl: buttonCheck
            ? basePath.buttonCheckAll
            : basePath.buttonUncheckAll,
          _customMessage: buttonCheck
            ? "Phân quyền toàn bộ nút thành công!"
            : "Bỏ phân quyền toàn bộ nút thành công!",
        }
      );
      return;
    }
  };
  const { runAction } = usePermissionAction({ onAction: handleCurdAction });

  const handleAccessForm = async (isAccess: any) => {
    await updateConfirm(
      {
        id_permission: idPermission,
        id_form: idForm,
      },
      {
        title: isAccess ? "Cho phép" : "Không cho phép",
        message: `Bạn có chắc chắn muốn ${
          isAccess ? "cho phép" : "không cho phép"
        } truy cập vào <b>${form?.form_name}</b> không?`,
        _customUrl: isAccess ? basePath.accessCheck : basePath.accessUnchecked,
        _customMessage: isAccess
          ? "Cho phép truy cập vào form thành công!"
          : "Không cho phép truy cập vào form thành công!",
      }
    );
  };

  const handleCheckButton = async (idButton: any, check: any) => {
    await updateConfirm(
      {
        id_permission: idPermission,
        id_form: idForm,
        id_button: idButton,
      },
      {
        title: check ? "Cho phép" : "Không cho phép",
        message: `Bạn có chắc chắn muốn ${
          check ? "cho phép" : "không cho phép"
        } truy cập vào nút này không?`,
        _customUrl: check ? basePath.buttonCheck : basePath.buttonUncheck,
        _customMessage: check
          ? "Cho phép truy cập vào nút thành công!"
          : "Không cho phép truy cập vào nút thành công!",
      }
    );
  };
  return (
    <Grid container spacing={4} className="mt-3">
      <Grid item sm={6}>
        <FormList
          data={formGroup}
          idForm={idForm}
          isEdit={isEdit}
          setForm={setForm}
          isLoading={isFetching}
          handleCheckAllForm={(checked: boolean) =>
            runAction(
              checked
                ? CRUD_ACTIONS.PERMISSION_FORM
                : CRUD_ACTIONS.REMOVE_PERMISSION_FORM
            )
          }
          handleCheckAllButton={(checked: boolean) =>
            runAction(
              checked
                ? CRUD_ACTIONS.PERMISSION_BUTTON
                : CRUD_ACTIONS.REMOVE_PERMISSION_BUTTON
            )
          }
        />
      </Grid>
      <Grid item sm={6}>
        {selectedFormId && (
          <>
            <FormAccess
              isEdit={isEdit}
              isAccessForm={isAccessForm}
              handleAccessForm={handleAccessForm}
            />

            <FormButton
              isEdit={isEdit && isAccessForm}
              data={formButtonQuery || []}
              handleCheckButton={handleCheckButton}
              handleCheckAllButton={(checked: boolean) =>
                runAction(
                  checked
                    ? CRUD_ACTIONS.PERMISSION_BUTTON
                    : CRUD_ACTIONS.REMOVE_PERMISSION_BUTTON
                )
              }
            />
          </>
        )}
      </Grid>
    </Grid>
  );
};
