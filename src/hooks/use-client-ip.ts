import { useState, useEffect } from 'react';

// Khai báo kiểu dữ liệu cho giá trị trả về
interface UseClientIpResult {
	ip: string | null;
	loading: boolean;
	error: string | null;
}

export function useClientIp(): UseClientIpResult {
	const [ip, setIp] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchIp = async () => {
			let currentIp: string | null = null;
			try {
				try {
					const res1 = await fetch('https://checkip.amazonaws.com/');
					if (res1.ok) {
						const rawIp = await res1.text();
						const trimmedIp = rawIp.trim();
						if (trimmedIp.length > 0) {
							currentIp = trimmedIp;
						}
					}
				} catch (awsError) {
					console.warn(
						'AWS checkip failed. Attempting fallback to ipify.',
						awsError,
					);
				}
				if (!currentIp) {
					try {
						const res2 = await fetch('https://api.ipify.org?format=json');

						if (res2.ok) {
							const data = await res2.json();

							if (data?.ip) {
								currentIp = data.ip;
							}
						}
					} catch (ipifyError) {
						console.error('ipify also failed.', ipifyError);
					}
				}

				if (currentIp && currentIp.length > 0) {
					setIp(currentIp);
					setError(null);
				} else {
					throw new Error('Cả hai dịch vụ tra cứu IP đều thất bại.');
				}
			} catch (err) {
				// Xử lý lỗi cuối cùng
				setError('Không thể lấy IP');
				setIp(null);
			} finally {
				setLoading(false);
			}
		};

		fetchIp();
	}, []);

	return { ip, loading, error };
}
