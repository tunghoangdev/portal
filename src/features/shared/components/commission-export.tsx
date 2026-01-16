import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Icons } from "~/components/icons";
import { DEFAULT_PARAMS, ROLES } from "~/constant";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useCommon } from "~/hooks";
import { useCrud } from "~/hooks/use-crud-v2";
import { CommissionPdfView } from "./commission-pdf";
type IProps = {
  agentId: number;
};
export const CommissionExport = ({ agentId }: IProps) => {
  const [pdfUrl, setPdfUrl] = useState<any>();
  const { periodDate, period_name } = useCommon();
  // Local state
  const [filter] = useState(DEFAULT_PARAMS);
  const { getAll } = useCrud(
    [
      API_ENDPOINTS.agent.commissionTable.exportPdf,
      filter,
      periodDate,
      period_name,
    ],
    {
      endpoint: ROLES.AGENT,
      id: agentId,
      ...filter,
      ...periodDate,
    },
    {
      enabled: !!agentId && !!periodDate,
    }
  );
  const { data: allData }: any = getAll();
  useEffect(() => {
    if (!allData || !agentId) return;
    const generatePdfUrl = async () => {
      const blob = await pdf(<CommissionPdfView data={allData} />).toBlob();
      const objectUrl = URL.createObjectURL(blob);
      const customizedUrl: string = `${objectUrl}#toolbar=0&navpanes=0&statusbar=0&scrollbar=0&scrollmode=0&embedded=1&background=white`;
      setPdfUrl(customizedUrl);
    };

    generatePdfUrl();
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl.split("#")[0]);
      }
    };
  }, [allData, agentId]);
  if (!allData) return <></>;
  return (
    <div className="w-full h-full">
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <PDFDownloadLink
          document={<CommissionPdfView data={allData} />}
          fileName={`Bang_ke_thu_nhap_${period_name}.pdf`}
          className="inline-flex py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2.5"
        >
          {({ loading }) =>
            loading ? (
              "Đang tạo PDF..."
            ) : (
              <>
                <Icons.download className="mr-2" /> Tải bảng kê thu nhập
              </>
            )
          }
        </PDFDownloadLink>
      </div>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          // type="application/pdf"
          width="100%"
          height="100%"
          style={{
            border: "none",
            backgroundColor: "#ffffff", // Hoặc đặt màu nền cho iframe (nếu có khoảng trống)
          }}
          title="Custom PDF Preview"
        >
          Trình duyệt của bạn không hỗ trợ hiển thị PDF trực tiếp.
        </iframe>
      ) : (
        <p>Đang tạo bản preview...</p>
      )}
    </div>
  );
};
