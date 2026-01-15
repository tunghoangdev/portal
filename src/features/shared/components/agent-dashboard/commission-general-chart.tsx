import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";
import { serializeListData, useFetchData } from "~/hooks/query/query";
import { Card } from "reactstrap";
import classNames from "classnames";
import { Divider } from "~/components/ui";

const CommissionGeneralChart = ({ query, userId }: any) => {
  const [amounts, setAmounts] = useState([]);

  // *** QUERY ***
  const { data: dataQuery, isFetching } = useFetchData({
    url: query.commissionGeneralChart,
    payload: {
      id: userId,
    },
    options: {
      enabled: open && Boolean(userId),
    },
  });

  useEffect(() => {
    if (dataQuery) {
      const dataChart = serializeListData(dataQuery);
      const month = Array(12).fill(0);

      dataChart.forEach((entry) => {
        const index = entry.month - 1; // Convert month (1-based) to array index (0-based)
        month[index] = entry.amount;
      });

      setAmounts(month);
    }
  }, [dataQuery]);

  const data = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Số lượng",
        data: amounts,
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
        max: 50000000,
        ticks: { stepSize: 5000000 },
      },
    },
  };

  return (
    <div>
      <Divider>
        <span className="font-semibold text-info">
          Biểu đồ thu nhập tháng (Biểu đồ đường):
        </span>
      </Divider>
      <div>
        <div
          className={classNames("overlay-loading-datatable", {
            show: isFetching,
          })}
        >
          <div className="main">
            <div className="b">
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
        <div style={{ width: "100%", maxWidth: "800px", margin: "auto" }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default CommissionGeneralChart;
