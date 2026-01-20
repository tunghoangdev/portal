'use client';
import { Icons } from '@/components/icons';
import { Button, Stack, TreeView } from '@/components/ui';
import { useCommon } from '@/hooks';
import { useCommonStore } from '@/stores';
import { useEffect } from 'react';
const FormList = ({
	data,
	idForm,
	setForm,
	isEdit,
	isLoading,
	handleCheckAllForm,
}: any) => {
	const { setData } = useCommonStore();
	const { selectedFormId } = useCommon();
	const transformedData = Object.keys(data).map((moduleName, index) => {
		return {
			id: `module-${index + 1}`, // Tạo ID duy nhất cho mỗi module
			name: moduleName,
			children: data[moduleName].map((form: any, formIndex: number) => ({
				id: `form-${form.id}`, // Sử dụng ID của form hoặc tạo mới
				name: form.form_name,
				access: form.access, // Thêm thuộc tính access nếu cần
				...form,
			})),
		};
	});
	useEffect(() => {
		if (
			transformedData.length > 0 &&
			transformedData[0].children &&
			transformedData[0].children.length > 0 &&
			!selectedFormId
		) {
			const firstFormId = transformedData[0].children[0].id;
			const firstForm = transformedData[0].children[0];
			setData('selectedFormId', firstFormId);
			setForm(firstForm);
		}
	}, [idForm, selectedFormId, transformedData]);

	return (
		<div className="bg-default/20 p-2.5 shadow-sm rounded-md mb-5">
			<Stack className="gap-x-2 mb-5 pl-5 pt-5" alignItems={'center'}>
				<Button
					size="sm"
					color="default"
					variant="bordered"
					isDisabled={
						!isEdit ||
						isLoading.isCheckingAllForm ||
						isLoading.isUnCheckingAllForm
					}
					onClick={() => handleCheckAllForm(true)}
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
					onPress={() => handleCheckAllForm(false)}
				>
					<Icons.closeCircle size={16} />
					<span className="align-middle ms-1">Bỏ tất cả quyền</span>
				</Button>
			</Stack>
			<TreeView
				data={transformedData}
				// expandAll
				onNodeClick={setForm}
				idForm={idForm}
			/>
			{/* {Object.keys(data).length > 0 && (
        <Accordion
          className="accordion-margin"
          variant="splitted"
          defaultExpandedKeys={[
            Object.keys(data).map((moduleName) => moduleName)[0],
          ]}
          defaultOpen={Object.keys(data).map((moduleName) => moduleName)[0]}
        >
          {Object.keys(data).map((moduleName) => (
            <AccordionItem
              key={moduleName}
              aria-label={moduleName}
              classNames={{
                base: "rounded-none shadow-md mb-2 p-0 ",
                heading:
                  "px-5 hover:bg-secondary/10 hover:text-secondary data-[open=true]:bg-secondary/10 data-[open=true]:text-secondary",
                trigger: "py-2",
                title: "text-sm font-medium",
              }}
              title={
                <div className="d-flex align-items-center">
                  {moduleName}{" "}
                  <Chip
                    color="secondary"
                    radius="sm"
                    className="p-1 text-xs font-medium h-5 min-h-0"
                    classNames={{
                      content: "text-xs font-medium p-1",
                    }}
                  >
                    {Object.keys(data[moduleName]).length}
                  </Chip>
                  <Badge color="primary" className="ms-4">
									{Object.keys(data[moduleName]).length}
								</Badge>{' '}
                </div>
              }
            >
              <AccordionHeader
							className="bg-light-primary"
							targetId={moduleName}
						>
							{moduleName}{' '}
							<Badge color="primary" className="ms-4" pill>
								{Object.keys(data[moduleName]).length}
							</Badge>
						</AccordionHeader>
              <Grid container className="m-5" spacing={4}>
                {data[moduleName]?.map((form: any, formIndex: number) => (
                  <Grid item sm={6} key={form.id}>
                    <Button
                      color={idForm === form.id ? "secondary" : undefined}
                      className={cn("shadow-md", {
                        "bg-transparent border border-default/50":
                          idForm !== form.id,
                      })}
                      fullWidth
                      size="sm"
                      // block
                      // className="position-relative mb-4 flex items-center justify-between px-2"
                      // style={{
                      // 	boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                      // }}
                      onClick={() => setForm(form)}
                    >
                      {formIndex + 1}. {form.form_name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <AccordionBody accordionId={moduleName}>
							<Row className="mt-2">
								{data[moduleName]?.map((form, formIndex) => (
									<Col sm="6" key={form.id}>
										<Button
											color={idForm === form.id ? 'secondary' : 'primary'}
											// block
											className="position-relative mb-4 flex items-center justify-between px-2"
											style={{
												boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
											}}
											onClick={() => setForm(form)}
										>
											{formIndex + 1}. {form.form_name}
										</Button>
									</Col>
								))}
							</Row>
						</AccordionBody>
            </AccordionItem>
          ))}
        </Accordion>
      )} */}
		</div>
	);
};

// FormList.propTypes = {
// 	data: PropTypes.object,
// 	permissionId: PropTypes.number,
// 	idForm: PropTypes.number,
// 	setForm: PropTypes.func,
// };

export default FormList;
