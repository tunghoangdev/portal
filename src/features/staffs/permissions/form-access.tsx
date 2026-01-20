import { RadioGroup, Radio } from '@heroui/react';
import { Card, CardBody, CardHeader } from '@/components/ui';
const FormAccess = ({ isEdit, isAccessForm, handleAccessForm }: any) => {
	return (
		<>
			<Card
				className="mb-4 mt-2"
				radius="sm"
				shadow="none"
				classNames={{
					base: 'bg-default/20',
					header: 'text-sm font-semibold text-black py-2.5',
				}}
			>
				<CardHeader>Quyền truy cập</CardHeader>
				<CardBody>
					<RadioGroup
						name="permission-access"
						// color="primary"
						isDisabled={!isEdit}
						value={isAccessForm ? 'allow' : 'deny'}
						orientation="horizontal"
						onChange={() => isEdit && handleAccessForm(!isAccessForm)}
						// label="Quyền truy cập"
					>
						<Radio value="allow" size="sm">
							Được truy cập
						</Radio>
						<Radio value="deny" size="sm">
							Không được truy cập
						</Radio>
					</RadioGroup>
				</CardBody>
				{/* <Accordion variant="splitted">
					<AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
						Quyền truy cập
					</AccordionItem>
					<AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
						<div className="mb-2">
							<div className="form-check">
								<Input
									type="radio"
									id="permission-allow"
									name="permission-access"
									checked={isAccessForm}
									disabled={!isEdit}
									onChange={() => !isAccessForm && handleAccessForm(true)}
								/>
								<Label className="form-check-label" for="permission-allow">
									Được truy cập
								</Label>
							</div>
						</div>
						<div className="mb-1">
							<div className="form-check">
								<Input
									type="radio"
									id="permission-not-allow"
									name="permission-access"
									checked={!isAccessForm}
									disabled={!isEdit}
									onChange={() => isAccessForm && handleAccessForm(false)}
								/>
								<Label className="form-check-label" for="permission-not-allow">
									Không được truy cập
								</Label>
							</div>
						</div>
					</AccordionItem>
				</Accordion> */}
				{/* <ListGroup flush>
					<ListGroupItem
						className={`bg-light-${isEdit ? 'primary' : 'secondary'} font-semibold`}
					>
						Quyền truy cập
					</ListGroupItem>
					<ListGroupItem>
						<div className="mb-2">
							<div className="form-check">
								<Input
									type="radio"
									id="permission-allow"
									name="permission-access"
									checked={isAccessForm}
									disabled={!isEdit}
									onChange={() => !isAccessForm && handleAccessForm(true)}
								/>
								<Label className="form-check-label" for="permission-allow">
									Được truy cập
								</Label>
							</div>
						</div>
						<div className="mb-1">
							<div className="form-check">
								<Input
									type="radio"
									id="permission-not-allow"
									name="permission-access"
									checked={!isAccessForm}
									disabled={!isEdit}
									onChange={() => isAccessForm && handleAccessForm(false)}
								/>
								<Label className="form-check-label" for="permission-not-allow">
									Không được truy cập
								</Label>
							</div>
						</div>
					</ListGroupItem>
				</ListGroup> */}
			</Card>
		</>
	);
};

// FormAccess.propTypes = {
// 	isEdit: PropTypes.bool,
// 	isAccessForm: PropTypes.bool,
// 	handleAccessForm: PropTypes.func,
// };

export default FormAccess;
