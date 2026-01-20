'use client';
// import PropTypes from 'prop-types';
import { X } from 'react-feather';
import { Check, CheckCircle, XCircle } from 'react-feather';
import { Spinner } from 'reactstrap';
import { Button, Stack } from '@/components/ui';
const FormAction = ({
	idForm,
	isEdit,
	isLoading = {
		isCheckingAllForm: false,
		isUnCheckingAllForm: false,
	},
	handleCheckAllForm,
	handleCheckAllButton,
}: any) => {
	return (
		<Stack className="flex-wrap gap-2 align-self-center">
			<div>
				<Button
					size="sm"
					color="success"
					variant="bordered"
					// outline
					isDisabled={
						!isEdit ||
						isLoading.isCheckingAllForm ||
						isLoading.isUnCheckingAllForm
					}
					// q
					onClick={() => handleCheckAllForm(true)}
				>
					{isLoading.isCheckingAllForm ? (
						<Spinner size="sm" />
					) : (
						<>
							<Check size={16} />
							<span className="align-middle ms-1">Phân quyền toàn form</span>
						</>
					)}
				</Button>
			</div>
			<div>
				<Button
					size="sm"
					color="danger"
					variant="bordered"
					// outline
					isDisabled={
						!isEdit ||
						isLoading.isUnCheckingAllForm ||
						isLoading.isCheckingAllForm
					}
					onClick={() => handleCheckAllForm(false)}
				>
					{isLoading.isUnCheckingAllForm ? (
						<Spinner size="sm" />
					) : (
						<>
							<X size={16} />
							<span className="align-middle ms-1">Bỏ phân quyền toàn form</span>
						</>
					)}
				</Button>
			</div>
			{idForm && (
				<>
					<div>
						<Button
							size="sm"
							color="success"
							disabled={!isEdit}
							onClick={() => handleCheckAllButton(true)}
						>
							<CheckCircle size={16} />
							<span className="align-middle ms-1">Phân quyền toàn nút</span>
						</Button>
					</div>
					<div>
						<Button
							size="sm"
							color="danger"
							disabled={!isEdit}
							onClick={() => handleCheckAllButton(false)}
						>
							<XCircle size={16} />
							<span className="align-middle ms-1">Bỏ phân quyền toàn nút</span>
						</Button>
					</div>
				</>
			)}
		</Stack>
		// 	<div className="d-flex gap-2 shadow-lg p-4 mb-2 justify-content-between">
		// 		{/* <div className='d-flex flex-column min-w-[140px]'>
		//     <Label className='form-check-label mb-2 font-bold'>Tắt/ Mở thiết lập</Label>
		//     <div className='form-switch form-check-primary'>
		//       <Input
		//         className='cursor-pointer'
		//         type='switch'
		//         name='permission-edit'
		//         value={isEdit}
		//         onChange={e => handleSetEdit(e.target.checked)}
		//       />
		//     </div>
		//   </div> */}

		// 	</div>
	);
};

// FormAction.propTypes = {
// 	idForm: PropTypes.number,
// 	isEdit: PropTypes.bool,
// 	// handleSetEdit: PropTypes.func,
// 	handleCheckAllForm: PropTypes.func,
// 	handleCheckAllButton: PropTypes.func,
// };

export default FormAction;
