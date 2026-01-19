'use client';
import { MENU_SETTINGS } from '@/configs/menu';
import URLS from '@/configs/urls';
import { useCheckAccessPage } from '@/hooks/query/permission';
import { useAdvancedQuery } from '@/hooks/query/query';
import useAdvancedTable from '@/hooks/query/table';
import AdvancedTable from '@/components/old/advanced-table';
import AgentAssignLevelColumns from '@/components/ui/columns/agent/AssignLevel';

const ID_FORM = MENU_SETTINGS.staff.agents.assignLevel.idForm;

const SETTINGS = ['export', 'search'];

const QUERY = {
	list: URLS.staff.agents.assignLevel.list,
};

const COLUMN_PINNING = {
	left: ['agent_name'],
	right: [],
};

const AssignLevelPage = () => {
	// Check access page
	useCheckAccessPage(ID_FORM);

	// *** QUERY ***
	const { data, isFetching, ...rest } = useAdvancedQuery({
		url: QUERY.list,
		settings: SETTINGS,
	});

	const columns = AgentAssignLevelColumns({ type: 'all' });

	// *** TABLE ***
	const table = useAdvancedTable({
		data,
		columns,
		columnPinning: COLUMN_PINNING,
	});

	const advancedTableProps = {
		...rest,
		idForm: ID_FORM,
		table,
		isFetching,
		data,
		settings: SETTINGS,
	};

	return (
		<>
			<AdvancedTable {...advancedTableProps} />
		</>
	);
};

export default AssignLevelPage;
