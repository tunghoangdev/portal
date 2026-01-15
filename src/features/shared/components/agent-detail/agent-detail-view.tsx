import { Tabs, Tab } from "@heroui/react";
import DashboardPageClient from "~/features/dashboard/page.client";
import { IndividualLifeList, IndividualNonlifeContract } from "./tab-views";
import { useState } from "react";
import { AbroadList } from "./tab-views/abroad-list";

const items = [
  {
    id: "1",
    name: "Dashboard",
    content: <DashboardPageClient />,
  },
  {
    id: "2",
    name: "Di trú",
    content: <AbroadList />,
  },
  {
    id: "3",
    name: "Nhân thọ",
    content: <IndividualLifeList />,
  },
  {
    id: "4",
    name: "Phi nhân thọ",
    content: <IndividualNonlifeContract />,
  },
];

export const AgentDetailView = () => {
  // *** STATE ***
  const [activeTab, setActiveTab] = useState<any>("1");
  return (
    <Tabs
      aria-label={"Thông tin chi tiết agent"}
      selectedKey={activeTab}
      onSelectionChange={setActiveTab}
      classNames={{
        tabContent:
          "text-black/70 hover:text-black dark:text-white dark:hover:text-white",
      }}
    >
      {items.map((item: any) => (
        <Tab key={item.id} title={item.name}>
          {item.content}
        </Tab>
      ))}
    </Tabs>
  );
};
