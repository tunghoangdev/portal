import { MyImage, Sidebar, SidebarContent, SidebarHeader } from '~/components/ui';
import { cn } from '@heroui/react';
import { MENU_SETTINGS } from '~/constant/site-menu';
import { ROLES } from '~/constant';
import { useAuth } from '~/hooks';
import { NavMain } from './nav-main';
import { CompanyName } from './company-name';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { role, user } = useAuth();
	const userMenus: any = MENU_SETTINGS?.[(role as string) || ROLES.AGENT];
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="flex flex-row items-center justify-start py-5 px-0">
			{role !== ROLES.SAMTEK ? (
				<CompanyName company={user?.company_name} />
			) : (
				<>
					<MyImage 
					src="/images/logo-icon.png" 
					alt="Logo Icon" 
					className={cn(
						"w-12 h-12 transition-all duration-300",
						"group-data-[state=collapsed]:opacity-100 group-data-[state=collapsed]:block",
						"group-data-[state=expanded]:opacity-0 group-data-[state=expanded]:hidden"
					)}
					width={48} 
					height={48} 
				/>
			<MyImage 
				src="/images/logo.png" 
				alt="Logo Full" 
				className={cn(
					"h-12 w-auto transition-all duration-300",
					"group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:hidden",
					"group-data-[state=expanded]:opacity-100 group-data-[state=expanded]:block"
				)}
				width={120} 
				height={48} 
			/>
				</>
			)}
		</SidebarHeader>
			<SidebarContent className="border-none overflow-x-hidden">
				<NavMain items={userMenus || []} />
			</SidebarContent>
		</Sidebar>
	);
}
