import { HeroUIProvider } from "@heroui/react";
import { NavigateOptions, ToOptions, useRouter } from "@tanstack/react-router";
import { Toaster } from "sonner";
declare module "@react-types/shared" {
  interface RouterConfig {
    href: ToOptions["to"];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}
export default function NextUiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let router = useRouter();
  return (
    <HeroUIProvider
      navigate={(to, options) => router.navigate({ to, ...options })}
      useHref={(to) => router.buildLocation({ to }).href}
      locale="vi"
    >
      <Toaster position="top-right" richColors />
      {children}
    </HeroUIProvider>
  );
}
