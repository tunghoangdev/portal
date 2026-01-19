
import { useEffect, useState } from 'react';
import { Button, Stack } from '@/components/ui';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { PermissionFormView } from './permission-form';
import { usePermissionAction } from '@/hooks';
import { useCrud } from '@/hooks/use-crud-v2';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { CRUD_ACTIONS } from '@/constant';

export const PermissionList = ({ idPermission, setPermission }: any) => {
	const basePath = API_ENDPOINTS.staff.permission;
	const { getAll, deleteConfirm } = useCrud([basePath.list], {
		endpoint: 'root',
	});

	const handleCrudAction = async (action: string, permission: any) => {
		if (action === CRUD_ACTIONS.DELETE) {
			await deleteConfirm(
				{
					id: permission.id,
				},
				{
					title: `Xóa quyền ${permission.permission_name}`,
					message: 'Bạn có chắc chắn muốn xóa quyền này?',
					_customUrl: basePath.delete,
				},
			);
		}

		if (action === CRUD_ACTIONS.EDIT) {
			setPermissionObj(permission);
		}
	};
	const { runAction } = usePermissionAction({
		onAction: handleCrudAction,
	});

	// *** STATE ***
	const [permissionObj, setPermissionObj] = useState(null);
	const { data: permissionQuery, refetch }: any = getAll();
	// *** VARIABLE ***
	const permissions = permissionQuery || [];

	// *** EFFECT ***
	useEffect(() => {
		if (permissionQuery?.length > 0) setPermission(permissionQuery[0]);
	}, [permissionQuery]);
	return (
		<Stack
			className="gap-3 border-b border-default/20 rounded-md p-1.5"
			justifyContent={'start'}
			alignItems={'center'}
		>
			{permissions.map((permission: any, index: number) => (
				<Button
					key={index}
					variant="light"
					className={cn(
						'text-center relative font-semibold bg-transparent min-w-0 w-auto px-1.5 text-default-600',
						permission.id === idPermission &&
							'text-secondary hover:bg-white focus:bg-white bg-white border border-default-600',
					)}
					size="sm"
					onPress={() => setPermission(permission)}
					endContent={
						permission.permission_name?.toLowerCase() !== 'admin' &&
						idPermission === permission.id ? (
							<Stack className="gap-x-2 border-l border-default px-1">
								<Icons.edit
									size={14}
									className="cursor-pointer text-black"
									onClick={() => runAction(CRUD_ACTIONS.EDIT, permission)}
									strokeWidth={1}
								/>
								<Icons.trash
									size={14}
									className="text-danger cursor-pointer"
									onClick={() => runAction(CRUD_ACTIONS.DELETE, permission)}
									strokeWidth={1}
								/>
							</Stack>
						) : undefined
					}
				>
					{permission.permission_name}
				</Button>
			))}
			<PermissionFormView
				onRefresh={() => {
					setPermissionObj(null);
					refetch();
				}}
				data={permissionObj}
				//   idForm={idForm}
			/>
		</Stack>
	);
};
