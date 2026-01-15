import { Link } from '~/components/ui';
import { getFullFtpUrl } from '~/lib/auth';
import React from 'react';
interface Props {
	fileName?: string;
	label?: string;
	extra?: boolean;
}

const FileDowloadCell = ({ fileName, label, extra }: Props) => {
	if (!fileName) return null;
	const url = extra ? fileName : getFullFtpUrl('document', fileName);
	return (
		<Link
			href={url}
			target="_blank"
			rel="noreferrer"
			className="text-xs text-decoration-underline text-secondary italic"
		>
			{label}
		</Link>
	);
};

FileDowloadCell.displayName = 'FileDowloadCell';

const FileDownloadRevoCell = (
	h: any,
	{props}: {props: {fileName?: string; label?: string; extra?: boolean;}}
) => {
	const { fileName, label, extra } = props;
	if (!fileName) return null;
	const url = extra ? fileName : getFullFtpUrl('document', fileName);
	return h(
		'a',
		{
			href: url,
			target: '_blank',
			rel: 'noreferrer',
			class: 'text-xs underline text-secondary italic',
		},
		label || fileName,
	);
};
export { FileDowloadCell, FileDownloadRevoCell };
