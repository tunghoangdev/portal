import { Card, CardBody, Skeleton } from "~/components/ui";
import { Alert } from "@heroui/react";
import { TreeNode } from "./tree-node";
import { useAgentTree } from "./use-agent-tree";
import { AgentDetailView } from "~/features/shared/components/agent-detail";
import { useAuth, useFilter, useModal } from "~/hooks";
import { PhoneSearchField } from "./phone-search-field";
import { Icons } from "~/components/icons";
import { ROLES } from "~/constant";
export default function PageClient() {
  const { openDetailModal } = useModal();
  const { setFilter } = useFilter();
  const { role } = useAuth();
  const { treeData, isLoadingRoot, agentSearchLoading, handleExpand, control } =
    useAgentTree();

  const handleShowDetail = (node: any) => {
    if (role === ROLES.AGENT) return;
    setFilter("agentId", node?.id);
    openDetailModal(node, {
      title: `Thông tin chi tiết Thành viên: ${node?.agent_name}`,
      renderContent: AgentDetailView,
      modalProps: {
        scrollBehavior: "outside",
        className: "!max-w-[90vw] !w-[90vw]",
      },
    });
  };

  if (isLoadingRoot && !treeData.length)
    return <Skeleton className="h-64 w-full" />;

  return (
    <>
      <div className="mb-2 w-[300px]">
        <PhoneSearchField
          control={control}
          name="phone"
          placeholder="Tìm kiếm theo số điện thoại..."
        />
      </div>
      <Card className="shadow-lg">
        <CardBody>
          {agentSearchLoading ? (
            <div className="flex items-center p-4">Đang tải dữ liệu...</div>
          ) : (
            <>
              {treeData.length > 0 ? (
                treeData.map((node: any) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    onExpand={handleExpand}
                    onClickNode={handleShowDetail}
                  />
                ))
              ) : (
                <Alert
                  color="warning"
                  title={"Không tìm thấy thành viên trong hệ thống!"}
                  hideIconWrapper
                  icon={<Icons.triangle size={16} />}
                  classNames={{
                    base: "mt-2.5 p-1.5 max-w-sm",
                    title: "text-xs",
                    alertIcon: "fill-transparent",
                    iconWrapper: "w-5",
                    mainWrapper: "m-0 ml-1.5",
                  }}
                  variant={"flat"}
                />
              )}
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}
