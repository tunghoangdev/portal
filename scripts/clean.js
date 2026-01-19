import fs from 'fs';
import path from 'path';

const mode = process.argv[2];
if (!mode) {
  console.log('No mode specified for cleaning. Usage: node scripts/clean.js <mode>');
  process.exit(1);
}

const dir = path.resolve(process.cwd(), mode);

if (fs.existsSync(dir)) {
  console.log(`🗑️  Cleaning build directory: ${dir}...`);
  try {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`✅ Cleaned: ${dir}`);
  } catch (error) {
    console.error(`❌ Error cleaning directory ${dir}:`, error);
    process.exit(1);
  }
} else {
  console.log(`ℹ️  Directory not found (nothing to clean): ${dir}`);
}
