
import fs from 'fs';
import path from 'path';

const dir = path.resolve('src/app/_authed');

function walk(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            walk(file, results);
        } else {
            if (file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk(dir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Look for the lazy import pattern
    const importMatch = content.match(/component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/);
    
    if (importMatch) {
        const importPath = importMatch[1];
        
        // Skip if already migrated
        if (content.includes('import { lazy')) return;

        console.log(`Migrating ${file}...`);

        // Extract the route path
        const routeMatch = content.match(/createFileRoute\(['"]([^'"]+)['"]\)/);
        if (!routeMatch) {
            console.log(`Skipping ${file} - could not find route path`);
            return;
        }
        const routePath = routeMatch[1];

        const newContent = `import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('${importPath}'))

export const Route = createFileRoute('${routePath}')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
`;

        fs.writeFileSync(file, newContent);
    }
});
