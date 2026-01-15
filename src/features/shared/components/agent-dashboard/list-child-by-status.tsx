import "chart.js/auto";
import { useEffect, useState } from "react";
import { useFetchData } from "~/hooks/query/query";
import "rc-slider/assets/index.css";
import { Doughnut } from "react-chartjs-2";
import classNames from "classnames";
import { Divider, Grid, Stack } from "~/components/ui";

const ListChildByStatus = ({ query, userId, open }: any) => {
  const [data, setData] = useState<any>({});
  const [dataByLevels, setDataByLevel] = useState<any>({});

  // *** QUERY ***
  const { data: dataQuery, isFetching: isFetchingChildByStatus }: any =
    useFetchData({
      url: query.listChildByStatus,
      payload: {
        id: userId,
      },
      options: {
        enabled: open && Boolean(userId),
      },
    });

  const { data: dataByLevel, isFetching: isFetchingChildByLevel }: any =
    useFetchData({
      url: query.listChildByLevel,
      payload: {
        id: userId,
      },
      options: {
        enabled: open && Boolean(userId),
      },
    });

  const options = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `${tooltipItem.raw} Contacts`,
        },
      },
    },
  };

  useEffect(() => {
    if (dataQuery) {
      const dataLabels: any = [];
      const dataChart: any = [];

      dataQuery.content.forEach((element: any) => {
        dataLabels.push(element.agent_status_name);
        dataChart.push(element.no_agent);
      });

      const datas = {
        labels: dataLabels,
        datasets: [
          {
            data: dataChart,
            backgroundColor: ["#ff9f43", "#28c76f", "#ea5455"],
            borderWidth: 1,
          },
        ],
      };
      setData(datas);
    }
  }, [dataQuery]);

  useEffect(() => {
    if (dataByLevel) {
      const dataLabels: any = [];
      const dataChart: any = [];

      dataByLevel.content.forEach((element: any) => {
        dataLabels.push(element.level_code);
        dataChart.push(element.no_agent);
      });

      const datas = {
        labels: dataLabels,
        datasets: [
          {
            data: dataChart,
            backgroundColor: [
              "#3b82f6",
              "#22c55e",
              "#eab308",
              "#6366f1",
              "#a855f7",
              "#ef4444",
              "#ff6900",
            ],
            borderWidth: 1,
          },
        ],
      };
      setDataByLevel(datas);
    }
  }, [dataByLevel]);

  return (
    <Grid container spacing={4}>
      <Grid
        item
        sm={6}
        xs={12}
        className="shadow-md p-2 rounded-md text-center border border-default-100"
      >
        <Divider>
          <span className="font-semibold text-primary">
            Trạng thái thành viên:
          </span>
        </Divider>
        {/* <div className="divider divider-info">
            <div className="divider-text">
              <span className="font-semibold text-info">
                Trạng thái thành viên:
              </span>
            </div>
          </div> */}
        <div
          className={classNames("overlay-loading-datatable", {
            show: isFetchingChildByStatus,
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
        {data && data.labels && (
          <Stack
            className="mt-4 w-full"
            alignItems={"stretch"}
            justifyContent={"center"}
            direction={"col"}
          >
            <div className="grid grid-cols-3 gap-6 text-center mb-2.5">
              {data?.labels &&
                data?.labels?.map((label: any, index: any) => (
                  <div
                    key={index}
                    className="text-[11px] flex flex-col justify-between items-center bg-gray-100 py-1.5 rounded-sm"
                  >
                    <div>
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            data?.datasets[0]?.backgroundColor[index],
                        }}
                      ></span>
                      <span className="ml-2 mt-1">{label}</span>
                    </div>
                    <h4 className="text-lg font-bold mt-1">
                      {data?.datasets[0]?.data[index]}
                    </h4>
                  </div>
                ))}
            </div>
            <div className="w-40 h-40 mx-auto">
              <Doughnut data={data} options={options} />
            </div>
          </Stack>
        )}
      </Grid>

      <Grid
        item
        sm={6}
        xs={12}
        className="shadow-md p-2 rounded-md border border-default-100"
      >
        <Divider>
          <span className="font-semibold text-primary">
            Cấp bậc thành viên:
          </span>
        </Divider>
        {/* <div className="divider divider-info">
            <div className="divider-text">
              <span className="font-semibold text-info">
                Cấp bậc thành viên:
              </span>
            </div>
          </div> */}

        <div>
          <div
            className={classNames("overlay-loading-datatable", {
              show: isFetchingChildByLevel,
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
          {dataByLevels && dataByLevels.labels && (
            <Stack
              alignItems={"center"}
              justifyContent={"between"}
              direction={"col"}
              className="mt-4 w-full"
            >
              <div className="grid grid-cols-6 text-center w-full gap-x-1.5">
                {dataByLevels?.labels &&
                  dataByLevels?.labels?.map((label: any, index: number) => (
                    <div
                      key={index}
                      className="text-[11px] flex flex-col justify-between items-center bg-gray-100 py-1.5 rounded-sm"
                    >
                      <div>
                        <span
                          className={`inline-block w-3 h-3 rounded-full text-xs`}
                          style={{
                            backgroundColor:
                              dataByLevels?.datasets[0]?.backgroundColor[index],
                          }}
                        />
                        <span className="ml-2 mt-1">{label}</span>
                      </div>
                      <h4 className="text-sm font-bold mt-1">
                        {dataByLevels?.datasets[0]?.data[index]}
                      </h4>
                    </div>
                  ))}
              </div>
              <div className="w-40 h-40 mt-5">
                <Doughnut data={dataByLevels} options={options} />
              </div>
            </Stack>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default ListChildByStatus;
