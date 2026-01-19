"use client";
import { useModals } from "@/hooks/query/modals";
import { useState } from "react";
import { ID_FORM, MAIN_LABEL, QUERY, SELECTOR_KEY } from "./config";
import { useSubmitData } from "@/hooks/query/query";
import { toast } from "sonner";
import useAgentActions from "@/actions/agent";
import ViewLogList from "@/components/old/view-log-list";
import ModalComponent from "@/components/old/core/modal";
import AgentApproveForm from "@/components/ui/forms/agent/Approve";
import AgentAssignLevel from "./assign-level";
import AgentChangeManager from "./change-manager";
import AgentRecruitmentLink from "@/components/old/agent-recruitment-link";
import AgentForm from "@/components/old/ui/forms/agent";
import AgentColumns from "@/components/old/ui/columns/agent";
import { useCheckPermissionButton } from "@/hooks/query/permission";
import { PERMISSION_BUTTON_IDS } from "@/configs/permission";
import { Icons } from "@/components/icons";
import { DropdownTrigger } from "@heroui/react";
import classNames from "classnames";
import { Dropdown, DropdownMenu, DropdownItem } from "@heroui/react";
import ViewAgentDetail from "../agent-views/agent-detail";
import { Button } from "@/components/ui";
interface Props {
  rowData?: any;
  refetch?: any;
}
export default function ActionView({ rowData, refetch }: Props) {
  const columns = AgentColumns();
  // *** MODALS ***
  const { modals, toggleModal }: any = useModals({
    form: false,
    log: false,
    approveAgent: false,
    detail: false,
    assignLevel: false,
    assignBranch: false,
    changeManager: false,
    recruitmentLink: false,
  });
  const getActionColor = (action: any) => {
    let color = "";

    switch (action.id) {
      case "edit":
        color = "text-warning";
        break;

      case "delete":
        color = "text-danger";
        break;

      case "view-detail":
        color = "text-info";
        break;

      case "history":
        color = "text-blue-400";
        break;

      default:
        break;
    }
    return color;
  };

  // *** STATE ***
  const [rowSelected, setRowSelected] = useState(null);
  // *** VARIABLES ***
  const selectorValue = rowSelected?.[SELECTOR_KEY];
  // *** MUTATIONS ***
  const { mutate: onApprove, isPending: isApproving } = useSubmitData({
    url: QUERY.approve,
    cb: () => {
      refetch();
      toast.success(`Duyệt ${MAIN_LABEL} thành công`);
      toggleModal("approveAgent")(false);
    },
  });
  // *** ACTIONS ***
  const { actions } = useAgentActions({
    label: MAIN_LABEL,
    selector: SELECTOR_KEY,
    refetch,
    setRowSelected,
    toggleModal,
  });
  const onOpenForm = () => {
    setRowSelected(null);
    toggleModal("form")(true);
  };
  const onCloseForm = () => {
    toggleModal("form")(false);
  };

  // *** PERMISSION ***
  const { mutate: onCheckPermissionButton } = useCheckPermissionButton();
  const handleClick = (action: any, e: any) => {
    const cb = () => action.click(rowData, e);
    let idButton = 0;

    switch (action.id) {
      case "edit":
        idButton = PERMISSION_BUTTON_IDS.UPDATE;
        break;

      case "delete":
        idButton = PERMISSION_BUTTON_IDS.DELETE;
        break;

      case "history":
        idButton = PERMISSION_BUTTON_IDS.VIEW_HISTORY;
        break;

      default:
        idButton = action.idButton || 0;
        break;
    }
    // if (idButton && ID_FORM) {
    //   return onCheckPermissionButton({
    //     idForm: ID_FORM,
    //     idButton,
    //     cb,
    //   });
    // }

    // return cb();
  };
  // console.log('rowData', rowData);
  console.log("actions", actions);

  return (
    <>
      <Dropdown shouldBlockScroll={false}>
        <DropdownTrigger>
          <Button
            isIconOnly
            variant="light"
            radius="full"
            className="text-secondary"
          >
            <Icons.ellipsisVertical size={18} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Action event example"
          onAction={(key) => {
            const action = actions.find((a) => a.id === key);
            handleClick(action, null);
            // console.log(key);
          }}
        >
          {actions.map((action) => {
            const { id, title, icon } = action;
            const Icon = icon;
            return (
              <DropdownItem
                key={id}
                // onClick={(e) => {
                // 	// e.preventDefault();
                // 	handleClick(action, e);
                // }}
                startContent={
                  <Icon
                    size={20}
                    className={classNames("mr-1", getActionColor(action))}
                  />
                }
              >
                <span
                  className={classNames(
                    "align-middle text-sm",
                    getActionColor(action)
                  )}
                >
                  {title}
                </span>
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
      {/* Modal Log List */}
      <ViewLogList
        title={`Lịch sử ${MAIN_LABEL} ${selectorValue || ""}`}
        open={modals.log}
        toggle={() => toggleModal("log")(false)}
        data={rowSelected}
        // @ts-ignore
        columns={columns}
        url={QUERY.logList}
      />

      {/* Modal Form */}
      <ModalComponent
        open={modals.form}
        toggle={onCloseForm}
        title={`${rowSelected ? "Chỉnh sửa" : "Tạo mới"} ${MAIN_LABEL}`}
        size="lg"
        style={{ maxWidth: "960px" }}
        // @ts-ignore
        Body={
          <AgentForm
            open={modals.form}
            data={rowSelected}
            refetch={refetch}
            toggle={onCloseForm}
          />
        }
      />

      {/* Modal View Detail */}
      <ViewAgentDetail
        data={rowSelected}
        open={modals.detail}
        toggle={() => toggleModal("detail")(false)}
        query={QUERY}
      />

      {/* Approve Agent */}
      <AgentApproveForm
        title={`Duyệt ${MAIN_LABEL} ${selectorValue || ""}`}
        open={modals.approveAgent}
        toggle={() => toggleModal("approveAgent")(false)}
        data={rowSelected}
        onSave={onApprove}
        isLoading={isApproving}
      />

      {/* Modal Assign Level */}
      <ModalComponent
        open={modals.assignLevel}
        toggle={() => toggleModal("assignLevel")(false)}
        title={`Quản lý bổ nhiệm ${selectorValue}`}
        size="xl"
        // @ts-ignore
        Body={<AgentAssignLevel data={rowSelected} refetch={refetch} />}
      />

      {/* Modal Change Manager */}
      <ModalComponent
        open={modals.changeManager}
        toggle={() => toggleModal("changeManager")(false)}
        title={`Quản lý chuyển nhánh ${selectorValue}`}
        size="xl"
        // @ts-ignore
        Body={<AgentChangeManager data={rowSelected} refetch={refetch} />}
      />

      {/* Modal Recruitment Link */}
      <AgentRecruitmentLink
        data={rowSelected}
        open={modals.recruitmentLink}
        toggle={() => toggleModal("recruitmentLink")(false)}
      />
    </>
  );
}
