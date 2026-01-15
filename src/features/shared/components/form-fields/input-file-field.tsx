import { Icons } from '~/components/icons';
import { Button, Stack } from '~/components/ui';
import { ERROR_CODES } from '~/constant';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud } from '~/hooks/use-crud-v2';
import { getFullFtpUrl } from '~/lib/auth';
import { cn } from '~/lib/utils';
import { FC, useCallback, useEffect, useState } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

const MAX_FILE_SIZE_MB = 10 * 1024 * 1024; // 10MB limit
const MAX_FILE_SIZE_LIMIT = 10; // 10MB limit

export type UploadType = 'notify' | 'file' | 'avatar' | 'cccd' | 'doc' | string;

type InputUploadProps = DropzoneOptions & {
	onChange?: (files: any) => void;
	preview?: boolean;
	className?: string;
	multiple?: boolean;
	path?: string;
	value?: string | string[];
	type?: UploadType;
	variant?: 'img' | 'file';
	onUpload?: (files: File[]) => Promise<any>;
	error?: any
};

const PATH_UPLOAD: any = {
	notify: API_ENDPOINTS.upload.imageNotify,
	file: API_ENDPOINTS.upload.file,
	avatar: API_ENDPOINTS.upload.avatar,
	cccd: API_ENDPOINTS.upload.cccd,
	doc: API_ENDPOINTS.upload.file,
};

// Component phụ để render khi đang tải
const LoadingState = () => (
	<div className="animate-pulse flex flex-col items-center">
		<div className="w-8 h-8 bg-blue-100 rounded-full animate-spin border-2 border-blue-500 border-t-transparent" />
		<span className="mt-3 text-sm text-gray-500">Đang tải lên...</span>
	</div>
);

// Component phụ để render khi không có file
const EmptyState = ({ variant }: { variant: 'img' | 'file' }) => (
	<Stack direction={'col'} alignItems={'center'} justifyContent={'center'}>
		{variant === 'img' ? (
			<>
				<Icons.uploadClound className="text-gray-400 mb-2" size={24} />
				<span className="text-sm font-medium text-gray-600">Chọn hình ảnh</span>
				<span className="text-xs text-gray-400 mt-1">
					PNG, JPG (tối đa {MAX_FILE_SIZE_LIMIT}MB)
				</span>
			</>
		) : (
			<>
				<Stack alignItems={'center'} className="gap-2">
					<Icons.link className="text-blue-500" size={24} />
					<span className="text-sm font-medium text-blue-500">Chọn tệp</span>
				</Stack>
				<span className="text-xs text-gray-400 mt-1">
					.PDF (tối đa {MAX_FILE_SIZE_LIMIT}MB)
				</span>
			</>
		)}
	</Stack>
);
const PreviewState = ({
	urls,
	variant,
	type,
	onRemove,
}: {
	urls: string[];
	variant: 'img' | 'file';
	type: UploadType;
	onRemove: (idx: number) => void;
}) => (
	<div className="absolute top-0 left-0 right-0 shadow-sm bottom-0 z-10 flex items-center justify-center">
		{urls.map((url, idx) => {
			if (!url) return null;
			return (
				<Stack
					key={idx}
					className="relative group w-full h-full overflow-hidden"
					justifyContent={'between'}
				>
					{variant === 'img' ? (
						<div className="relative w-full min-h-40">
							<img
								src={getFullFtpUrl(type, url)}
								alt={url}
								className="max-h-40 w-full object-cover rounded"
							/>
						</div>
					) : (
						<Stack
							alignItems={'center'}
							className="gap-x-1 w-full p-2.5 min-h-10"
						>
							<Icons.file size={22} strokeWidth={1} />
							<span className="text-xs font-medium text-blue-600 truncate">
								{url}
							</span>
						</Stack>
					)}

					<Button
						className="absolute z-50 top-1 right-1 text-red-500 min-h-0 h-auto min-w-0 w-auto p-1.5"
						onClick={() => onRemove(idx)}
						variant="light"
						isIconOnly
						title="Xóa ảnh"
					>
						<Icons.trash size={14} />
					</Button>
				</Stack>
			);
		})}
	</div>
);
const renderContent = (
	isLoading: boolean,
	previewUrls: string[],
	variant: 'img' | 'file',
	type: UploadType,
	handleRemove: (idx: number) => void,
) => {
	if (isLoading) return <LoadingState />;
	if (previewUrls.length > 0)
		return (
			<PreviewState
				urls={previewUrls}
				variant={variant}
				onRemove={handleRemove}
				type={type}
			/>
		); // Component mới cho trạng thái preview
	return <EmptyState variant={variant} />;
};
export const InputUpload: FC<InputUploadProps> = ({
	onChange,
	preview = true,
	className = '',
	accept = { 'image/*': [] },
	maxSize = MAX_FILE_SIZE_MB,
	multiple,
	type = 'notify',
	variant = 'img',
	value,
	onUpload,
	error
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [files, setFiles] = useState<File[]>([]);
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);
	const [basePath, setBasePath] = useState(PATH_UPLOAD[type]);
	const { uploadFile } = useCrud([basePath], {
		endpoint: '',
	});
	useEffect(() => {
		if (type) setBasePath(PATH_UPLOAD[type]);
	}, [type]);

	useEffect(() => {
		if (value) {
			if (Array.isArray(value)) {
				setPreviewUrls(value);
			} else if (typeof value === 'string') {
				setPreviewUrls([value]);
			}
		} else {
			setPreviewUrls([]);
		}
	}, [value]);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			// Update local state and trigger onChange for RHF
			// const newFiles = multiple ? [...files, ...acceptedFiles] : acceptedFiles;
			// setFiles(newFiles);
			// onChange?.(newFiles);

			// if (preview) {
			// 	const newUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
			// 	setPreviewUrls((prev) => (multiple ? [...prev, ...newUrls] : newUrls));
			// }

			// --- Start of new logic ---
			setIsLoading(true);
			setErrorMsg('');

			try {
				const uploadedUrls: any[] = [];
				if (onUpload) {
					await onUpload(acceptedFiles);
				} else {
					for (const file of acceptedFiles) {
						const res: any = await uploadFile(file);
						if (res?.status === 2 || !res) {
							setErrorMsg(ERROR_CODES?.[res?.code] as string);
							return;
						}
						if (res?.url || res) uploadedUrls.push(res?.url || res);
					}
					setFiles(uploadedUrls);
					setPreviewUrls((prev) =>
						multiple ? [...prev, ...uploadedUrls] : uploadedUrls,
					);
					const currentValues = Array.isArray(value)
						? value
						: value
						? [value]
						: [];
					const newValues = multiple
						? [...currentValues, ...uploadedUrls]
						: uploadedUrls[0];
					onChange?.(newValues);
				}
			} catch (error) {
				setErrorMsg('Lỗi tải lên, vui lòng thử lại.');
				console.error('Upload error:', error);
			} finally {
				setIsLoading(false);
			}
			// --- End of new logic ---
		},
		[onChange, preview, files, multiple, onUpload, uploadFile, value],
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: variant === 'img' ? accept : { 'application/pdf': ['.pdf'] },
		maxSize,
		multiple,
	});

	const handleRemove = (index: number) => {
		const newFiles = files.filter((_, i) => i !== index);
		setFiles(newFiles);

		const newUrls = previewUrls.filter((_, i) => i !== index);
		if (preview) {
			const urlToRevoke = previewUrls[index];
			URL.revokeObjectURL(urlToRevoke);
			setPreviewUrls(newUrls);
		}

		if (multiple) {
			onChange?.(newUrls);
		} else {
			onChange?.(newUrls.length > 0 ? newUrls[0] : '');
		}
	};

	return (
		<div className={`w-full ${className}`}>
			<div
				{...getRootProps()}
				className={cn(
					`relative rounded p-4 text-center transition-colors ${
						isDragActive
							? 'border-blue-500 bg-blue-50'
							: error
							? 'border-danger'
							: 'border-gray-300'
					}`,
					isLoading ? 'opacity-50 cursor-not-allowed' : '',
					preview && previewUrls.length
						? 'border-1 border-gray-300 overflow-hidden rounded-lg'
						: 'border-2 border-dashed cursor-pointer',
					variant === 'img' ? 'min-h-40' : 'min-h-14',
				)}
			>
				{!preview || previewUrls.length === 0 ? (
					<input {...getInputProps()} />
				) : null}
				{errorMsg ? (
					<span className="text-danger">{errorMsg}</span>
				) : (
					renderContent(isLoading, previewUrls, variant, type, handleRemove)
				)}
			</div>
			{error && <span className="text-danger text-xs mt-1">{error.message}</span>}
		</div>
	);
};
export const FileField: FC<
	Omit<InputUploadProps, 'onChange'> & {
		name: Path<FieldValues>;
		label?: string;
		control?: Control<FieldValues>;
		isRequired?: boolean;
	}
> = ({ name, control, label, isRequired, ...props }) => {
	if (!control) {
		return <InputUpload {...props} />;
	}
	const displayLabel = (
		<>
			{label}
			{isRequired && label && <span className={'text-danger ml-1'}>*</span>}
		</>
	);
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				return (
					<>
						{label && (
							<label
								htmlFor={name}
								className="text-default-800 text-sm font-semibold"
							>
								{displayLabel}
							</label>
						)}
						<InputUpload
							{...props}
							value={field.value}
							onChange={(files) => field.onChange(files)}
							error={fieldState.error}
						/>
					</>
				);
			}}
		/>
	);
};
