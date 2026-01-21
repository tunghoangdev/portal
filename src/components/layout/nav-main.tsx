import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Icons } from "~/components/icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  // Link,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui";
import { ROLES } from "~/constant";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useSidebar } from "~/context";
import { useAuth } from "~/hooks";
import { useIsMobile } from "~/hooks/use-mobile";
import api from "~/lib/api";
import { cn } from "~/lib/utils";

const itemMenuClass = cn(
  "py-2.5 [&>svg]:size-3 text-content2 rounded-sm text-sm flex items-center px-1.5 font-medium hover:bg-[#f4f4f5] hover:text-black h-9",
);
const iconClass = cn(
  "size-4 stroke-[1.2px]",
  "transition-all duration-300 ease-in-out",
  "group-data-[state=collapsed]:mx-1",
  "group-data-[state=expanded]:mr-1.5",
);

type NavItem = {
  icon: keyof typeof Icons;
  label: string;
  name: string;
  url: string;
  isActive?: boolean;
  external?: boolean;
  download?: boolean;
  fileName?: string;
  id_form?: number;
  children: {
    name: string;
    label: string;
    url: string;
    icon: keyof typeof Icons;
    id_form?: number;
    isActive?: boolean;
    external?: boolean;
    download?: boolean;
    fileName?: string;
  }[];
};
interface Props {
  items: NavItem[];
}

export function NavMain({ items }: Props) {
  const { isExpanded, toggleSidebar } = useSidebar();
  const { user, role } = useAuth();
  const isMobile = useIsMobile();

  // Lấy dữ quyền từ React Query cache (đã được fetch ở _authed beforeLoad)
  const { data: formAccess } = useQuery({
    queryKey: [API_ENDPOINTS.permission.getAccessForm, user?.id, role],
    queryFn: async () => {
      return await api.post<any[]>(API_ENDPOINTS.permission.getAccessForm, {
        id: user?.id,
        id_staff: user?.id,
        id_staff_action: user?.id,
        secret_key: user?.secret_key,
        token: user?.token,
        role: role,
      });
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!user?.id && role === ROLES.STAFF,
  });

  const formIds = useMemo(() => {
    return Array.isArray(formAccess)
      ? formAccess.map((item: any) => item.id_form)
      : [];
  }, [formAccess]);

  const location = useLocation();
  const pathname = location.pathname;
  const activeParentName = useMemo(() => {
    const parent = items?.find((item) =>
      item.children.some((child) => child.url === pathname),
    );
    return parent ? parent.name : null;
  }, [items, pathname]);

  const [isOpenMenu, setIsOpenMenu] = useState<string | null>(activeParentName);

  useEffect(() => {
    if (isExpanded && activeParentName) {
      setIsOpenMenu(activeParentName);
    }
    if (!isExpanded) {
      setIsOpenMenu(null);
    }
  }, [isExpanded, activeParentName]);
	let newItems: NavItem[] = useMemo(() => {
		let currentItems = [...items];
		if(role === ROLES.SAMTEK) {
			return currentItems;
		}
		if (user?.life_no <= 0) {
			currentItems = currentItems.filter((item) => item.name !== 'lifeInsurance');
		}
		if (user?.abroad_no <= 0) {
			currentItems = currentItems.filter(
				(item) => !['abroadBusiness', 'emigrant'].includes(item.name),
			);
		}
		if (user?.none_life_no <= 0) {
			currentItems = currentItems.filter(
				(item) => item.name !== 'nonLifeInsurance',
			);
		}

		if (role === ROLES.STAFF) {
			currentItems.push({
				name: 'samStore',
				label: 'Samtek Store',
				url: '/staff/samtek-store',
				icon: 'folder',
				children: [],
				id_form: 10
			})
		}
		return currentItems;
	}, [items, role, user]);
  
  return (
    <SidebarMenu className="gap-y-1">
      {newItems.map((item, index) => {
        const IconComponent = Icons[item.icon];
        const isParentActive = item.children.some(
          (child) => child.url === pathname,
        );
        return (
          <Collapsible
            key={`${item.name}-${index}`}
            asChild
            className={cn("group/collapsible")}
            open={isOpenMenu === item.name}
            onOpenChange={(openParent: boolean) => {
              setIsOpenMenu(openParent ? item.name : null);
            }}
          >
            <SidebarMenuItem className="data-[state=closed]:*:!pl-1">
              {item.children.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.label}
                      className={cn(
                        itemMenuClass,
                        "[&>svg]:size-4 hover:cursor-pointer h-9 group-data-[collapsible=icon]:pl-1! hover:bg-[#f4f4f5]",
                        {
                          "bg-[#f4f4f5] [&>svg]:text-default-900 [&>span]:text-default-900":
                            isParentActive,
                        },
                      )}
                      onClick={() => {
                        if (!isExpanded) toggleSidebar();
                      }}
                    >
                      {IconComponent && <IconComponent className={iconClass} />}
                      <span>{item.label}</span>
                      <Icons.chevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 size-4 text-gray-300" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="gap-y-2 px-0 border-0 pt-2.5 mr-0">
                      {item.children?.map((subItem, k: number) => {
                        const IconComponent = Icons[subItem.icon];
                        const isActive = subItem.url === pathname;
                        return (
                          <SidebarMenuSubItem
                            key={`${subItem.name}-${k}-${subItem.url}`}
                            className="w-full data-[disabled]:hover:cursor-not-allowed"
                            data-disabled={
                              !formIds?.includes(subItem.id_form) &&
                              role === ROLES.STAFF
                            }
                          >
                            <SidebarMenuSubButton
                              asChild
                              className={cn(itemMenuClass, {
                                "bg-secondary text-white [&>svg]:text-white [&>span]:text-white hover:bg-secondary/70":
                                  isActive,
                              })}
                            >
                              <Link
                                to={subItem.url}
                                disabled={
                                  !formIds?.includes(subItem.id_form) &&
                                  role === ROLES.STAFF
                                }
                                onClick={() => {
                                  if (isExpanded && isMobile) {
                                    toggleSidebar();
                                  }
                                }}
                                download={subItem?.download && subItem.fileName}
                              >
                                {IconComponent && (
                                  <IconComponent
                                    size={12}
                                    className={iconClass}
                                  />
                                )}
                                <span>{subItem.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton
                  asChild
                  onClick={() => {
                    if (!open) {
                      toggleSidebar();
                    }
                  }}
                  isActive={isParentActive}
                  className={cn(
                    itemMenuClass,
                    "[&>svg]:size-4 hover:cursor-pointer h-9 data-[state=open]:hover:bg-secondary/80",
                    {
                      "bg-secondary [&>svg]:text-white [&>span]:text-white":
                        item?.url === pathname,
                    },
                  )}
                >
                  <Link
                    to={item.url}
                    disabled={
                      !formIds?.includes(item.id_form) &&
                      role === ROLES.STAFF &&
                      item.id_form !== 0
                    }
                    target={item.external ? "_blank" : "_self"}
                    onClick={() => {
                      if (isExpanded && isMobile) {
                        toggleSidebar();
                      }
                    }}
                  >
                    {IconComponent && <IconComponent className={iconClass} />}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  );
}
