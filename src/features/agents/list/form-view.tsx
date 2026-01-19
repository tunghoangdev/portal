'use client';
import { Icons } from '@/components/icons';
import ModalComponent from '@/components/old/core/modal';
import { Button } from '@/components/ui';
import { useModals } from '@/hooks/query/modals';
import React, { useState } from 'react';
import AgentApproveForm from '@/components/ui/forms/agent/Approve';
import AgentForm from '@/components/ui/forms/agent';

interface Props {
	refetch: any;
}
export default function FormView({ refetch }: Props) {
	// *** STATE ***
	const [rowSelected, setRowSelected] = useState(null);
	const { modals, toggleModal }: any = useModals({
		form: false,
		log: false,
		viewContractDetail: false,
		updateContractStatus: false,
	});
	const onOpenForm = () => {
		setRowSelected(null);
		toggleModal('form')(true);
	};

	const onCloseForm = () => {
		toggleModal('form')(false);
	};
	return (
		<div>
			<Button
				color="secondary"
				onPress={onOpenForm}
				size="sm"
				startContent={<Icons.add size={16} />}
			>
				Tạo mới thành viên
			</Button>
			{/* Modal Form */}
			<ModalComponent
				open={modals.form}
				toggle={onCloseForm}
				title={`${rowSelected ? 'Chỉnh sửa' : 'Tạo mới'} thành viên`}
				size="lg"
				style={{ maxWidth: '1100px' }}
				// @ts-ignore
				Body={
					<AgentForm
						open={modals.form}
						data={rowSelected}
						refetch={refetch}
						toggle={onCloseForm}
					/>
				}
			/>
		</div>
	);
}
