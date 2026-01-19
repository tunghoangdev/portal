
import { Button, Card, CardBody, CardHeader, Stack } from '@/components/ui';
import { Checkbox } from '@heroui/react';
import { Icons } from '@/components/icons';
const FormButton = ({
	isEdit,
	data = [],
	handleCheckButton,
	handleCheckAllButton,
}: any) => {
	return (
		<>
			<Card
				className="mb-1"
				radius="sm"
				shadow="none"
				classNames={{
					base: 'bg-default/20',
					header:
						'text-sm font-medium py-2.5 border-b border-default/60 justify-between items-start gap-2',
				}}
			>
				<CardHeader>
					Các thao tác cho phép
					<Stack className="gap-x-2" alignItems={'center'}>
						<Button
							size="sm"
							color="default"
							variant="bordered"
							isDisabled={!isEdit}
							onPress={() => handleCheckAllButton(true)}
							className="min-h-0 h-auto py-0.5 min-w-0 w-auto bg-white"
						>
							<Icons.listCheck size={16} />
							<span className="align-middle ms-1">Cho phép tất cả</span>
						</Button>
						<Button
							size="sm"
							color="danger"
							variant="bordered"
							isDisabled={!isEdit}
							className="min-h-0 h-auto py-0.5 min-w-0 w-auto"
							onPress={() => handleCheckAllButton(false)}
						>
							<Icons.closeCircle size={16} />
							<span className="align-middle ms-1">Bỏ tất cả quyền</span>
						</Button>
					</Stack>
				</CardHeader>
				<CardBody>
					<div className="my-2">
						{data.map((btn: any) => (
							<div key={btn.id_button} className="form-check mb-2">
								<Checkbox
									isSelected={btn.check}
									id={`${btn.button_name}_${btn.id_button}`}
									name={`${btn.button_name}_${btn.id_button}`}
									isDisabled={!isEdit}
									size="sm"
									onChange={() => handleCheckButton(btn.id_button, !btn.check)}
									classNames={{
										label: 'text-sm ',
									}}
								>
									{btn.button_name}
								</Checkbox>
								{/* <Input
									type="checkbox"
									id={`${btn.button_name}_${btn.id_button}`}
									name={`${btn.button_name}_${btn.id_button}`}
									checked={btn.check}
									disabled={!isEdit}
									onChange={() => handleCheckButton(btn.id_button, !btn.check)}
								/>
								<Label
									className="form-check-label"
									for={`${btn.button_name}_${btn.id_button}`}
								>
									{btn.button_name}
								</Label> */}
							</div>
						))}
					</div>
				</CardBody>
				{/* <ListGroup flush>
					<ListGroupItem
						className={`bg-light-${isEdit ? 'primary' : 'secondary'} font-semibold`}
					>
						Thao tác
					</ListGroupItem>
					<ListGroupItem>
						<div className="my-2">
							{data.map((btn) => (
								<div key={btn.id_button} className="form-check mb-2">
									<Input
										type="checkbox"
										id={`${btn.button_name}_${btn.id_button}`}
										name={`${btn.button_name}_${btn.id_button}`}
										checked={btn.check}
										disabled={!isEdit}
										onChange={() =>
											handleCheckButton(btn.id_button, !btn.check)
										}
									/>
									<Label
										className="form-check-label"
										for={`${btn.button_name}_${btn.id_button}`}
									>
										{btn.button_name}
									</Label>
								</div>
							))}
						</div>
					</ListGroupItem>
				</ListGroup> */}
			</Card>
		</>
	);
};

// FormButton.propTypes = {
// 	isEdit: PropTypes.bool,
// 	data: PropTypes.array,
// 	handleCheckButton: PropTypes.func,
// };

export default FormButton;
