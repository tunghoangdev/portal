import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { ToolbarAction } from '~/types/data-table-type';
import type z from 'zod';
import { create } from 'zustand';
import { useMemo } from 'react';
import { ModalProps } from '~/components/ui';

export type ModalType = 'form' | 'detail' | 'confirm'; // Thêm các loại khác nếu cần

// Định nghĩa cấu hình cơ bản cho mọi loại modal
interface BaseModalConfig {
	id: string;
	title?: string;
	size?: ModalProps['size'];
	isExport?: boolean;
	onClose?: (id?: string) => void;
	modalProps?: Omit<
		ModalProps,
		'isOpen' | 'onClose' | 'title' | 'size' | 'children'
	>;
	isLoading?: boolean;
}

// Cấu hình cụ thể cho FormModal
export interface FormModalPayload<
	TItem,
	TExport,
	TCombined extends FieldValues,
> {
	action: ToolbarAction; // add, edit, export-excel
	formData: TItem | TExport | null;
	itemSchema?: z.ZodObject<any>;
	renderFormContent?: React.ComponentType<{
		action: ToolbarAction;
		control: UseFormReturn<TCombined>['control'];
		formMethods: UseFormReturn<TCombined>;
	}>;
	isLoading?: boolean;
	isExport?: boolean;
	onItemSubmit?: (values: TItem, action: ToolbarAction) => Promise<void>;
	onExportSubmit?: (values: TExport) => void;
	onFormSubmitSuccess?: () => void;
	// ... các props riêng của FormModal (isEditMode, isExport, submitLabel, etc.)
}

// Cấu hình cụ thể cho DetailModal
export interface DetailModalPayload<TDetailData> {
	data: TDetailData; // Dữ liệu để hiển thị
	renderContent?: React.ComponentType<{ data: TDetailData }>; // Component để render nội dung chi tiết
	tableColumns?: any[]; // Cấu hình cột cho DataTable
	tableOptions?: {
		enabled: boolean;
		endpoint?: string;
		[key: string]: any;
	}; // Các tùy chọn khác cho DataTable (ví dụ: isPagination = false)
	detailUrl?: string;
}

// Cấu hình cho ConfirmModal (ví dụ đơn giản)
export interface ConfirmModalPayload {
	message: string;
	onConfirm: () => void;
	confirmLabel?: string;
	cancelLabel?: string;
}

// Kết hợp tất cả các loại payload vào một union type
export type ModalPayload<
	TItem,
	TExport,
	TCombined extends FieldValues,
	TDetailData,
> =
	| { type: 'form'; payload: FormModalPayload<TItem, TExport, TCombined> }
	| { type: 'detail'; payload: DetailModalPayload<TDetailData> }
	| { type: 'confirm'; payload: ConfirmModalPayload };

// Cập nhật ModalInstanceConfig để chứa union type của payload
export interface ModalInstanceConfig<
	TItem,
	TExport,
	TCombined extends FieldValues,
	TDetailData,
> extends BaseModalConfig {
	type: ModalType;
	payload: ModalPayload<TItem, TExport, TCombined, TDetailData>['payload'];
}

// Cập nhật FormModalState để quản lý stack các ModalInstanceConfig
interface FormModalState<
	TItem,
	TExport,
	TCombined extends FieldValues,
	TDetailData,
> {
	modalStack: ModalInstanceConfig<TItem, TExport, TCombined, TDetailData>[];
	openFormModal: (
		action: ToolbarAction,
		item?: TItem | TExport,
		config?: Omit<FormModalPayload<TItem, TExport, TCombined>, 'action'> &
			Omit<BaseModalConfig, 'id' | 'onClose'>,
	) => void;

	openDetailModal: (
		data: TDetailData,
		config: Omit<DetailModalPayload<TDetailData>, 'data'> &
			Omit<BaseModalConfig, 'id' | 'onClose'> & {
				detailUrl?: string;
				tableColumns?: any[];
				tableOptions?: any;
			},
	) => void;

	openConfirmModal: (
		config: Omit<ConfirmModalPayload, ''> &
			Omit<BaseModalConfig, 'id' | 'onClose'>,
	) => void;

	closeModal: (id?: string) => void;
	getCurrentModalConfig: () =>
		| ModalInstanceConfig<TItem, TExport, TCombined, TDetailData>
		| undefined;
}

// Cập nhật Zustand store actions
export const useFormModalStore = create<FormModalState<any, any, any, any>>(
	(set, get) => ({
		modalStack: [],
		// Hàm mở FormModal
		openFormModal: (action, config) => {
			set((state) => {
				const {
					itemSchema,
					formData,
					renderFormContent,
					size,
					title,
					// action,
					isExport,
					onItemSubmit,
					onExportSubmit,
					onFormSubmitSuccess,
					modalProps,
					isLoading,
				} = config || {};

				const newModal: ModalInstanceConfig<any, any, any, any> = {
					id: Math.random().toString(36).substring(2, 9),
					type: 'form',
					title,
					size,
					modalProps,
					payload: {
						isExport,
						action,
						isLoading,
						formData: formData || null,
						itemSchema,
						renderFormContent,
						onItemSubmit,
						onExportSubmit,
						onFormSubmitSuccess,
					},
				};
				return { modalStack: [...state.modalStack, newModal] };
			});
		},
		// Hàm mở DetailModal
		openDetailModal: (data, config) => {
			set((state) => {
				const {
					detailUrl,
					tableColumns,
					tableOptions,
					renderContent,
					size,
					title,
					modalProps,
				} = config;
				const newModal: ModalInstanceConfig<any, any, any, any> = {
					id: Math.random().toString(36).substring(2, 9),
					type: 'detail',
					title,
					size,
					modalProps,
					payload: {
						data,
						renderContent,
						detailUrl,
						tableColumns,
						tableOptions,
					},
				};
				return { modalStack: [...state.modalStack, newModal] };
			});
		},

		// Hàm mở ConfirmModal
		openConfirmModal: (config) => {
			set((state) => {
				const {
					message,
					onConfirm,
					confirmLabel,
					cancelLabel,
					modalProps,
					title,
					size,
				} = config;
				const newModal: ModalInstanceConfig<any, any, any, any> = {
					id: Math.random().toString(36).substring(2, 9),
					type: 'confirm',
					title,
					size,
					modalProps,
					payload: {
						message,
						onConfirm,
						confirmLabel,
						cancelLabel,
					},
				};
				return { modalStack: [...state.modalStack, newModal] };
			});
		},

		closeModal: (id) => {
			set((state) => {
				if (id) {
					return {
						modalStack: state.modalStack.filter((modal) => modal.id !== id),
					};
				}
				const newStack = [...state.modalStack];
				newStack.pop();
				return { modalStack: newStack };
			});
		},

		getCurrentModalConfig: () => {
			const { modalStack } = get();
			return modalStack.length > 0
				? modalStack[modalStack.length - 1]
				: undefined;
		},
	}),
);

// useFormModalConfig sẽ được đổi tên thành useModalStackConfig và trở nên chung hơn
export const useModalStackConfig = <
	TItem,
	TExport,
	TCombined extends FieldValues,
	TDetailData,
>() => {
	const currentModalConfig = useFormModalStore((state) =>
		state.getCurrentModalConfig(),
	);
	const closeModal = useFormModalStore((state) => state.closeModal);

	const config = useMemo(() => {
		if (!currentModalConfig) {
			return undefined;
		}
		const { id, type, title, size, modalProps } = currentModalConfig;

		// Base config for all modals
		const baseConfig = {
			id,
			isOpen: true,
			onClose: () => closeModal(id),
			title: title,
			size,
			modalProps,
		};

		if (type === 'form') {
			const formPayload = currentModalConfig.payload as FormModalPayload<
				TItem,
				TExport,
				TCombined
			>;
			const handleSubmit = async (values: TCombined) => {
				try {
					if (
						formPayload.action === 'export-excel' ||
						formPayload.action === 'export-excel-agent'
					) {
						formPayload.onExportSubmit?.(values as unknown as TExport);
					} else {
						await formPayload.onItemSubmit?.(
							values as unknown as TItem,
							formPayload.action,
						);
					}
					formPayload.onFormSubmitSuccess?.();
				} catch (error) {
					// console.error("Form submission failed:", error);
				}
			};
			return {
				...baseConfig,
				type: 'form',
				action: formPayload.action,
				itemSchema: formPayload.itemSchema,
				// exportSchema: formPayload.exportSchema,
				defaultItemValues: formPayload.formData,
				renderFormContent: formPayload.renderFormContent,
				onSubmit: handleSubmit,
				isOnlyExport: formPayload.action === 'export-excel',
			};
		}
		if (type === 'detail') {
			const detailPayload =
				currentModalConfig.payload as DetailModalPayload<TDetailData>;
			return {
				...baseConfig,
				...detailPayload,
				type: 'detail',
			};
		}
		if (type === 'confirm') {
			const confirmPayload = currentModalConfig.payload as ConfirmModalPayload;
			return {
				...baseConfig,
				...confirmPayload,
				type: 'confirm',
			};
		}

		return undefined;
	}, [currentModalConfig, closeModal]);

	return config;
};
