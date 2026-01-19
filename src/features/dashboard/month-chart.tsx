import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Typography } from "~/components/ui";
import { useCrud } from "~/hooks/use-crud-v2";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useAuth, useFilter } from "~/hooks";
import Loading from "~/components/ui/loading";
import { useLocation } from "@tanstack/react-router";
import { ROLES } from "~/constant";
import { serializeListData } from "~/utils/util";
export const MonthChart = () => {
  const { role } = useAuth();
  const { agentId } = useFilter();
  const location = useLocation(); const pathname = location.pathname;
  const { getAll } = useCrud(
    [API_ENDPOINTS.dashboard.agentMonthChart],
    {
      endpoint: agentId ? ROLES.AGENT : role,
      id_agent: agentId,
      id: agentId,
    },
    {
      enabled:
        Boolean(API_ENDPOINTS.dashboard.agentMonthChart) ||
        (Boolean(agentId) && !pathname.endsWith("/dashboard")),
    }
  );
  const { data: dataQuery, isFetching } = getAll();
  const [noAgents, seNoAgents] = useState([]);

  // *** QUERY ***
  // const { data: dataQuery, isFetching } = useFetchData({
  // 	url: query.agentMonthChart,
  // 	payload: {
  // 		id: userId,
  // 	},
  // 	options: {
  // 		enabled: open && Boolean(userId),
  // 	},
  // });

  const data = {
    labels: [
      "T.1",
      "T.2",
      "T.3",
      "T.4",
      "T.5",
      "T.6",
      "T.7",
      "T.8",
      "T.9",
      "T.10",
      "T.11",
      "T.12",
    ],
    datasets: [
      {
        label: "Số lượng",
        data: noAgents,
        borderColor: "#3366FF",
        backgroundColor: "rgba(51, 102, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
        ticks: { stepSize: 2 },
      },
    },
  };

  useEffect(() => {
    if (dataQuery) {
      const dataChart = serializeListData(dataQuery);
      const month: any = Array(12).fill(0);

      dataChart.forEach((entry: any) => {
        const index = entry.month - 1; // Convert month (1-based) to array index (0-based)
        month[index] = entry.no_agent;
      });

      seNoAgents(month);
    }
  }, [dataQuery]);

  return (
    <Card
      radius="sm"
      classNames={{
        body: "gap-y-5 pb-10",
      }}
    >
      <CardHeader>
        <Typography variant="h3" className="text-sm md:text-lg w-full pb-2.5">
          Biểu đồ thành viên theo tháng (Biểu đồ đường):
        </Typography>
      </CardHeader>
      <CardBody>
        {/* <Divider>
					<span className="text-info font-semibold">
						Biểu đồ thành viên theo tháng (Biểu đồ đường):
					</span>
				</Divider> */}
        <div className="w-full md:max-w-[800px] mx-auto">
          {/* <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}> */}
          {isFetching ? <Loading /> : <Line data={data} options={options} />}
        </div>
      </CardBody>
    </Card>
  );
};
