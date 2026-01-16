import { useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Icons } from "~/components/icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Link,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui";
import { ROLES } from "~/constant";
import { useSidebar } from "~/context";
import { useAuth, useCommon } from "~/hooks";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
const itemMenuClass = cn(
  "py-2.5 [&>svg]:size-3 text-content2 rounded-sm text-sm flex items-center px-1.5 font-medium hover:bg-[#f4f4f5] hover:text-black h-9"
);
const iconClass = cn(
  "size-4 stroke-[1.2px]",
  "transition-all duration-300 ease-in-out",
  "group-data-[state=collapsed]:mx-1",
  "group-data-[state=expanded]:mr-1.5"
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
  const { formIds } = useCommon();
  const location = useLocation();
  const pathname = location.pathname;
  const activeParentName = useMemo(() => {
    const parent = items?.find((item) =>
      item.children.some((child) => child.url === pathname)
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

  // let newItems: NavItem[] = useMemo(() => {
  // 	let items2 = [...items];
  // 	if (role === ROLES.AGENT) {
  // 		// items2.splice(1, 0, fwdObj);
  // 		items2.splice(1, 0, fwdObj, bivObj);
  // 		if (user?.econtract_data_pdf) {
  // 			const newLink: string = downloadFileObject(
  // 				user.econtract_data_pdf,
  // 				'Hop_dong_dien_tu.pdf',
  // 				'link',
  // 			) as string;
  // 			const newItem: NavItem = {
  // 				name: 'econtract_data_pdf',
  // 				label: 'Tải hợp đồng điện tử',
  // 				url: newLink,
  // 				icon: 'file',
  // 				children: [],
  // 				download: true,
  // 				fileName: 'Hop_dong_dien_tu.pdf',
  // 			};

  // 			const updatedItems2 = items2.map((item) => {
  // 				if (item.name === 'member') {
  // 					const newChildren = [...item.children, newItem];
  // 					return {
  // 						...item,
  // 						children: newChildren,
  // 					};
  // 				}
  // 				return item;
  // 			});
  // 			items2 = [...updatedItems2];
  // 			// items2.splice(index, 0, newItem);
  // 		}
  // 		if (user?.econtract_option_data_pdf) {
  // 			const newLink: string = downloadFileObject(
  // 				user.econtract_option_data_pdf,
  // 				'Hop_dong_lua_chon.pdf',
  // 				'link',
  // 			) as string;
  // 			const newItem: NavItem = {
  // 				name: 'option_contract_pdf',
  // 				label: 'Tải hợp đồng lựa chọn',
  // 				url: newLink,
  // 				icon: 'file',
  // 				children: [],
  // 				download: true,
  // 				fileName: 'Hop_dong_lua_chon.pdf',
  // 			};

  // 			const updatedItems2 = items2.map((item) => {
  // 				if (item.name === 'member') {
  // 					const newChildren = [...item.children, newItem];
  // 					return {
  // 						...item,
  // 						children: newChildren,
  // 					};
  // 				}
  // 				return item;
  // 			});
  // 			items2 = [...updatedItems2];
  // 		}
  // 	}
  // 	//
  // 	return items2;
  // }, [items]);
  // let newItems: NavItem[] = useMemo(() => {
  // 	let currentItems = [...items];
  // 	if (role === 'samtek') {
  // 		return currentItems.filter((item) => item.name === 'samtek-staffs');
  // 	}
  // 	// if (role === ROLES.AGENT) {
  // 	// 	const fwdObj: NavItem = {
  // 	// 		name: 'domain_fwd',
  // 	// 		label: 'Bảng minh họa FWD',
  // 	// 		url: user?.domain_fwd,
  // 	// 		icon: 'folder',
  // 	// 		children: [],
  // 	// 		external: true,
  // 	// 	};

  // 	// 	const bivObj: NavItem = {
  // 	// 		name: 'domain_bhv',
  // 	// 		label: ' Bán hàng Hùng Vương',
  // 	// 		url: user?.domain_bhv,
  // 	// 		icon: 'folder',
  // 	// 		children: [],
  // 	// 		external: true,
  // 	// 	};
  // 	// 	currentItems.splice(1, 0, fwdObj, bivObj);
  // 	// 	const contractItemsToInsert: NavItem[] = [];
  // 	// 	if (user?.econtract_data_pdf) {
  // 	// 		// 2. Tạo Item cho Hợp đồng Điện tử (nếu có)
  // 	// 		const newLink: string = downloadFileObject(
  // 	// 			user.econtract_data_pdf,
  // 	// 			'Hop_dong_dien_tu.pdf',
  // 	// 			'link',
  // 	// 		) as string;

  // 	// 		contractItemsToInsert.push({
  // 	// 			name: 'econtract_data_pdf',
  // 	// 			label: 'Tải hợp đồng hợp tác',
  // 	// 			url: newLink,
  // 	// 			icon: 'file',
  // 	// 			children: [],
  // 	// 			download: true,
  // 	// 			fileName: 'Hop_dong_dien_tu.pdf',
  // 	// 		});
  // 	// 	}

  // 	// 	if (user?.econtract_option_data_pdf) {
  // 	// 		// 3. Tạo Item cho Hợp đồng Lựa chọn (nếu có)
  // 	// 		const newLink: string = downloadFileObject(
  // 	// 			user.econtract_option_data_pdf,
  // 	// 			'Hop_dong_lua_chon.pdf',
  // 	// 			'link',
  // 	// 		) as string;

  // 	// 		contractItemsToInsert.push({
  // 	// 			name: 'option_contract_pdf',
  // 	// 			label: 'Tải hợp đồng kinh doanh',
  // 	// 			url: newLink,
  // 	// 			icon: 'file',
  // 	// 			children: [],
  // 	// 			download: true,
  // 	// 			fileName: 'Hop_dong_kinh_doanh_chon.pdf',
  // 	// 		});
  // 	// 	}

  // 	// 	if (contractItemsToInsert.length > 0) {
  // 	// 		currentItems = currentItems.map((item) => {
  // 	// 			if (item.name === 'member') {
  // 	// 				const newChildren = [...item.children, ...contractItemsToInsert];
  // 	// 				return {
  // 	// 					...item,
  // 	// 					children: newChildren,
  // 	// 				};
  // 	// 			}
  // 	// 			return item;
  // 	// 		});
  // 	// 	}
  // 	// }

  // 	return currentItems;
  // }, [items, role, user]);
  return (
    <SidebarMenu className="gap-y-1">
      {items.map((item, index) => {
        const IconComponent = Icons[item.icon];
        const isParentActive = item.children.some(
          (child) => child.url === pathname
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
                        }
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
                                href={subItem.url}
                                isDisabled={
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
                    }
                  )}
                >
                  <Link
                    href={item.url}
                    isDisabled={
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
