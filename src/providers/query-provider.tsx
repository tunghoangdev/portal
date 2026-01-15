
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						refetchOnMount: false, // Không refetch khi component mount lại
						retry: 1,
						staleTime: 30 * 1000, // 30 giây - giảm từ 5 phút
						gcTime: 5 * 60 * 1000, // 5 phút - thời gian giữ cache
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
}
