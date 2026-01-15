import { cn } from '~/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
	className,
	rounded = 'md',
	...props
}) => {
	return (
		<div
			className={cn(
				'animate-pulse bg-gray-200 dark:bg-gray-700',
				{
					'rounded-none': rounded === 'none',
					'rounded-sm': rounded === 'sm',
					'rounded-md': rounded === 'md',
					'rounded-lg': rounded === 'lg',
					'rounded-xl': rounded === 'xl',
					'rounded-2xl': rounded === '2xl',
					'rounded-full': rounded === 'full',
				},
				className,
			)}
			{...props}
		/>
	);
};
