import { useState, useEffect } from 'react';
import { useAuth } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { testValidPhone } from '~/utils/util';

const schema = z.object({
	phone: z
		.string()
		.optional()
		.refine(
			(value) => {
				if (!value) return true;
				return testValidPhone(value);
			},
			{
				message: 'Số điện thoại không hợp lệ',
			},
		),
});

const serializeObjectData = (data: any) => ({
	id: data.id,
	agent_name: data.agent_name,
	agent_phone: data.agent_phone,
	agent_avatar: data.agent_avatar,
	id_agent_level: data.id_agent_level,
	agent_level_code: data.agent_level_code,
	is_lock: data.is_lock,
	is_has_child: data.is_has_child,
	child_all: data.child_all,
	isExpanded: false,
	isLoading: false,
	children: [],
});

export const useAgentTree = () => {
	const { role } = useAuth();
	const basePath = API_ENDPOINTS?.[role]?.tree;
	const [selectedId, setSelectedId] = useState<number>();
	// 1. Fetch Root Data
	const { getAll } = useCrud(
		[basePath.root],
		{ endpoint: '' },
		{ enabled: Boolean(basePath?.root) },
	);

	const { getAll: getAllChild } = useCrud(
		[basePath.child, selectedId],
		{ endpoint: '', id: selectedId },
		{ enabled: Boolean(basePath?.child) && !!selectedId },
	);

	const { data: rootTree, isFetching: isLoadingRoot }: any = getAll();
	const { data: childTree }: any = getAllChild();

	// 3. Search Logic

	const {
		control,
		watch,
		formState: { errors },
	}: any = useForm({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: { phone: '' },
	});

	const watchPhone = watch('phone');
	const validPhone = testValidPhone(watchPhone) ? watchPhone : null;

	const { getAll: getSearch } = useCrud(
		[basePath.search, validPhone],
		{ endpoint: '', agent_phone: validPhone },
		{ enabled: Boolean(basePath?.search) && !!validPhone },
	);
	const { data: agentSearchQuery, isFetching: agentSearchLoading }: any =
		getSearch();
	// const { data: agentSearchQuery, isFetching: agentSearchLoading }: any =
	//   useFetchData({
	//     url: `/staff${URLS.staff.agents.tree.search}`,
	//     payload: { agent_phone: validPhone },
	//     options: { enabled: !!validPhone },
	//   });

	// 4. Tree Data State
	const [treeData, setTreeData] = useState<any>([]);

	// Effect: Update treeData when rootTree changes (and no search)
	useEffect(() => {
		if (rootTree && !validPhone) {
			setTreeData([serializeObjectData(rootTree)]);
		}
	}, [rootTree, validPhone]);

	useEffect(() => {
		if (childTree && selectedId) {
			setTreeData((prev: any) =>
				updateNode(prev, selectedId, {
					isExpanded: true,
					isLoading: false,
					children: childTree.map((child: any) => serializeObjectData(child)),
				}),
			);
		}
	}, [childTree, selectedId]);

	// Effect: Update treeData when search result changes
	useEffect(() => {
		if (validPhone) {
			if (agentSearchQuery && !agentSearchQuery?.status) {
				setTreeData([serializeObjectData(agentSearchQuery)]);
			} else if (agentSearchQuery?.status === 1) {
				setTreeData([]);
			}
		}
	}, [agentSearchQuery, validPhone]);

	// Helper: Update node in tree recursively
	const updateNode = (nodes: any[], id: any, newData: any): any[] => {
		return nodes.map((node: any) => {
			if (node.id === id) {
				return { ...node, ...newData };
			}
			if (node.children) {
				return { ...node, children: updateNode(node.children, id, newData) };
			}
			return node;
		});
	};

	// Handler: Expand/Collapse
	const handleExpand = async (node: any) => {
		if (node.isExpanded) {
			// Collapse
			setTreeData((prev: any) =>
				updateNode(prev, node.id, { isExpanded: false, children: [] }),
			);
			setSelectedId(undefined);
		} else {
			// Expand
			setTreeData((prev: any) =>
				updateNode(prev, node.id, { isLoading: true }),
			);
			setSelectedId(node.id);
		}
	};

	return {
		control,
		errors,
		treeData,
		isLoadingRoot,
		agentSearchLoading,
		handleExpand,
	};
};
