import axios from 'axios';
import { PROXY_URL } from './constants';
import {
	getAccessToken,
	getCodeKey,
	getSecretKey,
	getUserData,
	// logout,
} from '@/auth/utils';
import URLS from './urls';
import { getUser, logout } from '@/lib/auth';
import { API_BASE_URL } from '@/constant/api-endpoints';
export const axiosClient = async ({ url, data = {}, headers }) => {
	// const userData = getUserData()
	const userData = getUser();
	if (!data.id && userData?.id && userData?.role === 'agent') {
		data.id = userData?.id;
	}

	if (userData?.role === 'staff' && !data.id_staff) {
		data.id_staff = userData.id;
		data.id_staff_action = userData.id;
	} else {
		data.id_staff_action = 0;
	}

	if (userData?.token) {
		data.token = userData?.token;
	}

	if (!data.secret_key) {
		const secret_key = userData?.secret_key || '';

		data.secret_key = secret_key;
	}

	const urlRequest = API_BASE_URL + url;
	const response = await axios
		.post(urlRequest, data, {
			headers,
		})
		.then((res) => res.data);

	if (response.status === 2 && response.error_code === '1') {
		const currentPath = window.location.pathname;
		if (currentPath !== '/login') {
			window.location.href = '/login';
			logout();
		}
	}

	return response;
};

export const uploadAvatar = async (file) => {
	const formData = new FormData();

	formData.append('file', file);
	formData.append(getCodeKey(), getCodeKey());

	const url = URLS.upload.avatar;
	const urlRequest = API_BASE_URL + url;
	return await axios
		.post(urlRequest, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => res.data);
};

export const uploadImageNotify = async (file) => {
	const formData = new FormData();

	formData.append('file', file);
	formData.append(getCodeKey(), getCodeKey());

	const url = URLS.upload.imageNotify;
	const urlRequest = API_BASE_URL + url;
	return await axios
		.post(urlRequest, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => res.data);
};

export const uploadImageCCCD = async (file) => {
	const formData = new FormData();

	formData.append('file', file);
	formData.append(getCodeKey(), getCodeKey());

	const url = URLS.upload.cccd;
	const urlRequest = API_BASE_URL + url;
	return await axios
		.post(urlRequest, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => res.data);
};

export const uploadFile = async (file) => {
	const formData = new FormData();

	formData.append('file', file);
	formData.append(getCodeKey(), getCodeKey());

	const url = URLS.upload.file;
	const urlRequest = API_BASE_URL + url;
	return await axios
		.post(urlRequest, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => res.data);
};
