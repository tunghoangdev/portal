import { useCallback, useEffect, useState } from "react";
import { CRUD_ACTION_TO_PERMISSION, EXCLUDE_ACTIONS, ROLES } from "~/constant";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useAuth, useCommon, useCrud } from "~/hooks";

interface PermissionAction {
  action: any;
  data?: any;
}

interface UsePermissionActionProps {
  onAction: (action: any, data?: any) => Promise<void> | void;
}

export function usePermissionAction({ onAction }: UsePermissionActionProps) {
  const { idForm, role, user } = useAuth();
  const { selectedFormId } = useCommon();
  const [pendingAction, setPendingAction] = useState<PermissionAction | null>(
    null,
  );

  // Tạo query object
  const queryAction = {
    id_form: selectedFormId || idForm,
    permission: pendingAction?.data?.permission,
    action: pendingAction?.action,
  };

  // Gọi API check quyền
  const { getAll } = useCrud(
    [API_ENDPOINTS.permission.checkPermissionButton, queryAction],
    {
      id_form: selectedFormId || idForm,
      id_button: pendingAction?.data?.permission,
      id_staff: role === ROLES.SAMTEK ? user?.id : undefined,
      endpoint: role === ROLES.SAMTEK ? "root" : "",
    },
    {
      enabled: !!pendingAction?.data?.permission && !!idForm,
      staleTime: 1,
    },
  );

  const { data: accessAction, isFetching }: any = getAll();

  useEffect(() => {
    if (pendingAction && !isFetching) {
      if (accessAction?.status === 1) {
        const { data, action } = pendingAction;
        onAction(action, data);
      }
      setPendingAction(null);
    }
  }, [pendingAction, accessAction, isFetching, onAction]);

  const runAction = useCallback((action: any, rowData?: any) => {
    const requiredPermission =
      CRUD_ACTION_TO_PERMISSION[
        action as keyof typeof CRUD_ACTION_TO_PERMISSION
      ];

    if (!requiredPermission && !EXCLUDE_ACTIONS.includes(action)) return;
    // Nhung action khong can check quyen
    if (EXCLUDE_ACTIONS.includes(action)) {
      onAction(action, rowData);
      return;
    }
    setPendingAction({
      action,
      data: {
        ...rowData,
        permission: requiredPermission,
      },
    });
  }, []);

  return {
    runAction,
    isChecking: isFetching,
  };
}
