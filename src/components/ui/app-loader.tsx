// src/components/loading/AppLoader.tsx

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { useLoadingStore } from "~/stores"; // Điều chỉnh đường dẫn đến store của bạn

export function AppLoader({ children }: { children?: React.ReactNode }) {
  const { status, progress, startLoading, setProgress, completeLoading } =
    useLoadingStore();
  // Trạng thái để kiểm soát class CSS (opacity) và việc unmount
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false); // Trạng thái ẩn hoàn toàn sau animation

  const isMounted = useRef(false); // Dùng ref để theo dõi trạng thái mount lần đầu của component

  useEffect(() => {
    // Chỉ chạy logic tải nếu component được mount lần đầu
    // VÀ trạng thái splash screen là 'loading' (hoặc cần khởi tạo)
    if (!isMounted.current && status === "loading") {
      isMounted.current = true; // Đánh dấu đã mount

      const loadInitialData = async () => {
        startLoading(); // Đảm bảo trạng thái loading được bật

        try {
          // --- Các tác vụ tải dữ liệu ban đầu của bạn ---
          // Bạn sẽ thay thế các Promise này bằng các API calls, fetch data thực tế
          await new Promise((resolve) => setTimeout(resolve, 800)); // Giả lập tải user data
          setProgress(25);

          await new Promise((resolve) => setTimeout(resolve, 700)); // Giả lập tải cài đặt
          setProgress(50);

          await new Promise((resolve) => setTimeout(resolve, 600)); // Giả lập khởi tạo services
          setProgress(75);

          await new Promise((resolve) => setTimeout(resolve, 400)); // Giả lập hoàn tất các tác vụ cuối
          setProgress(100);

          // --- Kết thúc các tác vụ tải dữ liệu ban đầu ---

          completeLoading(); // Đánh dấu splash screen hoàn tất
        } catch (error) {
          console.error("Initial app load failed:", error);
          completeLoading(); // Vẫn hoàn tất để hiển thị ứng dụng
        }
      };

      loadInitialData();
    }
  }, [startLoading, setProgress, completeLoading, status]);

  // Logic điều khiển class CSS cho hiệu ứng fade out và unmount component
  useEffect(() => {
    if (status === "completed" && !isAnimatingOut && !isHidden) {
      setIsAnimatingOut(true); // Bắt đầu animation fade out
      const timer = setTimeout(() => {
        setIsHidden(true); // Sau khi animation kết thúc, ẩn hoàn toàn
      }, 500); // Phù hợp với duration của transition opacity
      return () => clearTimeout(timer);
    }
    if (status === "loading" && isHidden) {
      // Đảm bảo hiển thị lại nếu trạng thái chuyển về loading (mặc dù không mong đợi cho splash screen)
      setIsHidden(false);
      setIsAnimatingOut(false);
    }
  }, [status, isAnimatingOut, isHidden]);

  // Nếu đã ẩn hoàn toàn, render children (nội dung chính của app)
  if (isHidden) {
    return <>{children}</>;
  }

  return (
    // Sử dụng conditional classes cho opacity và transition
    <div
      className={`
                fixed inset-0 z-[99998] bg-black/50 flex flex-col items-center justify-center p-4
                transition-opacity duration-500 ease-out
                ${isAnimatingOut ? "opacity-0" : "opacity-100"}
            `}
    >
      <div className="relative flex items-center justify-center w-24 h-24 mb-4">
        <svg
          className="animate-spin -ml-1 mr-3 h-20 w-20 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="absolute text-white text-lg font-semibold select-none">
          {Math.floor(progress)}%
        </span>
      </div>
      {/* Optional: Thêm tin nhắn loading động */}
      <p className="text-white text-md mt-4 text-center">
        {progress < 25 && "Starting application..."}
        {progress >= 25 && progress < 50 && "Loading user data..."}
        {progress >= 50 && progress < 75 && "Initializing services..."}
        {progress >= 75 && "Almost there..."}
      </p>
    </div>
  );
}
