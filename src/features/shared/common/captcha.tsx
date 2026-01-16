import { useCallback, useEffect, useRef, useState } from "react";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui";
import { cn } from "~/lib/utils";

interface Props {
  onNext: () => void;
  length?: number;
  isLoading?: boolean;
}

export const Captcha = ({ onNext, length = 4, isLoading }: Props) => {
  const [captcha, setCaptcha] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hàm tạo chuỗi captcha ngẫu nhiên
  const generateCaptcha = useCallback(() => {
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let captchaText = "";
    for (let i = 0; i < length; i++) {
      captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captchaText;
  }, [length]);

  const drawCaptcha = useCallback((text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#f9fafb"; // gray-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise (lines)
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 100 + 100}, ${
        Math.random() * 100 + 100
      }, ${Math.random() * 100 + 100}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Add noise (dots)
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 100 + 100}, ${
        Math.random() * 100 + 100
      }, ${Math.random() * 100 + 100}, 0.5)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    // Draw text
    const fontSize = 36;
    ctx.font = `bold ${fontSize}px "Courier New", monospace`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const charWidth = canvas.width / (text.length + 1);

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      ctx.save();
      // Position
      const x = charWidth * (i + 1);
      const y = canvas.height / 2;

      // Translate to position
      ctx.translate(x, y);

      // Rotate
      const angle = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25 radians
      ctx.rotate(angle);

      // Random color for text (darker for contrast)
      const r = Math.floor(Math.random() * 100);
      const g = Math.floor(Math.random() * 100);
      const b = Math.floor(Math.random() * 100);
      ctx.fillStyle = `rgb(${r},${g},${b})`;

      ctx.fillText(char, 0, 0);

      ctx.restore();
    }
  }, []);

  useEffect(() => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
  }, [generateCaptcha]);

  useEffect(() => {
    if (captcha) {
      drawCaptcha(captcha);
    }
  }, [captcha, drawCaptcha]);

  // Hàm làm mới captcha
  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    setInput("");
    setError("");
  };

  // Xử lý xác thực captcha khi form submit
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (captcha === input) {
      onNext();
    } else {
      setError("Captcha không khớp. Vui lòng thử lại.");
      refreshCaptcha();
    }
  };

  const isValidInput = input.length === length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Xác thực Captcha
      </h2>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-inner bg-gray-50">
          <canvas
            ref={canvasRef}
            width={300}
            height={60}
            className="block cursor-pointer"
            onClick={refreshCaptcha}
            title="Nhấn để đổi mã khác"
          />
        </div>

        <Button
          onPress={refreshCaptcha}
          isDisabled={isLoading}
          isIconOnly
          className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          variant="light"
          aria-label="Làm mới captcha"
        >
          <Icons.refresh size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:w-[350px]">
        <div>
          <input
            type="text"
            value={input}
            autoFocus
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập các ký tự ở trên"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg tracking-widest font-medium"
            maxLength={length}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">
            {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          isDisabled={!isValidInput || isLoading}
          className={cn(
            "w-full py-3 rounded-lg font-semibold text-white transition-all shadow-md",
            isValidInput && !isLoading
              ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform active:scale-[0.98]"
              : "bg-gray-400 cursor-not-allowed"
          )}
        >
          {isLoading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </form>
    </div>
  );
};
