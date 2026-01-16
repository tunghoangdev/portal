import fs from "fs";
import path from "path";
import { MENU_SETTINGS } from "../src/constant/site-menu";

const ROUTES_DIR = path.join(process.cwd(), "src/routes/_authed");

function generateRouteFile(url: string, label: string) {
  // TanStack Router dùng dấu . hoặc / cho folder.
  // Để đơn giản và dễ quản lý, chúng ta sẽ tạo theo cấu trúc folder /
  // Ví dụ: /agent/dashboard -> src/routes/_authed/agent/dashboard.tsx

  // Loại bỏ dấu / ở đầu nếu có
  const cleanPath = url.startsWith("/") ? url.slice(1) : url;
  const filePath = path.join(ROUTES_DIR, `${cleanPath}.tsx`);
  const dirPath = path.dirname(filePath);

  // Tạo thư mục nếu chưa có
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Không ghi đè nếu file đã tồn tại để tránh mất code bạn đã viết
  if (fs.existsSync(filePath)) {
    // console.log(`⏩ Skipped: ${url} (Already exists)`);
    return;
  }

  // Tạo tên Component đẹp mắt (Ví dụ: agent/abroad/list-processing -> AgentAbroadListProcessing)
  const componentName = cleanPath
    .split(/[\/\-\.]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

  const content = `import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/${url.startsWith("/") ? url.slice(1) : url}')({
  component: ${componentName}Page,
})

function ${componentName}Page() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">${label}</h1>
        <p className="text-muted-foreground">
          Đường dẫn: <code className="bg-muted px-1.1 rounded">${url}</code>
        </p>
      </div>
      
      <div className="min-h-[400px] flex items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-xl font-semibold tracking-tight">Trang đang phát triển</h3>
          <p className="text-sm text-muted-foreground">
            Bạn có thể bắt đầu chỉnh sửa file <code>src/routes/_authed/${cleanPath}.tsx</code>
          </p>
        </div>
      </div>
    </div>
  )
}
`;

  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${cleanPath}.tsx`);
}

function processMenu(items: any[]) {
  items.forEach((item) => {
    if (item.url && item.url !== "#") {
      generateRouteFile(item.url, item.label);
    }
    if (item.children && item.children.length > 0) {
      processMenu(item.children);
    }
  });
}

console.log("🚀 Starting route generation...");

// Chạy cho các group menu
Object.keys(MENU_SETTINGS).forEach((role) => {
  console.log(`\nProcessing routes for role: ${role}`);
  processMenu(MENU_SETTINGS[role]);
});

console.log(
  "\n✨ Done! TanStack Router will now update routeTree.gen.ts automatically."
);
