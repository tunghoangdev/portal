import "chart.js/auto";
import { getFullFtpUrl } from "~/auth/utils";
import { useEffect, useState } from "react";
import { useFetchData } from "~/hooks/query/query";
import "rc-slider/assets/index.css";
import { formatDate } from "~/utility/Utils";
import classNames from "classnames";
import { Divider, Grid, Stack } from "~/components/ui";
import { User } from "@heroui/react";
import { Icons } from "~/components/icons";

const NewAgent = ({ query, userId, open }: any) => {
  const [dataAgentWeek, setDataagentWeek] = useState(0);
  const [dataAgentMonth, setDataagentMonth] = useState(0);
  const [dataTopAgent, setDataTopAgent] = useState([]);

  // *** QUERY ***
  const { data: agentWeek, isFetching: isFetchingNewAgentWeek }: any =
    useFetchData({
      url: query.newAgentWeek,
      payload: {
        id: userId,
      },
      options: {
        enabled: open && Boolean(userId),
      },
    });

  const { data: agentMonth, isFetching: isFetchingNewAgentMonth }: any =
    useFetchData({
      url: query.newAgentMonth,
      payload: {
        id: userId,
      },
      options: {
        enabled: open && Boolean(userId),
      },
    });

  const { data: topAgent, isFetching: isFetchingTopAgentList }: any =
    useFetchData({
      url: query.topAgentList,
      payload: {
        id: userId,
      },
      options: {
        enabled: open && Boolean(userId),
      },
    });

  useEffect(() => {
    if (agentWeek) {
      setDataagentWeek(agentWeek.content);
    }
  }, [agentWeek]);

  useEffect(() => {
    if (agentMonth) {
      setDataagentMonth(agentMonth.content);
    }
  }, [agentMonth]);

  useEffect(() => {
    if (topAgent) {
      setDataTopAgent(topAgent.content);
    }
  }, [topAgent]);

  return (
    <div>
      <Divider>
        <span className="font-semibold text-info">Thành viên hệ thống:</span>
      </Divider>
      <div>
        <Grid container spacing={4}>
          <Grid item md={6} sm={6} xs={12}>
            <div className="mb-2.5">
              <div
                className={classNames("overlay-loading-datatable", {
                  show: isFetchingNewAgentWeek,
                })}
              >
                <div className="main">
                  <div className="b">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>

              <h5 className="hidden sm:block pb-4 text-sm font-bold">&nbsp;</h5>

              <div className="bg-white shadow-md rounded-md p-2.5 w-full">
                {/* <div className="flex items-center space-x-2">
                  <span className="text-blue-500 text-2xl">
                    <i className="fa fa-user" aria-hidden="true" />
                  </span>
                  <span className="text-gray-500">
                    Thành viên mới trong tuần
                  </span>
                </div> */}
                <Stack alignItems={"center"} className="gap-x-1">
                  <Icons.user size={14} className="text-blue-500" />
                  <span className="text-gray-500 text-xs">
                    Thành viên mới trong tuần
                  </span>
                </Stack>
                <hr className="my-3" />
                <div className="mt-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {dataAgentWeek}
                  </span>
                  <span className="text-lg font-semibold text-gray-700 ml-1">
                    Thành viên
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div
                className={classNames("overlay-loading-datatable", {
                  show: isFetchingNewAgentMonth,
                })}
              >
                <div className="main">
                  <div className="b">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-md p-2.5 w-full">
                <Stack alignItems={"center"} className="gap-x-1">
                  <Icons.user size={14} className="text-blue-500" />
                  <span className="text-gray-500 text-xs">
                    Thành viên mới trong tháng
                  </span>
                </Stack>
                <hr className="my-3" />
                <div className="mt-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {dataAgentMonth}
                  </span>
                  <span className="text-lg font-semibold text-gray-700 ml-1">
                    Thành viên
                  </span>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <div
              className={classNames("overlay-loading-datatable", {
                show: isFetchingTopAgentList,
              })}
            >
              <div className="main">
                <div className="b">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>

            <h5 className="pb-4 text-sm font-bold">
              Top 5 thành viên mới nhất
            </h5>

            <ul className="sm:p-[0px] bg-white shadow-md rounded-lg divide-y">
              {dataTopAgent &&
                dataTopAgent?.map((data: any, index: number) => (
                  <li
                    key={index}
                    className="p-1 flex justify-between text-gray-700 font-medium"
                  >
                    <User
                      avatarProps={{
                        src: getFullFtpUrl("avatar", data?.agent_avatar),
                      }}
                      description={
                        (<>
                          {data?.agent_phone}
                          {" - "}
                          <span className="text-[10px] text-default-700">
                            {formatDate(data?.created_date)}
                          </span>
                        </>) as any
                      }
                      name={data?.agent_name}
                    />
                    {/* <div className="font-bold">
                      <div className="flex items-center gap-2">
                        <div style={{ width: "36px", height: "36px" }}>
                          <img
                            src={getFullFtpUrl("avatar", data?.agent_avatar)}
                            alt={data?.agent_name}
                            className="rounded-circle w-full h-full object-cover shadow-md"
                          />
                        </div>
                        <div>
                          <div className="font-bold flex gap-2 items-center">
                            <span className={"text-red-600"}>
                              {data?.agent_name}
                            </span>
                          </div>
                          <div className="text-md flex gap-2">
                            {data?.agent_phone}
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </li>
                ))}
            </ul>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default NewAgent;
