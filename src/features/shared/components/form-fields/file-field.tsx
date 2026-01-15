import {
	useCallback,
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from 'react';
import { useDropzone } from 'react-dropzone';
import {
	useController,
	FieldValues,
	UseControllerProps,
} from 'react-hook-form'; // Import from RHF

// Định nghĩa các loại file được chấp nhận cho mỗi variant
const ACCEPT_VARIANTS = {
	img: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
	file: {
		'application/*': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'],
		'text/*': ['.txt'],
	},
};

// Props cho component InputUpload
interface InputUploadProps {
	variant?: 'img' | 'file'; // Mặc định 'img'
	preview?: boolean | 'overlay'; // Mặc định true. Thêm 'overlay'
	maxSize?: number; // Kích thước tối đa của file (bytes)
	className?: string; // Class Tailwind cho div chứa
	multiple?: boolean; // Cho phép chọn nhiều file
	dropzoneText?: string; // Văn bản hiển thị trong khu vực dropzone
	uploadPath?: string; // Đường dẫn thư mục upload (dùng cho hàm upload nội bộ)
	onUpload?: (files: File[], uploadPath?: string) => Promise<string[] | void>; // Hàm upload tùy chỉnh
	onFileChange?: (files: File[]) => void; // Callback khi files thay đổi (không phải upload)
}

// Props cho RHF Control (sử dụng Omit để tránh xung đột props)
type InputUploadWithControlProps<TFieldValues extends FieldValues> =
	InputUploadProps & UseControllerProps<TFieldValues>;

// Sử dụng forwardRef để có thể gọi các hàm bên trong component từ bên ngoài nếu cần (ví dụ: trigger upload)
export interface InputUploadRef {
	triggerUpload: () => Promise<string[] | void>;
	clearFiles: () => void;
	getFiles: () => File[];
}

export const InputUpload = forwardRef<
	InputUploadRef,
	InputUploadWithControlProps<FieldValues>
>(
	(
		{
			variant = 'img',
			preview = true, // Default
			maxSize = 5 * 1024 * 1024, // 5MB
			className = '',
			multiple = true,
			dropzoneText = 'Kéo thả hoặc bấm để chọn file',
			uploadPath,
			onUpload, // Hàm upload tùy chỉnh
			onFileChange,
			// Props từ React Hook Form Controller
			name,
			control,
			defaultValue,
			rules,
			...rest
		},
		ref,
	) => {
		const [files, setFiles] = useState<File[]>([]);
		const [previewUrls, setPreviewUrls] = useState<string[]>([]);
		const [isUploading, setIsUploading] = useState(false);
		const [uploadError, setUploadError] = useState<string | null>(null);

		// Tích hợp với React Hook Form nếu 'name' và 'control' được cung cấp
		const {
			field: { onChange: rfhOnChange, value: rfhValue },
			fieldState: { error },
			formState: { isSubmitting },
		} = control && name
			? useController({ name, control, defaultValue, rules })
			: { field: {}, fieldState: {}, formState: {} };

		// Đồng bộ state nội bộ `files` với `rfhValue` từ RHF
		useEffect(() => {
			// Logic đồng bộ hóa cần cẩn thận để tránh loop vô hạn
			// Chỉ cập nhật nếu rfhValue khác với files hiện tại và rfhValue có giá trị
			if (
				rfhValue &&
				Array.isArray(rfhValue) &&
				rfhValue !== files &&
				JSON.stringify(rfhValue) !== JSON.stringify(files)
			) {
				setFiles(rfhValue);
				if (preview && variant === 'img') {
					const currentPreviewUrls = rfhValue.map((file: File) =>
						URL.createObjectURL(file),
					);
					setPreviewUrls(currentPreviewUrls);
				}
			} else if (!rfhValue && files.length > 0) {
				// Nếu rfhValue bị xóa từ bên ngoài (e.g., form.reset())
				clearFiles();
			}
		}, [rfhValue, preview, variant]); // `files` không nên có mặt ở đây để tránh re-render loop

		const handleFileChange = useCallback(
			(newFiles: File[]) => {
				setFiles(newFiles);
				onFileChange?.(newFiles); // Gọi callback onFileChange tùy chỉnh
				rfhOnChange?.(newFiles); // Cập nhật giá trị trong React Hook Form
			},
			[onFileChange, rfhOnChange],
		);

		const onDrop = useCallback(
			(acceptedFiles: File[], fileRejections: any[]) => {
				if (fileRejections.length > 0) {
					alert(
						`Một số file không hợp lệ:\n${fileRejections.map((fr) => `${fr.file.name}: ${fr.errors.map((e: { message: any }) => e.message).join(', ')}`).join('\n')}`,
					);
				}

				const currentFiles = multiple
					? [...files, ...acceptedFiles]
					: acceptedFiles;
				handleFileChange(currentFiles);

				if (preview && variant === 'img') {
					const newUrls = acceptedFiles.map((file) =>
						URL.createObjectURL(file),
					);
					setPreviewUrls((prev) =>
						multiple ? [...prev, ...newUrls] : newUrls,
					);
				}
			},
			[files, multiple, preview, variant, handleFileChange],
		);

		const { getRootProps, getInputProps, isDragActive } = useDropzone({
			onDrop,
			accept: ACCEPT_VARIANTS[variant] as any, // Ép kiểu để phù hợp với type của useDropzone
			maxSize,
			multiple,
		});

		// Hàm upload nội bộ (nếu onUpload không được cung cấp)
		const internalUpload = async (
			filesToUpload: File[],
			uploadFolder?: string,
		): Promise<string[] | void> => {
			if (!filesToUpload.length) {
				console.warn('No files to upload.');
				return [];
			}
			setIsUploading(true);
			setUploadError(null);
			try {
				const formData = new FormData();
				filesToUpload.forEach((file) => formData.append('files', file));
				if (uploadFolder) {
					formData.append('uploadPath', uploadFolder);
				}

				const response = await fetch('/api/upload', {
					// Thay đổi '/api/upload' thành endpoint của bạn
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						`Upload failed: ${errorData.message || response.statusText}`,
					);
				}

				const result = await response.json();
				console.log('Upload result:', result);
				return result.urls; // Trả về URLs của các file đã upload
			} catch (err: any) {
				console.error('Upload error:', err);
				setUploadError(err.message || 'Lỗi khi tải lên file.');
			} finally {
				setIsUploading(false);
			}
		};

		// Hàm public để kích hoạt upload (dùng cho onUpload prop)
		const triggerUpload = useCallback(async (): Promise<string[] | void> => {
			if (onUpload) {
				return await onUpload(files, uploadPath);
			}
			return await internalUpload(files, uploadPath);
		}, [files, uploadPath, onUpload]);

		const clearFiles = useCallback(() => {
			files.forEach(
				(_, i) =>
					preview && variant === 'img' && URL.revokeObjectURL(previewUrls[i]),
			);
			setFiles([]);
			setPreviewUrls([]);
			handleFileChange([]); // Cập nhật cho RHF và onFileChange
		}, [files, preview, variant, previewUrls, handleFileChange]);

		const getFiles = useCallback(() => files, [files]);

		// Expose functions via ref for imperative calls (e.g., from parent component or RHF handleSubmit)
		useImperativeHandle(ref, () => ({
			triggerUpload,
			clearFiles,
			getFiles,
		}));

		const handleRemove = (index: number) => {
			// Revoke URL trước khi xóa khỏi state để tránh lỗi
			if (preview && variant === 'img' && previewUrls[index]) {
				URL.revokeObjectURL(previewUrls[index]);
			}

			const newFiles = files.filter((_, i) => i !== index);
			handleFileChange(newFiles); // Đây sẽ trigger cập nhật lại previewUrls qua effect nếu cần

			if (preview && variant === 'img') {
				setPreviewUrls(previewUrls.filter((_, i) => i !== index));
			}
		};

		const isImageVariant = variant === 'img';
		const isOverlayPreview = preview === 'overlay';

		return (
			<div className={`w-full ${className}`}>
				<div
					{...getRootProps()}
					className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors ${
						isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
					} ${error ? 'border-red-500' : ''}`}
				>
					<input {...getInputProps()} />
					{files.length > 0 ? (
						<div>
							<p className="font-medium">
								{files.length} {isImageVariant ? 'file ảnh' : 'file'} đã chọn
							</p>
							<button
								type="button"
								className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
								onClick={clearFiles}
								disabled={isSubmitting || isUploading}
							>
								Xóa tất cả
							</button>
						</div>
					) : (
						<p>{dropzoneText}</p>
					)}
				</div>

				{error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}

				{/* Conditional rendering based on preview type */}
				{preview && files.length > 0 && (
					<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
						{files.map((file, idx) => (
							<div
								key={idx}
								className="relative group rounded shadow overflow-hidden"
							>
								{/* Image Variant Previews */}
								{isImageVariant ? (
									<>
										<img
											src={previewUrls[idx]}
											alt={`Preview ${idx + 1}`}
											className="max-h-40 w-full object-cover rounded"
										/>
										{isOverlayPreview && (
											<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													type="button"
													className="bg-red-600 text-white rounded-full p-2 text-sm hover:bg-red-700 disabled:opacity-50"
													onClick={() => handleRemove(idx)}
													title="Xóa ảnh"
													disabled={isSubmitting || isUploading}
												>
													Xóa
												</button>
											</div>
										)}
										{!isOverlayPreview && (
											<button
												type="button"
												className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100 transition-opacity"
												onClick={() => handleRemove(idx)}
												title="Xóa ảnh"
												disabled={isSubmitting || isUploading}
											>
												&times;
											</button>
										)}
									</>
								) : (
									// File Variant List
									<div
										className={`p-3 bg-gray-50 flex flex-col justify-between h-full ${isOverlayPreview ? 'items-center text-center' : 'items-start'}`}
									>
										<span className="text-sm font-medium break-all">
											{file.name}
										</span>
										<span className="text-xs text-gray-500">
											{(file.size / 1024).toFixed(2)} KB
										</span>
										{isOverlayPreview && (
											<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													type="button"
													className="bg-red-600 text-white rounded-full p-2 text-sm hover:bg-red-700 disabled:opacity-50"
													onClick={() => handleRemove(idx)}
													title="Xóa file"
													disabled={isSubmitting || isUploading}
												>
													Xóa
												</button>
											</div>
										)}
										{!isOverlayPreview && (
											<button
												type="button"
												className="text-red-500 hover:text-red-700 text-sm mt-2 disabled:opacity-50"
												onClick={() => handleRemove(idx)}
												disabled={isSubmitting || isUploading}
											>
												Xóa
											</button>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				)}

				{isUploading && (
					<p className="text-blue-600 text-sm mt-2">Đang tải lên...</p>
				)}
				{uploadError && (
					<p className="text-red-500 text-sm mt-2">
						Lỗi tải lên: {uploadError}
					</p>
				)}
			</div>
		);
	},
);
