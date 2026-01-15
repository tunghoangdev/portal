import { createContext, useContext, useEffect, useState } from 'react';
import { getUserFromToken } from '~/lib/auth';

type User = {
	id?: string;
	email?: string;
	role?: 'staff' | 'agent'; // Giới hạn role chỉ có thể là staff hoặc agent
	permissions?: string[]; // Thêm permissions để kiểm soát quyền chi tiết hơn
};

type AuthContextType = {
	user: User | null;
	isLoggedIn: boolean;
	isStaff: boolean;
	isAgent: boolean;
	hasPermission: (permission: string) => boolean;
};

const AuthContext = createContext<AuthContextType>({
	user: null,
	isLoggedIn: false,
	isStaff: false,
	isAgent: false,
	hasPermission: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const u: any = getUserFromToken();
		if (u) setUser(u);
	}, []);

	const isLoggedIn = !!user;
	const isStaff = user?.role === 'staff';
	const isAgent = user?.role === 'agent';

	// Hàm kiểm tra quyền
	const hasPermission = (permission: string) => {
		if (!user) return false;

		// Staff có tất cả quyền
		if (isStaff) return true;

		// Agent chỉ có quyền được cấp
		return user.permissions?.includes(permission) || false;
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoggedIn,
				isStaff,
				isAgent,
				hasPermission,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
