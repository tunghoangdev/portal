import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useSidebar } from "~/context";
import { Icons } from "~/components/icons";
import { MENU_SETTINGS } from "~/constant/site-menu";
import { cn } from "@heroui/react";
import { ROLES } from "~/constant";
import { useAuth } from "~/hooks";
import { Link } from "@tanstack/react-router"; // Use TanStack Link instead of next/link helper if it exists

type NavItem = {
  icon: keyof typeof Icons;
  label: string;
  name: string;
  url: string;
  children: {
    name: string;
    label: string;
    url: string;
    icon: keyof typeof Icons;
  }[];
};

const AppSidebar: React.FC = () => {
  const { role } = useAuth();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const userMenus: any = MENU_SETTINGS?.[(role as string) || ROLES.AGENT];
  const location = useLocation();
  const pathname = location.pathname;
  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul
      className={cn(
        "flex flex-col gap-y-1.5",
        "[&_.menu-item]:flex [&_.menu-item]:items-center [&_.menu-item]:w-full",
        "[&_.menu-item-active]:bg-secondary [&_.menu-item-active]:*:text-white",
        "[&_.menu-item-active-btn]:bg-[#f4f4f5]",
        "[&_.menu-dropdown-item-active]:bg-secondary [&_.menu-dropdown-item-active]:text-white"
      )}
    >
      {navItems.map((nav, index) => {
        const IconComponent = Icons[nav.icon];
        if (!IconComponent) {
          console.error(`Icon "${nav.icon}" không tồn tại trong Icons`);
          return null;
        }
        return (
          <li
            key={nav.name}
            // className="group-hover:bg-gray-400 group-hover:text-white"
          >
            {nav.children.length ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={cn(
                  `menu-item group px-1.5 py-2.5 font-medium hover:bg-[#f4f4f5] hover:text-black rounded-sm ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index &&
                    "menu-item-active-btn"
                  } cursor-pointer ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`
                )}
              >
                <IconComponent className="w-4 h-4 mr-1.5" />
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={"menu-item-text text-content2 text-sm"}>
                    {nav.label}
                  </span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <Icons.chevronRight
                    className={`ml-auto w-4 h-4 transition-transform duration-200 text-gray-300 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-90 text-gray-400"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.url && (
                <Link
                  to={nav.url}
                  className={`menu-item group px-1.5 py-2.5 !text-default-800 font-medium hover:bg-[#f4f4f5] hover:text-black rounded-sm ${
                    isActive(nav.url)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-1.5" />
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={"menu-item-text text-content2 text-sm"}>
                      {nav.label}
                    </span>
                  )}
                </Link>
              )
            )}
            {nav.children && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 gap-y-2 ml-5 flex flex-col">
                  {nav.children.map((subItem) => {
                    const IconSubComponent = Icons[subItem.icon];
                    if (!IconSubComponent) {
                      console.error(
                        `Icon "${nav.icon}" không tồn tại trong Icons`
                      );
                      return null;
                    }
                    return (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.url}
                          className={`menu-dropdown-item text-content2 rounded-sm text-sm flex items-center px-1.5 py-2.5 font-medium hover:bg-[#f4f4f5] hover:text-black ${
                            isActive(subItem.url)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          <IconSubComponent className="w-3 h-3 mr-1.5" />
                          {subItem.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 pl-5 left-0 dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50  
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <h4 className="text-2xl font-bold">
              PORTALX
              {/* <Image
								className="dark:hidden"
								src="/images/logo/logo.svg"
								alt="Logo"
								width={150}
								height={40}
							/>
							<Image
								className="hidden dark:block"
								src="/images/logo/logo-dark.svg"
								alt="Logo"
								width={150}
								height={40}
							/> */}
            </h4>
          ) : (
            <h4 className="text-2xl font-bold">
              PX
              {/* <Image
								className="dark:hidden"
								src="/images/logo/logo.svg"
								alt="Logo"
								width={150}
								height={40}
							/>
							<Image
								className="hidden dark:block"
								src="/images/logo/logo-dark.svg"
								alt="Logo"
								width={150}
								height={40}
							/> */}
            </h4>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* <div>
							<h2
								className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
									!isExpanded && !isHovered
										? "lg:justify-center"
										: "justify-start"
								}`}
							>
								{isExpanded || isHovered || isMobileOpen ? (
									"Menu"
								) : (
									<Icons.horizontalThreeDots />
								)}
							</h2>
							{renderMenuItems(agentMenus, "main")}
						</div> */}
            {renderMenuItems(userMenus, "main")}
            {/* <div className="">
							<h2
								className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
									!isExpanded && !isHovered
										? "lg:justify-center"
										: "justify-start"
								}`}
							>
								{isExpanded || isHovered || isMobileOpen ? (
									"Others"
								) : (
									<Icons.horizontalThreeDots />
								)}
							</h2>
							{renderMenuItems(agentMenus, "others")}
						</div> */}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
