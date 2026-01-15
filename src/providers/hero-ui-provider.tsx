import { HeroUIProvider } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';
import { Toaster } from 'sonner';

declare module '@react-types/shared' {
	interface RouterConfig {
		routerOptions: NonNullable<
			Parameters<ReturnType<typeof useRouter>['push']>[1]
		>;
	}
}
export default function NextUiProvider({
	children,
}: { children: React.ReactNode }) {
	const navigate = useNavigate();

	return (
		<HeroUIProvider navigate={router.push} locale="vi">
			<Toaster position="top-right" richColors />
			{children}
		</HeroUIProvider>
	);
}
