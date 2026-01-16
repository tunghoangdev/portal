import { Spinner } from "@heroui/react";
import lodash from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { Icons } from "~/components/icons";
import {
  Button,
  Card,
  CardBody,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui";
import { CRUD_ACTIONS, TOOLBAR_ACTION_TYPES } from "~/constant";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { docMemberColumns } from "~/features/shared/common";
import { getColumns } from "~/features/shared/common/get-columns";
import {
  FileDowloadCell,
  LevelCell,
  RowActionsCell,
} from "~/features/shared/components/cells";
import {
  useAuth,
  useCommon,
  useCommonData,
  useDataQuery,
  useFilter,
  useModal,
  usePermissionAction,
} from "~/hooks";
import { useCrud } from "~/hooks/use-crud-v2";
import { useIsMobile } from "~/hooks/use-mobile";
import type { CrudActionType, ToolbarAction } from "~/types/data-table-type";
import type { TItemFormFields } from "~/types/form-field";
import { parseString } from "~/utils/util";
import { ExportExcel } from "../shared/components/export-excel";
import DocMemberHistoryList from "./doc-member-history";
import { FormView } from "./form-view";
import { formSchema, initialFormValues } from "./form.schema";
import DocumentListOrder from "./order-list";
const { debounce } = lodash;
const columns = getColumns<any>(docMemberColumns, {
  actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE],
});

const actions = [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE];
const MODAL_TITLE = " tài liệu";

export default function PageClient() {
  // Global state
  const { role } = useAuth();
  const isMobile = useIsMobile();
  const { setFilter } = useFilter();
  const { agentLevels } = useCommon();
  const { openFormModal, openDetailModal } = useModal();
  // Local state
  const basePath = API_ENDPOINTS[role].documents.members;
  // CRUD HOOKS
  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
  });
  useCommonData("agentLevels", API_ENDPOINTS.dic.agentLevel, {
    enabled: !agentLevels?.length,
  });
  const { getInfinite, create, update, deleteConfirm } = useCrud(
    queryKey,
    queryParams
  );

  const { listData, fetchNextPage, hasNextPage, isFetchingNextPage }: any =
    getInfinite();

  const { ref, inView } = useInView({
    rootMargin: "100px",
    triggerOnce: false,
  });

  // 👇 tự động gọi fetchNextPage khi inView
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  // HANDLERS
  const { mutateAsync: createProductMutation } = create();
  const { mutateAsync: updateProductMutation } = update();

  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      if (action === CRUD_ACTIONS.DELETE) {
        await deleteConfirm(formData, {
          title: `Xóa ${MODAL_TITLE}`,
          message: `Bạn có muốn xóa ${MODAL_TITLE} không?`,
        });
        return;
      }

      if (action === CRUD_ACTIONS.EXPORT_EXCEL) {
        openDetailModal(action, {
          title: "Xuất file Excel",
          renderContent: () => <ExportExcel columns={columns} />,
          size: "md",
        });
        return;
      }

      if (action === CRUD_ACTIONS.LOG) {
        openDetailModal(formData, {
          title: `Lịch sử ${MODAL_TITLE}`,
          detailUrl: basePath.logList,
          renderContent: () => (
            <DocMemberHistoryList id={formData?.id} url={basePath.logList} />
          ),
        });
        return;
      }
      if (action === CRUD_ACTIONS.ORDER) {
        openDetailModal(formData, {
          title: `Sắp xếp ${MODAL_TITLE}`,
          size: "5xl",
          renderContent: () => <DocumentListOrder data={listData} />,
          modalProps: {
            scrollBehavior: "inside",
          },
        });
        return;
      }

      const newFormData = {
        ...formData,
        permission_doc:
          typeof formData?.permission_doc === "string"
            ? parseString(formData?.permission_doc, ";", ",")
            : formData?.permission_doc?.join(","),
      };

      const typeMap: any = {
        [CRUD_ACTIONS.EDIT]: {
          title: `Cập nhật ${MODAL_TITLE}`,
          formData: newFormData,
          onSubmit: async (values: any) => {
            if (!formData?.id && !values?.id) {
              toast.error(`Không tìm thấy ${MODAL_TITLE}`);
              return;
            }
            await updateProductMutation({ ...values, id: formData?.id });
          },
        },
        [CRUD_ACTIONS.ADD]: {
          formData: initialFormValues,
          title: `Tạo mới ${MODAL_TITLE}`,
          onSubmit: async (values: any) => {
            await createProductMutation(values);
          },
        },
      };
      openFormModal(action as ToolbarAction, {
        title: typeMap[action].title,
        itemSchema: formSchema,
        renderFormContent: FormView,
        formData: typeMap[action].formData,
        onItemSubmit: async (values: TItemFormFields) => {
          try {
            await typeMap[action].onSubmit({
              ...values,
              permission_doc: values.permission_doc?.split(",").join(";"),
            });
          } catch (error) {
            console.error("Failed to submit item:", error);
            throw error;
          }
        },
        // onFormSubmitSuccess: () => {
        //   closeModal();
        // },
      });
    },
    [
      openFormModal,
      updateProductMutation,
      createProductMutation,
      deleteConfirm,
      openDetailModal,
      listData,
    ]
  );
  const handleSearch = (value: string) => {
    setFilter("info", value);
  };

  const debouncedSearch = useMemo(() => debounce(handleSearch, 500), []);

  const { runAction } = usePermissionAction({
    onAction: handleCrudAction,
  });
  const newListData = useMemo(() => {
    return listData?.map((item: any) => {
      if (
        item.permission_doc &&
        typeof item.permission_doc === "string" &&
        agentLevels?.length
      ) {
        item.permission_doc = item.permission_doc?.split(";");
        item.permissions = agentLevels?.filter((level: any) =>
          item.permission_doc?.includes(level.id.toString())
        );
      }
      return item;
    });
  }, [agentLevels, listData]);
  const groupDataKeys = useMemo(() => {
    const newData =
      newListData?.length > 0
        ? newListData.reduce((acc: any, curr: any) => {
            const key = curr.document_type_name;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(curr);
            return acc;
          }, {})
        : [];
    return Object.entries(newData);
  }, [newListData]);

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          <Input
            isClearable
            type="text"
            placeholder="Tìm kiếm..."
            // value={info}
            onValueChange={(val) => {
              debouncedSearch(val);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                debouncedSearch.cancel();
                handleSearch((e.target as HTMLInputElement).value);
              }
            }}
            startContent={
              <Icons.search strokeWidth={1} className="text-default-600" />
            }
            className="max-w-[180px] md:max-w-[250px]"
            classNames={{
              inputWrapper: "min-h-8 h-8 md:min-h-9 md:h-9",
              input: "text-xs md:text-sm",
            }}
          />
          <Button
            size="sm"
            onPress={() =>
              runAction(TOOLBAR_ACTION_TYPES.EXPORT_EXCEL, newListData)
            }
            isIconOnly
            color="success"
            variant="bordered"
            className="hover:bg-green-700 hover:text-white h-8 md:h-9 md:min-w-9 md:w-9 p-0"
          >
            <Icons.excel size={18} strokeWidth={1.5} />
          </Button>
          <Button
            className="btn-icon h-9 border-orange-500 text-orange-500"
            size="sm"
            color="secondary"
            variant="bordered"
            onPress={() => runAction(CRUD_ACTIONS.ORDER)}
            // onPress={() => onAction?.(CRUD_ACTIONS.ORDER, selectedRows)}
          >
            <Icons.shuffle size={16} className="text-orange-500" />
          </Button>
        </div>
        <Button
          onPress={() => runAction(CRUD_ACTIONS.ADD)}
          color="secondary"
          startContent={<Icons.add size={16} fill="currentColor" />}
          isIconOnly={isMobile}
          size="sm"
        >
          {!isMobile ? "Thêm mới" : ""}
        </Button>
      </div>
      <div className="kb-search-content-info match-height mt-5 pb-5 md:pb-10">
        {groupDataKeys.map(([key, valueArray]: any) => (
          <div key={key} className="mt-5">
            <h3 className="font-semibold text-secondary mb-1">{key}</h3>
            <Card
              radius="sm"
              classNames={{
                base: "p-0",
                body: "p-0 overflow-x-auto max-w-full",
              }}
            >
              <CardBody>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <th className="w-[50px] p-2.5 text-sm text-default-700 font-semibold">
                        STT
                      </th>
                      <th className="w-[110px] p-2.5 text-sm text-default-700 font-semibold">
                        Link tài liệu
                      </th>
                      <th className="p-2.5 text-sm text-default-700 font-semibold">
                        Tên tài liệu
                      </th>
                      <th className="p-2.5 w-[350px] text-sm text-default-700 font-semibold">
                        Quyền xem
                      </th>
                      <th className="p-2.5 w-[150px] text-sm text-default-700 font-semibold text-center">
                        Ẩn tài liệu
                      </th>
                      <th className="p-2.5 w-[100px] text-sm text-default-700 font-semibold">
                        Thao tác
                      </th>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {valueArray?.length > 0 &&
                      valueArray.map((item: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="text-center">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="d-flex gap-1">
                            <FileDowloadCell
                              fileName={item.link_doc}
                              label={"Xem tài liệu"}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {item.document_name}
                              {item.is_hot && (
                                <Icons.star
                                  size={16}
                                  className="text-warning fill-warning min-w-4"
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 flex-wrap">
                              {item?.permissions?.map(
                                (permission: any, index: number) => (
                                  <LevelCell
                                    data={permission}
                                    levelId={+permission.id}
                                    levelCode={permission.level_code}
                                    key={index}
                                  />
                                )
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Stack
                              alignItems={"center"}
                              className="text-center w-full"
                            >
                              {item.is_hide ? (
                                <Icons.eyeOff
                                  size={14}
                                  className="text-danger mx-auto inline-flex"
                                  strokeWidth={1}
                                />
                              ) : (
                                <Icons.eye
                                  size={14}
                                  className="text-success mx-auto inline-flex"
                                  strokeWidth={1}
                                />
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <RowActionsCell
                              row={item}
                              actions={actions}
                              onAction={(type, row) => {
                                runAction(type, row);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        ))}
        {hasNextPage && (
          <div ref={ref} className="flex justify-center py-6">
            <Spinner size="md" />
          </div>
        )}
      </div>
    </>
  );
}
