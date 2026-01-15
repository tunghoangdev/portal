import { Divider, Stack } from "~/components/ui";
import { LevelCell } from "~/features/shared/components/cells";
export const ParentSquareCard = ({ data }: any) => {
  const { avatar, name, phone, hiddenLevel } = data || {};
  return (
    <div className="flex justify-center mt-8 w-full mb-5">
      <div className="w-60 bg-white shadow-md rounded-lg flex flex-col items-center justify-center pb-2.5">
        <img
          src={avatar}
          alt={name}
          className="min-w-32 w-32 min-h-32 h-32 rounded-full object-cover mb-5"
        />
        <Stack alignItems={"center"} className="gap-x-2.5">
          <h2 className="text-xl font-semibold">{name}</h2>
          {!hiddenLevel && (
            <LevelCell
              data={data}
              levelCodeKey="level_code"
              levelIdKey="id_level"
            />
          )}
        </Stack>
        <p className="text-xl text-gray-700">{phone}</p>{" "}
        <Divider className="my-1" />
        <p className="text-black font-bold text-sm my-1">Người tuyển dụng</p>
      </div>
    </div>
  );
};
