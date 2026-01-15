import "chart.js/auto";
import { useEffect, useState } from "react";
import { useFetchData } from "~/hooks/query/query";
import "rc-slider/assets/index.css";
import { Card, Col, Row } from "reactstrap";
import { formatDate } from "~/utility/Utils";
import classNames from "classnames";
import AgentLevelCodeNew from "../old/agent-level-code-new";
import AgentLevelCodeOld from "../old/agent-level-code-old";

const ListChildLevelUp = ({ query, userId, open }: any) => {
  const [data, setData] = useState([]);

  // *** QUERY ***
  const { data: dataQuery, isFetching } = useFetchData({
    url: query.listChildLevelUp,
    payload: {
      id: userId,
    },
    options: {
      enabled: open && Boolean(userId),
    },
  });

  useEffect(() => {
    if (dataQuery) {
      setData(dataQuery.content);
    }
  }, [dataQuery]);

  return (
    <>
      <Card className="h-[100%]">
        <div className="divider divider-info">
          <div className="divider-text">
            <span className="font-semibold text-info">Lịch sử thăng tiến:</span>
          </div>
        </div>

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
              </div>
            </div>
          </div>
          {data && (
            <div className="">
              <div className="">
                {data.map((step, index) => (
                  <div key={index} className="mb-4 relative">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          step?.active ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      />
                      <Row className="w-full">
                        <Col md={6} sm={6} xs={12}>
                          <div
                            className={
                              "ml-2 text-lg text-left font-semibold text-gray-500"
                            }
                          >
                            {step?.agent_name}
                          </div>
                        </Col>
                        <Col md={6} sm={6} xs={12}>
                          <div
                            className={
                              "ml-2 text-lg text-right font-semibold text-gray-500"
                            }
                          >
                            {formatDate(step?.created_date)}
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <p className={`ml-6 text-sm ext-gray-500`}>
                      Đã chuyển từ &nbsp;
                      <AgentLevelCodeOld
                        data={step}
                        levelIdKey={"id_level_old"}
                        levelCodeKey={"old_level_code"}
                      />
                      &nbsp; sang &nbsp;
                      <AgentLevelCodeNew
                        data={step}
                        levelIdKey={"id_level_new"}
                        levelCodeKey={"new_level_code"}
                      />
                    </p>
                    {index !== data.length - 1 && (
                      <div className="absolute left-1.5 top-5 h-full border-l-2 border-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default ListChildLevelUp;
