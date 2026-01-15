import 'chart.js/auto';
import { useEffect, useState } from 'react';
import { useFetchData } from '~/hooks/query/query';
import 'rc-slider/assets/index.css';
// import Slider from "rc-slider";
// import { Card, Col, Row, Tooltip } from "reactstrap";
import { formatNumber } from '~/utility/Utils';
import { NOTI_LEVEL } from '~/configs/constants';
import classNames from 'classnames';
import { Divider } from '../ui';
import { Slider, Tooltip } from '@heroui/react';

const LevelUpProcess = ({ query, userId, dataUser, open }: any) => {
	const [data, setData] = useState<any>({});
	const [xpPersonPercent, setXpPersonPercent] = useState(0);
	const [xpGroupPercent, setXpGroupPercent] = useState(0);
	const [noChildPercent, setNoChildPercent] = useState(0);
	const [tooltipCheck, setTooltipCheck] = useState(false);
	const [tooltipUnCheck, setTooltipUnCheckn] = useState(false);

	const toggleCheck = () => setTooltipCheck(!tooltipCheck);
	const toggleUnCheck = () => setTooltipUnCheckn(!tooltipUnCheck);

	// *** QUERY ***
	const { data: dataQuery, isFetching }: any = useFetchData({
		url: query.levelUpProcess,
		payload: {
			id: userId,
		},
		options: {
			enabled: open && Boolean(userId),
		},
	});

	const { data: dataLevelMax, isFetchingLevelMax }: any = useFetchData({
		url: query.agentLevelMax,
		options: {
			enabled: open && Boolean(userId),
		},
	});

	useEffect(() => {
		if (dataQuery) {
			setData(dataQuery.content);
			const content = dataQuery?.content;

			if (content?.xp_person && content?.xp_person_reach) {
				const xpPerson = (content?.xp_person / content?.xp_person_reach) * 100;
				setXpPersonPercent(Number.parseFloat(xpPerson.toFixed(2)));
			}

			if (content?.xp_group && content?.xp_group_reach) {
				const xpGroup = (content?.xp_group / content?.xp_group_reach) * 100;
				setXpGroupPercent(Number.parseFloat(xpGroup.toFixed(2)));
			}

			if (content?.no_child && content?.no_child_reach) {
				const noChild = (content?.no_child / content?.no_child_reach) * 100;
				setNoChildPercent(Number.parseFloat(noChild.toFixed(2)));
			}
		}
	}, [dataQuery]);

	return (
		<div className="">
			<Divider>
				<span className="font-semibold text-info">Tiến trình thăng tiến:</span>
			</Divider>

			<div className="p-[12px]">
				{dataUser?.id_agent_level >= dataLevelMax?.content ? (
					<div>
						<div
							className={classNames('overlay-loading-datatable', {
								show: isFetchingLevelMax,
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
						<div className="flex justify-center items-center w-full h-full text-center">
							{/* Có thể thêm hình ảnh nếu cần */}
							{/* <div className="w-1/2">
                    <img src={NOTI_LEVEL} alt="noti level" />
                  </div> */}

							<div className="w-full flex justify-center">
								<div className="relative w-60 h-40 md:w-80 md:h-56">
									{/* Đám mây */}
									{/* <div className="absolute w-40 h-40 md:w-56 md:h-56 bg-white rounded-full top-0 left-8 md:left-12 shadow-lg"></div>
                      <div className="absolute w-32 h-32 md:w-44 md:h-44 bg-white rounded-full top-6 md:top-8 left-0 shadow-md"></div>
                      <div className="absolute w-32 h-32 md:w-44 md:h-44 bg-white rounded-full top-6 md:top-8 right-0 shadow-md"></div>
                      <div className="absolute w-40 h-36 md:w-56 md:h-48 bg-white rounded-full bottom-0 left-8 md:left-14 shadow-lg"></div> */}

									{/* Nội dung */}
									<div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
										<span className="text-[5rem] leading-none text-orange-500 pt-[10px]">
											🏆
										</span>
										<p className="text-[30px] leading-[32px] text-orange-500 font-semibold pt-[10px]">
											Chúc mừng bạn đã đạt được vị trí cao nhất
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div>
						<div
							className={classNames('overlay-loading-datatable', {
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
						<Slider
							className="max-w-md"
							defaultValue={data?.xp_person}
							getValue={(value) =>
								`${formatNumber(value)}/${formatNumber(data?.xp_person_reach)}`
							}
							label="Điểm tích lũy cá nhân:"
							isDisabled
							showTooltip={true}
							minValue={0}
							step={1000000}
							maxValue={+data?.xp_person_reach}
							hideThumb={true}
						/>
						<Slider
							className="max-w-md mt-2.5"
							defaultValue={data?.xp_group}
							getValue={(value) =>
								`${formatNumber(value)}/${formatNumber(data?.xp_group_reach)}`
							}
							label="Điểm tích lũy nhóm:"
							isDisabled
							showTooltip={true}
							minValue={0}
							step={1000000}
							maxValue={data?.xp_group_reach ? +data?.xp_group_reach : 0}
							hideThumb={true}
						/>
						<Slider
							className="max-w-md mt-2.5"
							defaultValue={data?.no_child}
							getValue={(value) =>
								`${formatNumber(value)}/${formatNumber(data?.no_child_reach)}`
							}
							label={`Cơ cấu hệ thống: ${`${data?.no_child}/${data?.no_child_reach}`}`}
							isDisabled
							showTooltip={true}
							hideThumb={true}
							//   marks={
							//     noChildPercent <= 100
							//       ? {
							//           [noChildPercent]: `${Math.min(noChildPercent, 100)}%`,
							//           100: "100%",
							//         }
							//       : { 0: "0%", 100: "100%" }
							//   }
						/>
						{/* <Row className="h-[70px]">
              <Col xs="11">
                <span>
                  Điểm tích lũy cá nhân:{" "}
                  {`${formatNumber(data?.xp_person)}/${formatNumber(
                    data?.xp_person_reach
                  )}`}
                </span>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={xpPersonPercent}
                  trackStyle={{
                    backgroundColor: "rgba(255, 206, 86, 0.6)",
                    height: 6,
                  }}
                  handleStyle={{
                    borderColor: "rgba(255, 206, 86, 0.6)",
                    height: 16,
                    width: 16,
                  }}
                  railStyle={{ backgroundColor: "#ddd", height: 6 }}
                  marks={
                    xpPersonPercent <= 100
                      ? {
                          [xpPersonPercent]: `${Math.min(
                            xpPersonPercent,
                            100
                          )}%`,
                          100: "100%",
                        }
                      : { 0: "0%", 100: "100%" }
                  }
                />
              </Col>
            </Row>

            <Row className="h-[70px]">
              <Col xs="11">
                <span>
                  Điểm tích lũy nhóm:{" "}
                  {`${formatNumber(data?.xp_group)}/${formatNumber(
                    data?.xp_group_reach
                  )}`}
                </span>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={xpGroupPercent}
                  trackStyle={{
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    height: 6,
                  }}
                  handleStyle={{
                    borderColor: "rgba(255, 99, 132, 0.6)",
                    height: 16,
                    width: 16,
                  }}
                  railStyle={{ backgroundColor: "#ddd", height: 6 }}
                  marks={
                    xpGroupPercent <= 100
                      ? {
                          [xpGroupPercent]: `${Math.min(xpGroupPercent, 100)}%`,
                          100: "100%",
                        }
                      : { 0: "0%", 100: "100%" }
                  }
                />
              </Col>
            </Row>

            <Row className="h-[70px]">
              <Col xs="11">
                <span>
                  Cơ cấu hệ thống: {`${data?.no_child}/${data?.no_child_reach}`}
                </span>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={noChildPercent}
                  trackStyle={{
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    height: 6,
                  }}
                  handleStyle={{
                    borderColor: "rgba(54, 162, 235, 0.6)",
                    height: 16,
                    width: 16,
                  }}
                  railStyle={{ backgroundColor: "#ddd", height: 6 }}
                  marks={
                    noChildPercent <= 100
                      ? {
                          [noChildPercent]: `${Math.min(noChildPercent, 100)}%`,
                          100: "100%",
                        }
                      : { 0: "0%", 100: "100%" }
                  }
                />
              </Col>
            </Row> */}
						{/* <Row className="h-[35px] text-center">
              <div>
                {dataQuery?.content?.is_pass ? (
                  <>
                    <i
                      id="check"
                      className="fa fa-check text-5xl text-blue-700"
                      aria-hidden="true"
                    ></i>
                    <Tooltip
                      placement="right"
                      isOpen={tooltipCheck}
                    //   autohide={false}
                    //   target="check"
                      toggle={toggleCheck}
                    >
                      Tài khoản đủ điều kiện thăng tiến
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <i
                      id="unCheck"
                      className="fa fa-times text-5xl text-red-700"
                      aria-hidden="true"
                    ></i>
                    <Tooltip
                      placement="right"
                      isOpen={tooltipUnCheck}
                      autohide={false}
                      target="unCheck"
                      toggle={toggleUnCheck}
                    >
                      Tài khoản chưa đủ điều kiện thăng tiến
                    </Tooltip>
                  </>
                )}
              </div>
            </Row> */}
					</div>
				)}
			</div>
		</div>
	);
};

export default LevelUpProcess;
