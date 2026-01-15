import React, { useState } from 'react';
import {
	Button,
	Modal,
	ModalBody,
	ModalHeader,
	Stack,
	Typography,
} from '~/components/ui';
import { ModalContent, useDisclosure } from '@heroui/react';
import { useCrud } from '~/hooks/use-crud-v2';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { validatePhone } from '~/schema-validations';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '../form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
const defaultValues = {
	code: '0000',
	agent_phone: '',
};
const formSchema = z.object({
	code: z.string().optional(),
	agent_phone: validatePhone('SĐT người giới thiệu'),
});
export default function SignUpForm() {
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const basePath = API_ENDPOINTS.agent.search.byParent;
	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	}: any = useForm({
		mode: 'all',
		resolver: zodResolver(formSchema),
		defaultValues,
	});
	const { create } = useCrud([basePath], {
		endpoint: '',
	});
	const { mutateAsync: checkParentPhone } = create();
	const onSubmit = async (data: any) => {
		const res = await checkParentPhone({
			...data,
			_customUrl: basePath,
			_hideMessage: true,
		});
		const { parent_phone, is_open } = res || {};
		if (!is_open && parent_phone) {
			reset();
			return toast.error(
				'Người tuyển dụng đã bị khóa!, vui lòng liên hệ với quản trị viên.',
			);
		}

		if (parent_phone) {
			reset();
			navigate({ to: `/register?code=${data.code}&staff=${parent_phone}` });
		}
	};
	return (
		<>
			<Stack
				alignItems={'center'}
				justifyContent={'start'}
				className="w-full gap-x-2.5 flex-wrap"
			>
				<Typography variant="body2r" className="text-default-700 text-xs">
					Bạn chưa có tài khoản?
				</Typography>
				<Button
					onClick={onOpen}
					variant="light"
					color="primary"
					className="h-auto p-0 min-h-0 min-w-0 w-auto text-xs font-semibold"
				>
					Đăng ký thành viên
				</Button>
			</Stack>

			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size="md"
				onClose={onClose}
				classNames={{
					body: 'gap-y-5 pb-10',
				}}
			>
				<ModalContent>
					<ModalHeader>Thông tin người giới thiệu</ModalHeader>
					<ModalBody>
						<TextField
							control={control}
							name="agent_phone"
							label="SĐT người giới thiệu"
							placeholder="Nhập mã sđt người giới thiệu..."
							errorMessage={errors.agent_phone?.message}
						/>

						<Button
							onClick={handleSubmit(onSubmit)}
							color="primary"
							isDisabled={!isValid}
						>
							Xác nhận
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
