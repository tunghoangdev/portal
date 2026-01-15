import { Link } from '@tanstack/react-router'

export function NotFound({ children }: { children?: any }) {
  return (
   <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
			<div className="w-full text-center">
				<h2 className="mb-4 text-xl font-bold">Trang không tồn tại 🕵🏻‍♀️</h2>
				<p className="mb-8 text-lg">
					Oops! 😖 Trang bạn đang tìm kiếm không tồn tại trên máy chủ này.
				</p>
				<Link className="" to="/">
					Trở lại trang chủ
				</Link>
				<img
					className="mx-auto mt-5"
					alt="Not authorized page"
					src="/images/error.svg"
				/>
			</div>
			{/* <!-- Footer --> */}
			<p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
				&copy; {new Date().getFullYear()} - Samtek
			</p>
		</div>
  )
}
