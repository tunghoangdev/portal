
import { createStore, type StateCreator } from 'zustand/vanilla';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

type StoreOptions = {
	persist?: boolean;
	devtools?: boolean;
	name?: string; // tên hiển thị trong devtools hoặc key lưu storage
};

/**
 * ✅ Factory giúp tạo Zustand store + hook + selector hook
 * - Hỗ trợ persist, devtools, subscribeWithSelector
 * - Dùng được trong cả React và non-React
 * - Có hook `useStore` + `createSelectorHook`
 */
export const createZustandStore = <T extends object>(
	initializer: StateCreator<T, any, any>,
	options: StoreOptions = {},
) => {
	let baseInitializer: StateCreator<T, any, any> = initializer;

	// 🧱 Middleware: persist
	if (options.persist) {
		baseInitializer = persist(baseInitializer, {
			name: options.name || 'zustand-store',
		});
	}

	// 🧱 Middleware: devtools
	if (options.devtools) {
		baseInitializer = devtools(baseInitializer, {
			name: options.name || 'Zustand Store',
		});
	}

	// ⚡ Luôn thêm subscribeWithSelector
	baseInitializer = subscribeWithSelector(baseInitializer);

	const store = createStore<T>()(baseInitializer);

	// ✅ Hook React cơ bản (mặc định dùng shallow)
	const useStore = <R>(
		selector: (state: T) => R,
		equalityFn: (a: R, b: R) => boolean = shallow,
	) => useStoreWithEqualityFn(store, selector, equalityFn);

	// ✅ Helper: tạo nhanh custom hook có sẵn selector
	const createSelectorHook =
		<R>(
			selector: (state: T) => R,
			equalityFn: (a: R, b: R) => boolean = shallow,
		) =>
		() =>
			useStore(selector, equalityFn);

	return [store, useStore, createSelectorHook] as const;
};
