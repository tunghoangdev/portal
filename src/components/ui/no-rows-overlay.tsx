import type { FC } from 'react';
import { Stack, Typography } from '~/components/ui';
import { Icons } from '~/components/icons/icons';
import { cn } from '~/lib/utils';

interface Props {
	title?: string;
	isFile?: boolean;
	className?: string;
}

const NoRowsOverlay: FC<Props> = ({ title, isFile, className }) => {
	return (
		<Stack
			alignItems={'center'}
			justifyContent={'center'}
			direction="col"
			className={cn(className)}
		>
			{!isFile ? (
				<Icons.emptyData
					stroke="#aeb8c2"
					fill="none"
					size={64}
					width={64}
					height={64}
				/>
			) : (
				<Icons.file
					className="file-icon"
					size={76}
					strokeWidth={1}
					stroke="#aeb8c2"
				/>
			)}
			{title ? (
				<Typography variant="body2r" color={'black30'}>
					{title}
				</Typography>
			) : null}
		</Stack>
	);
};

export default NoRowsOverlay;
