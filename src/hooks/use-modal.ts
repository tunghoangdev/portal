import { useFormModalStore } from '~/stores';
export const useModal = () => {
	const openFormModal = useFormModalStore((state) => state.openFormModal);
	const openDetailModal = useFormModalStore((state) => state.openDetailModal);
	const openConfirmModal = useFormModalStore((state) => state.openConfirmModal);
	const closeModal = useFormModalStore((state) => state.closeModal);
	const modalConfig = useFormModalStore((state) =>
		state.getCurrentModalConfig(),
	);
	return {
		openFormModal,
		openDetailModal,
		openConfirmModal,
		closeModal,
		modalConfig,
	};
};
