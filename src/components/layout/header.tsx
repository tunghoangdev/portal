import type React from "react";
import { Button, SidebarTrigger } from "~/components/ui";
import UserDropdown from "./user-dropdown";
import { Icons } from "~/components/icons";
import { Tooltip } from "@heroui/react";
import { useIsMobile } from "~/hooks/use-mobile";
import RecruitmentQRCode from "~/features/shared/components/recruitment-qrcode";
import { useAuth, useModal } from "~/hooks";
import { ROLES } from "~/constant";
const AppHeader: React.FC = () => {
  const { user, role } = useAuth();
  const isMobile = useIsMobile();
  const { openDetailModal } = useModal();
  const isAgent = role === ROLES.AGENT;
  const handleAction = () => {
    openDetailModal(user, {
      title: "Link tuyển dụng",
      size: "md",
      renderContent: ({ data }: any) => <RecruitmentQRCode data={data} />,
    });
  };
  return (
    <header
      className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10 pb-2 border-b border-gray-200 dark:border-gray-800 mb-5"
      data-sidebar="header"
    >
      <div className="flex items-center justify-between grow gap-x-1.5">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger className="min-w-0 w-auto p-1.5 min-h-0 h-auto" />
          {isAgent && (
            <>
              <Tooltip
                content={
                  user?.is_open
                    ? "Link tuyển dụng đang mở"
                    : "Link tuyển dụng đã khóa"
                }
              >
                <Button
                  color="secondary"
                  size="sm"
                  variant="bordered"
                  isDisabled={!user?.is_open}
                  onPress={handleAction}
                  className="min-w-0 w-auto p-1 md:p-1.5 min-h-0 h-auto"
                  startContent={<Icons.scanQrCode size={isMobile ? 12 : 16} />}
                >
                  {isMobile ? "" : "Link tuyển dụng"}
                </Button>
              </Tooltip>
            </>
          )}
        </div>
        <UserDropdown />
      </div>
    </header>
  );
};

export default AppHeader;
