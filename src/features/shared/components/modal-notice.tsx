import { Modal, ModalContent, useDisclosure } from '~/components/ui';
import { HIDE_NOTIFICATION } from '~/constant';
import { useAuth, useLocalStorage } from '~/hooks';
import { getFullFtpUrl } from '~/lib/auth';
import { useEffect } from 'react';

export default function ModalNotice() {
	const { user } = useAuth();
	const [value, setValue] = useLocalStorage(HIDE_NOTIFICATION, '');
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	useEffect(() => {
		if (user?.image_notices && user?.image_notices !== value) onOpen();
	}, []);
	const handleClose = () => {
		setValue(user?.image_notices || '');
		onClose();
	};
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="5xl"
			onClose={handleClose}
			scrollBehavior="outside"
			classNames={{
				closeButton:
					'top-2 right-2 text-red-600 hover:cursor-pointer [&>svg]:w-6 [&>svg]:h-6',
			}}
		>
			<ModalContent className="max-h-[80vh] bg-transparent relative shadow-none">
				{(onClose) => (
					<>
						<img
							src={getFullFtpUrl('notify', user?.image_notices || '')}
							onError={onClose}
							alt=""
							className="max-w-full h-auto max-h-[90vh] object-contain"
						/>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
