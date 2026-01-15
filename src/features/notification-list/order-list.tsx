import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { ListGroupItem } from "reactstrap";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useAuth } from "~/hooks";
import { useCrud } from "~/hooks/use-crud-v2";
import { Button } from "~/components/ui";

const DocumentListOrder = ({ data }: any) => {
  // *** STATE ***
  const { role } = useAuth();
  const [list, setList] = useState([]);
  const basePath = API_ENDPOINTS[role].documents.members;
  // CRUD HOOKS
  const { updateConfirm } = useCrud([basePath.list], {
    endpoint: role,
  });
  // **** MUTATION ***
  //   const { mutate: onSave, isPending } = useSubmitData({
  //     url: QUERY.shuffle,
  //     cb: () => {
  //       toast.success("Cập nhật thành công");
  //       refetch();
  //       toggle();
  //     },
  //   });

  // *** EFFECTS ***
  useEffect(() => {
    if (data?.length) {
      setList(data);
    }
  }, [data]);

  // *** HANDLERS ***
  const handleSave = async () =>
    await updateConfirm(
      {
        list_shuffle: list.map((l: any, idx) => ({
          id: l.id,
          no: idx + 1,
        })),
      },
      {
        title: "Xác nhận cập nhật",
        message: "Bạn có chắc chắn muốn cập nhật thứ tự?",
        _customUrl: basePath.shuffle,
      }
    );
  // ConfirmAlert({
  //   title: "Xác nhận cập nhật",
  //   text: "Bạn có chắc chắn muốn cập nhật thứ tự?",
  //   cb: () => {
  // const dataSubmit = {
  //   list_shuffle: list.map((l, idx) => ({
  //     id: l.id,
  //     no: idx + 1,
  //   })),
  //     };

  //     onSave(dataSubmit);
  //   },
  // });

  return (
    <div className="flex flex-col gap-y-2 px-2.5">
      <p className="mb-4">
        <span className="text-muted">Sắp xếp lại thứ tự bằng cách kéo thả</span>
      </p>

      <ReactSortable
        tag="ul"
        className="list-group"
        list={list}
        setList={(newList) => setList(newList)}
      >
        {list.map((item: any, index) => {
          return (
            <ListGroupItem
              key={item.id}
              className="w-full cursor-move hover:bg-gray-200 transition"
            >
              {index + 1}. {item.document_name}
            </ListGroupItem>
          );
        })}
      </ReactSortable>
      <Button
        size="sm"
        color="secondary"
        onPress={handleSave}
        className="self-center"
      >
        Lưu thay đổi
      </Button>
      {/* <ActionButtons
        toggle={toggle}
        isEdit
        isLoading={isPending}
        onClick={handleSave}
        text="Lưu"
      /> */}
    </div>
  );
};

export default DocumentListOrder;
