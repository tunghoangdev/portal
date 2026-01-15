import { useLocation } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface IOption {
	value: string | number;
	label: string;
}

interface IUseSelectAllLogicProps {
	data: any[];
	valueKey: string;
	labelKey: string;
	initialValue?: string;
	filterKey?: string;
	onValueChange?: (value: string) => void;
}

export const useSelectAllLogic = ({
	data,
	valueKey,
	labelKey,
	initialValue,
	onValueChange,
}: IUseSelectAllLogicProps) => {
	const location = useLocation(); const pathname = location.pathname;

	// Khai báo allOption cố định (value là chuỗi rỗng)
	const allOption = useMemo(() => ({ value: '', label: 'Tất cả' }), []);

	// Chuyển đổi dữ liệu thô thành options
	const listOptions: IOption[] = useMemo(() => {
		return (
			data?.map((item) => ({
				value: String(item[valueKey]),
				label: item[labelKey],
			})) || []
		);
	}, [data, valueKey, labelKey]);

	const displayOptions = useMemo(
		() => [allOption, ...listOptions],
		[allOption, listOptions],
	);

	// Sử dụng state nội bộ để quản lý keys được chọn trên UI
	const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(() => {
		if (initialValue === undefined || initialValue === '') {
			return new Set([allOption.value]);
		}
		const keysArray = initialValue.split(';').filter(Boolean);
		return new Set(keysArray);
	});
	// const resetSelection = useCallback(() => {
	// 	const resetSet = new Set([allOption.value]);
	// 	setSelectedKeys(resetSet);

	// 	// Gọi callback để thông báo trạng thái đã reset về 'Tất cả' (giá trị là '')
	// 	if (onValueChange) {
	// 		onValueChange('');
	// 	}
	// }, [allOption.value, onValueChange]);
	// Đồng bộ giá trị khởi tạo hoặc giá trị từ bên ngoài
	useEffect(() => {
		if (initialValue !== undefined) {
			const keysArray = initialValue.split(';').filter(Boolean);

			if (keysArray.length === 0) {
				// Nếu initialValue rỗng, set về 'Tất cả'
				setSelectedKeys(new Set([allOption.value]));
			} else {
				// Ngược lại, set các giá trị truyền vào
				setSelectedKeys(new Set(keysArray));
			}
		}
	}, [initialValue, allOption.value]);
	// Đồng bộ giá trị khởi tạo hoặc URL
	// useEffect(() => {
	// 	if (selectedKeys.size > 0 && !selectedKeys.has(allOption.value))
	// 		resetSelection();
	// }, [pathname, resetSelection]);
	// ------------------------------------------------------------------
	// Logic xử lý khi lựa chọn thay đổi
	// ------------------------------------------------------------------
	const handleSelectionChange = (keys: Set<string | number>) => {
		let newSelectedKeys = new Set(Array.from(keys).map(String));

		const ALL_VALUE = allOption.value;
		const isAllSelected = newSelectedKeys.has(ALL_VALUE);
		const wasAllSelected = selectedKeys.has(ALL_VALUE);

		// --- 1. Xử lý khi chọn/bỏ chọn "Tất cả" ---
		if (isAllSelected && !wasAllSelected) {
			// Người dùng vừa chọn "Tất cả"
			// Bỏ chọn tất cả các option khác, chỉ giữ lại 'Tất cả'
			newSelectedKeys = new Set([ALL_VALUE]);
		} else if (!isAllSelected && wasAllSelected) {
			// Người dùng vừa bỏ chọn "Tất cả"
			// Xóa 'Tất cả' ra khỏi set, giữ lại các option khác (nếu có)
			newSelectedKeys.delete(ALL_VALUE);
		} else if (isAllSelected && wasAllSelected && newSelectedKeys.size > 1) {
			// 'Tất cả' vẫn được chọn, nhưng người dùng chọn thêm option con
			// Coi như người dùng muốn chuyển sang chọn lẻ
			newSelectedKeys.delete(ALL_VALUE);
		}

		setSelectedKeys(newSelectedKeys);

		// -----------------------------------------------------
		// Xử lý giá trị trả về (onValueChange)
		let finalValue = '';

		// Nếu 'Tất cả' được chọn, giá trị cuối cùng là chuỗi rỗng ''
		// Ngược lại, lấy các giá trị đã chọn và join
		if (newSelectedKeys.has(ALL_VALUE)) {
			finalValue = '';
		} else {
			const finalKeys = Array.from(newSelectedKeys).filter(
				(key) => key !== ALL_VALUE,
			);
			finalValue = finalKeys.join(';');
		}

		if (onValueChange) {
			onValueChange(finalValue);
		}
	};

	return {
		displayOptions,
		selectedKeys,
		allOption,
		handleSelectionChange,
	};
};
