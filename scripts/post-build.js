import fs from 'fs';
import path from 'path';

const mode = process.argv[2]; // 'beta' hoặc 'prod'
if (!mode) {
  console.error('Vui lòng cung cấp môi trường (beta hoặc prod)');
  process.exit(1);
}

const buildRoot = path.resolve(mode);
const clientDir = path.join(buildRoot, 'client');
const serverDir = path.join(buildRoot, 'server');

async function cleanup() {
  try {
    console.log(`🧹 Đang dọn dẹp folder build cho môi trường: ${mode.toUpperCase()}...`);

    // 1. Sao chép _shell.html thành index.html (nếu chưa có)
    const shellPath = path.join(clientDir, '_shell.html');
    const indexPath = path.join(clientDir, 'index.html');
    if (fs.existsSync(shellPath)) {
      let content = fs.readFileSync(shellPath, 'utf8');
      
      // Không sửa đường dẫn thành tương đối nữa, để nguyên đường dẫn tuyệt đối (bắt đầu bằng /)
      // để đảm bảo hoạt động đúng với nested routes và IIS Rewrite.
      // content = content.replace(/(href|src)="\/assets\//g, '$1="assets/');
      
      fs.writeFileSync(indexPath, content);
      console.log('✅ Đã tạo index.html');
    }

    // 2. Di chuyển toàn bộ file trong client/ ra thư mục gốc (beta/ hoặc prod/)
    const files = fs.readdirSync(clientDir);
    for (const file of files) {
      const oldPath = path.join(clientDir, file);
      const newPath = path.join(buildRoot, file);

      // Nếu đã tồn tại file/folder cũ ở root thì xóa đi để ghi đè
      if (fs.existsSync(newPath)) {
        fs.rmSync(newPath, { recursive: true, force: true });
      }
      fs.renameSync(oldPath, newPath);
    }
    console.log(`✅ Đã chuyển toàn bộ tài nguyên ra thư mục: /${mode}`);

    // 3. Xóa thư mục client và server dư thừa
    fs.rmSync(clientDir, { recursive: true, force: true });
    fs.rmSync(serverDir, { recursive: true, force: true });
    
    // Xóa các file thừa của Vinxi/Nitro nếu có
    const manifestPath = path.join(buildRoot, 'route-manifest.json');
    if (fs.existsSync(manifestPath)) fs.unlinkSync(manifestPath);

    console.log('🚀 HOÀN THÀNH: Bạn có thể point IIS trực tiếp vào folder này!');
  } catch (err) {
    console.error('❌ Lỗi trong quá trình dọn dẹp:', err);
    process.exit(1);
  }
}

cleanup();
