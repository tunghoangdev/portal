
import { PermissionList } from './permission-list';
import { useState } from 'react';
import { RoleList } from './role-list';
import { Grid } from '@/components/ui';

// const ID_FORM = MENU_SETTINGS.staff.staffs.permissions.idForm;

const PageClient = () => {
	// Check access page
	//   useCheckAccessPage(ID_FORM);

	// *** STATE ***
	const [permission, setPermission] = useState<any>(null);
	const idPermission = permission?.id;

	return (
		<>
			<Grid container spacing={4}>
				<Grid item xs={12}>
					<PermissionList
						idPermission={idPermission}
						setPermission={setPermission}
						idForm={2}
					/>
				</Grid>
				<Grid item sm={12}>
					<RoleList idPermission={idPermission} />
				</Grid>
			</Grid>
		</>
	);
};

export default PageClient;
