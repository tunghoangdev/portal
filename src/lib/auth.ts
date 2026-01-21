import { BRAND_LOGO_ICON, ROLES, TOKEN, USER_DATA } from '~/constant';
import type { User } from '~/types/user';

// export function getToken(): string | null {
// 	const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
// 	return match ? decodeURIComponent(match[1]) : null;
// }

export function getToken(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem(TOKEN);
}

export function getUser(): User {
	if (typeof window === 'undefined') return {} as User;
	const user = localStorage.getItem(USER_DATA);
	const data = JSON.parse(user || '{}');
	return data?.state?.user;
}

export const getFullFtpStoreUrl = (
	fileName: string | null,
) => {
	const userData = getUser();
	const ftp = userData?.ftp_web_samtek || '';
	if (fileName) {
		return `${ftp}/${fileName}`;
	}
	return BRAND_LOGO_ICON;
};

export const getFullFtpUrl = (
	folderPath: string | 'notify',
	fileName: string | null,
	companyCode = '',
) => {
	const userData = getUser();
	const ftp = userData?.ftp_web || '';
	const codeKey = userData?.role === ROLES.SAMTEK ? '': `${userData?.code_key || companyCode}/`;
	if (fileName) {
		return `${ftp}/${codeKey}${folderPath}/${fileName}`;
	}
	return BRAND_LOGO_ICON;
};
export function setAccessToken(token: string) {
	document.cookie = `token=${encodeURIComponent(
		token,
	)}; path=/; max-age=900; secure; samesite=strict`;
}

export function removeAccessToken() {
	document.cookie = 'token=; path=/; max-age=0';
}

export function setRefreshToken(token: string) {
	if (typeof window === 'undefined') return;
	localStorage.setItem('refresh_token', token);
}

export function getRefreshToken(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('refresh_token');
}

export function removeRefreshToken() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem('refresh_token');
}

export function isTokenExpired(token: string): boolean {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		const now = Math.floor(Date.now() / 1000);
		return payload.exp < now;
	} catch {
		return true;
	}
}

export async function refreshAccessToken(): Promise<string | null> {
	const refreshToken = getRefreshToken();
	if (!refreshToken) return null;

	try {
		// THAY THẾ URL NÀY BẰNG ENDPOINT API LÀM MỚI TOKEN CỦA BẠN
		const res = await fetch('https://your-api.com/refresh', {
			// <-- THAY ĐỔI Ở ĐÂY
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: refreshToken }),
		});

		if (!res.ok) return null;

		const { access_token, refresh_token } = await res.json();

		if (access_token) setAccessToken(access_token);
		if (refresh_token) setRefreshToken(refresh_token);

		return access_token;
	} catch {
		return null;
	}
}
export function getUserFromToken(): User | null {
	const token = getToken();
	if (!token) return null;

	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload;
	} catch {
		return null;
	}
}
export function logout() {
	if (typeof window === 'undefined') return;
	removeAccessToken();
	removeRefreshToken();
	localStorage.removeItem(USER_DATA);
	window.location.href = '/login';
}
