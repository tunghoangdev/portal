import { useEffect, useMemo, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { ListGroupItem } from 'reactstrap';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { Button, Card } from '~/components/ui';

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
			const grouped = data.reduce((acc: any, curr: any) => {
				const key = curr.document_type_name;
				if (!acc[key]) acc[key] = [];
				acc[key].push(curr);
				return acc;
			}, {});
			setList(grouped);
		}
	}, [data]);
	const groupDataKeys = useMemo(() => {
		const newData =
			data?.length > 0
				? data.reduce((acc: any, curr: any) => {
						const key = curr.document_type_name;
						if (!acc[key]) {
							acc[key] = [];
						}
						acc[key].push(curr);
						return acc;
					}, {})
				: [];
		return Object.entries(newData);
	}, [data]);

	// *** HANDLERS ***
	const handleSave = async () => {
		const mergedList = Object.values(list).flat();
		await updateConfirm(
			{
				list_shuffle: mergedList.map((l: any, idx) => ({
					id: l.id,
					no: idx + 1,
				})),
			},
			{
				title: 'Xác nhận cập nhật',
				message: 'Bạn có chắc chắn muốn cập nhật thứ tự?',
				_customUrl: basePath.shuffle,
			},
		);
	};

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
		<div className="flex flex-col gap-y-2 px-2.5 pb-5">
			<p className="mb-4">
				<span className="text-sm">Sắp xếp lại thứ tự bằng cách kéo thả</span>
			</p>
			{Object.entries(list).map(([key, items]) => (
				<div key={key} className="mt-5">
					<h3 className="font-semibold text-secondary mb-1">{key}</h3>
					<Card
						radius="sm"
						classNames={{
							base: 'p-0',
							body: 'p-0 overflow-x-auto max-w-full',
						}}
					>
						<ReactSortable
							tag="ul"
							className="list-group"
							list={items}
							setList={(newList: any) =>
								setList((prev) => ({
									...prev,
									[key]: newList,
								}))
							}
						>
							{(items as any[]).map((item: any, index: number) => (
								<li
									key={item.id}
									className="w-full cursor-move hover:bg-gray-200 transition p-2.5 text-xs flex items-center justify-between"
								>
									{index + 1}. {item.document_name}
								</li>
							))}
						</ReactSortable>
					</Card>
				</div>
			))}

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
