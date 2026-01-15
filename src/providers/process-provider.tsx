import { ProgressProvider } from '@bprogress/next/app';

export function ProcessProvider({ children }: { children: React.ReactNode }) {
	return (
		<ProgressProvider
			height="4px"
			color="#FF6C00"
			options={{ showSpinner: false }}
			shallowRouting
		>
			{children}
		</ProgressProvider>
	);
}
