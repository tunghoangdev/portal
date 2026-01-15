import { useRef, useState, useEffect } from 'react';
import { Button } from './button';
import { cn } from '~/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const clampClasses: any = {
	1: 'line-clamp-1',
	2: 'line-clamp-2',
	3: 'line-clamp-3',
	4: 'line-clamp-4',
	5: 'line-clamp-5',
};

type Props = {
	content: string;
	line?: number;
	classNames?: {
		base?: string;
		button?: string;
	};
	endText?: string;
	expandText?: string;
	collapseText?: string;
};
const btnClasses = 'mt-1 min-w-0 w-auto min-h-0 h-auto text-xs px-0';
export const TextWithClamp = ({
	content,
	line,
	endText = '...',
	classNames,
	expandText,
	collapseText,
}: Props) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const [isClamped, setIsClamped] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	useEffect(() => {
		if (contentRef.current) {
			setIsClamped(
				contentRef.current.scrollHeight > contentRef.current.clientHeight,
			);
		}
	}, [content]);

	const handleToggle = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div>
			<div
				ref={contentRef}
				className={cn(
					`
          ${clampClasses[line || 2]}
          overflow-hidden
        `,
					classNames?.base,
				)}
				dangerouslySetInnerHTML={{
					__html: `${content} ${isClamped ? endText : ''}`,
				}}
			/>

			{isClamped && (
				<Popover placement="bottom" showArrow={true}>
					<PopoverTrigger>
						<Button
							variant="light"
							size="sm"
							color="secondary"
							className={cn(btnClasses, classNames?.button)}
						>
							{expandText || 'Xem thêm'}
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<div
							className="px-1 py-2 max-w-xl"
							dangerouslySetInnerHTML={{
								__html: content,
							}}
						/>
					</PopoverContent>
				</Popover>
			)}

			{/* {isExpanded && (
				<Button
					onPress={handleToggle}
					variant="light"
					size="sm"
					color="secondary"
					className={cn(btnClasses, classNames?.button)}
				>
					{collapseText || 'Thu gọn'}
				</Button>
			)} */}
		</div>
	);
};
