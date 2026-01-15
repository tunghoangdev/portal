import { Tabs, Tab } from '@heroui/react';
import LifeCustomerList from './list-life';
import NoneLifeCustomer from './list-none-life';
import AbroadCustomerList from './list-abroad';
import { useState } from 'react';

export default function OrderHistory() {
	const [selectedKey, setSelectedKey] = useState<string>('abroad');
	return (
		<Tabs
			aria-label="Options"
			// variant="bordered"
			selectedKey={selectedKey}
			onSelectionChange={(key) => setSelectedKey(key as string)}
			classNames={{
				tabContent:
					'text-black/70 hover:text-black',
				panel: 'min-h-[500px]',
			}}
		>
			<Tab key="abroad" title="Di trú">
				<AbroadCustomerList />
			</Tab>
			<Tab key="life" title="Nhân thọ">
				<LifeCustomerList />
			</Tab>
			<Tab key="nonLife" title="Phi nhân thọ">
				<NoneLifeCustomer />
			</Tab>
		</Tabs>
	);
}
