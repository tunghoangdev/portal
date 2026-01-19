/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import "@fontsource-variable/montserrat";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { SidebarProvider, ThemeProvider } from "~/context";
import AuthGuard from "~/features/auth/auth-guard";
import { MediaQueryProvider, NextUiProvider, QueryProvider } from "~/providers";
import { ProcessProvider } from "~/providers/process-provider";
import { QueryClient } from "@tanstack/react-query";
import type { AuthState } from "~/stores/auth-store";
import appCss from "~/styles/main.css?url";
import { seo } from "~/utils/seo";

export const Route = createRootRouteWithContext<{
  auth: AuthState;
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Samtek - Nâng tầm kênh phân phối",
        description: `Samtek Portal là nền tảng công nghệ số hóa kênh phân phối, tối ưu chi phí và hiệu suất bán hàng từ nhóm nhỏ đến doanh nghiệp, linh hoạt mọi lĩnh vực.`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
        <meta name="google" content="notranslate" />
      </head>
      <body className="font-montserrat">
       <NextUiProvider>
					<ThemeProvider>
						<QueryProvider>
							<MediaQueryProvider>
								<AuthGuard>
								<ProcessProvider>
									<SidebarProvider>{children}</SidebarProvider>
								</ProcessProvider>
								</AuthGuard>
							</MediaQueryProvider>
						</QueryProvider>
					</ThemeProvider>
				</NextUiProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
