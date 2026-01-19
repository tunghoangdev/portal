'use client';
import useAdvancedTable from '@/hooks/query/table';
import { useAdvancedQuery, useSubmitData } from '@/hooks/query/query';
import { useModals } from '@/hooks/query/modals';
import { useCheckAccessPage } from '@/hooks/query/permission';

// Custom components
import ModalComponent from '@/components/old/core/modal';
import AdvancedTable from '@/components/old/advanced-table';

// Constants
import {
	MAIN_LABEL,
	QUERY,
	SELECTOR_KEY,
	SETTINGS,
	COLUMN_PINNING,
	ID_FORM,
} from './config';
import toast from 'react-hot-toast';
import AgentAssignLevel from '@/components/old/AssignLevel';
import AgentChangeManager from '@/components/old/ChangeManager';
import { useState } from 'react';
import AgentRecruitmentLink from '@/components/old/agent-recruitment-link';
import ViewAgentDetail from '@/components/old/view-agent-detail';
import ViewLogList from '@/components/old/view-log-list';
import AgentColumns from '@/components/ui/columns/agent';
import AgentForm from '@/components/ui/forms/agent';
import AgentApproveForm from '@/components/ui/forms/agent/Approve';
import useAgentActions from '@/actions/agent';

const AgentClientPage = () => {
	// Check access page
	useCheckAccessPage(ID_FORM);

	// *** MODALS ***
	const { modals, toggleModal } = useModals({
		form: false,
		log: false,
		approveAgent: false,
		detail: false,
		assignLevel: false,
		assignBranch: false,
		changeManager: false,
		recruitmentLink: false,
	});

	// *** STATE ***
	const [rowSelected, setRowSelected] = useState(null);

	// *** COLUMNS ***
	const columns = AgentColumns();

	// *** QUERY ***
	const { data, refetch, ...rest } = useAdvancedQuery({
		url: QUERY.list,
		settings: SETTINGS,
		filter: {
			id_agent_status: '',
			id_agent_level: '',
		},
	});

	// *** VARIABLES ***
	const selectorValue = rowSelected?.[SELECTOR_KEY];

	// *** MUTATIONS ***
	const { mutate: onApprove, isPending: isApproving } = useSubmitData({
		url: QUERY.approve,
		cb: () => {
			refetch();
			toast.success(`Duyệt ${MAIN_LABEL} thành công`);
			toggleModal('approveAgent')(false);
		},
	});

	// *** TABLE ***
	const table = useAdvancedTable({
		data,
		columns,
		columnPinning: COLUMN_PINNING,
	});

	// *** ACTIONS ***
	const { actions } = useAgentActions({
		label: MAIN_LABEL,
		selector: SELECTOR_KEY,
		refetch,
		setRowSelected,
		toggleModal,
	});

	const onOpenForm = () => {
		setRowSelected(null);
		toggleModal('form')(true);
	};

	const onCloseForm = () => {
		toggleModal('form')(false);
	};

	// Props cho AdvancedTable
	const advancedTableProps = {
		...rest,
		idForm: ID_FORM,
		table,
		data,
		actions,
		refetch,
		settings: SETTINGS,
		createText: `Tạo mới ${MAIN_LABEL}`,
		handleCreate: onOpenForm,
	};

	return (
		<>
			<AdvancedTable {...advancedTableProps} />

			{/* Modal Log List */}
			<ViewLogList
				title={`Lịch sử ${MAIN_LABEL} ${selectorValue || ''}`}
				open={modals.log}
				toggle={() => toggleModal('log')(false)}
				data={rowSelected}
				columns={columns}
				url={QUERY.logList}
			/>

			{/* Modal Form */}
			<ModalComponent
				open={modals.form}
				toggle={onCloseForm}
				title={`${rowSelected ? 'Chỉnh sửa' : 'Tạo mới'} ${MAIN_LABEL}`}
				size="lg"
				style={{ maxWidth: '960px' }}
				Body={
					<AgentForm
						open={modals.form}
						data={rowSelected}
						refetch={refetch}
						toggle={onCloseForm}
					/>
				}
			/>

			{/* Modal View Detail */}
			<ViewAgentDetail
				data={rowSelected}
				open={modals.detail}
				toggle={() => toggleModal('detail')(false)}
				query={QUERY}
			/>

			{/* Approve Agent */}
			<AgentApproveForm
				title={`Duyệt ${MAIN_LABEL} ${selectorValue || ''}`}
				open={modals.approveAgent}
				toggle={() => toggleModal('approveAgent')(false)}
				data={rowSelected}
				onSave={onApprove}
				isLoading={isApproving}
			/>

			{/* Modal Assign Level */}
			<ModalComponent
				open={modals.assignLevel}
				toggle={() => toggleModal('assignLevel')(false)}
				title={`Quản lý bổ nhiệm ${selectorValue}`}
				size="xl"
				Body={
					<>
						<AgentAssignLevel data={rowSelected} refetch={refetch} />
					</>
				}
			/>

			{/* Modal Change Manager */}
			<ModalComponent
				open={modals.changeManager}
				toggle={() => toggleModal('changeManager')(false)}
				title={`Quản lý chuyển nhánh ${selectorValue}`}
				size="xl"
				Body={
					<>
						<AgentChangeManager data={rowSelected} refetch={refetch} />
					</>
				}
			/>

			{/* Modal Recruitment Link */}
			<AgentRecruitmentLink
				data={rowSelected}
				open={modals.recruitmentLink}
				toggle={() => toggleModal('recruitmentLink')(false)}
			/>
		</>
	);
};

export default AgentClientPage;
