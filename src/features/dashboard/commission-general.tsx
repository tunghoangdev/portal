import CommissionPeriodFilter from "~/components/ui/filter/commission-period";
import { useState } from "react";
import { useAdvancedQuery } from "~/hooks/query/query";
import CommissionGeneralColumns from "~/components/ui/columns/dashboard/CommissionGeneral";
import useAdvancedTable from "~/hooks/query/table";
import { formatNumber } from "~/utility/Utils";
import { useModals } from "~/hooks/query/modals";
import CommissionGeneralDetailColumns from "~/components/ui/columns/dashboard/CommissionGeneralDetail";
import useCommissionGeneralActions from "~/actions/commission-general";
import TableDashboard from "../old/advanced-table/TableDashboard";
import ViewCommissionGeneralDetail from "../old/view-commission-general-detail";
import { Divider } from "~/components/ui";

const SETTINGS = [""];

const COLUMN_PINNING = {
  left: ["commission_type"],
  right: [],
};

const SELECTOR_KEY = "id_commission_type";

const CommissionGeneral = ({ query, periodOptions, userId }: any) => {
  // *** STATE ***
  const periodDefault =
    periodOptions && periodOptions.length > 0
      ? periodOptions[0]?.period_name.toString()
      : "";
  const [periodName, setPeriodName] = useState(periodDefault);
  const [rowSelected, setRowSelected] = useState(null);

  // *** COLUMNS ***
  const columns = CommissionGeneralColumns();
  const detailColumns = CommissionGeneralDetailColumns();

  // *** QUERY ***
  const { data, isFetching, object, ...rest } = useAdvancedQuery({
    url: query.commissionGeneral,
    filter: {
      period_name: periodName,
      id: userId,
    },
  });

  // *** MODALS ***
  const { modals, toggleModal } = useModals({
    viewDetail: false,
  });

  // *** TABLE ***
  const table = useAdvancedTable({
    data,
    columns,
    columnPinning: COLUMN_PINNING,
  });

  const sumItems = [
    {
      label: "Thu nhập trước thuế",
      value: formatNumber(object?.sum_amount),
      color: "#4A90E2",
    },
    {
      label: "Thuế TNCN",
      value: formatNumber(object?.sum_tax),
      color: "#7ED321",
    },
    {
      label: "Thu nhập sau thuế",
      value: formatNumber(object?.sum_total),
      color: "#007BFF",
    },
  ];

  // *** ACTIONS ***
  const { actions } = useCommissionGeneralActions({
    selector: SELECTOR_KEY,
    setRowSelected,
    toggleModal,
  });

  const advancedTableProps = {
    ...rest,
    table,
    isFetching,
    data,
    settings: SETTINGS,
    height: "calc(100vh - 700px)",
    actions,
    isSumItem: true,
    sumItems: sumItems,
    isFooter: false,
    ExternalComponent: (
      <>
        <CommissionPeriodFilter value={periodName} onChange={setPeriodName} />
      </>
    ),
  };

  return (
    <>
      <Divider>
        <span className="font-semibold text-info">Kỳ tính thưởng:</span>
      </Divider>
      <TableDashboard {...advancedTableProps} />

      <ViewCommissionGeneralDetail
        id={userId}
        id_commission_type={rowSelected?.id_commission_type}
        period_name={periodName}
        url={query.commissionGeneralDetail}
        open={modals.viewDetail}
        toggle={() => toggleModal("viewDetail")(false)}
        columns={detailColumns}
      />
    </>
  );
};

export default CommissionGeneral;
