

import { Button, Stack } from '@/components/ui';
import { Icons } from '~/components/icons';
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
						<Icons.spinner size="sm" />
					) : (
						<>
							<Icons.check size={16} />
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
						<Icons.spinner size="sm" />
					) : (
						<>
							<Icons.close size={16} />
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
							<Icons.circleCheck size={16} />
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
							<Icons.closeCircle size={16} />
							<span className="align-middle ms-1">Bỏ phân quyền toàn nút</span>
						</Button>
					</div>
				</>
			)}
		</Stack>
	);
};

export default FormAction;
