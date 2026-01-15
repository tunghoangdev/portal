import { Copy } from "react-feather";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { getFullFtpUrl } from "~/lib/auth";
import { getCodeKey } from "~/auth/utils";
import { Icons } from "~/components/icons";
import { LevelCell } from "./cells";
export default function RecruitmentQRCode({ data }: any) {
  const { agent_name: name, agent_phone: phone, agent_avatar } = data || {};
  const [copied, setCopied] = useState(false);
  const codeKey = getCodeKey();
  const link = `${window.location.origin}/register?code=${codeKey}&staff=${phone}`;
  // const link = `${window.location.origin}/register/${codeKey}/${phone}`;

  const avatar = getFullFtpUrl("avatar", agent_avatar);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data) return null;

  return (
    <div className="mx-auto my-8 p-8 bg-white space-y-6 max-w-md w-full">
      {/* QR Code Container */}
      <div className="relative mx-auto w-fit">
        <QRCodeSVG
          value={link}
          size={256}
          level="H"
          className="p-4 border-2 border-gray-100 rounded-xl bg-gray-50"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src={avatar}
            alt="Logo"
            className="w-20 h-20 rounded-full border-[3px] border-white shadow-sm"
          />
        </div>
      </div>

      {/* Information Section */}
      <div className="space-y-3 text-center">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          {name} <LevelCell data={data} className="text-sm" />
        </h2>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Icons.phone className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-medium">{phone}</span>
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 px-6 py-3   
                 bg-blue-600 hover:bg-blue-700 text-white rounded-xl   
                 transition-all duration-300 shadow-md hover:shadow-lg  
                 active:scale-95"
      >
        <Copy className="w-5 h-5" />
        <span className="font-semibold">
          {copied ? "Đã sao chép!" : "Sao chép liên kết đăng ký"}
        </span>
      </button>
    </div>
  );
}
