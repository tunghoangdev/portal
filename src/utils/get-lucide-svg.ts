import * as icons from 'lucide-static';

export function getLucideSvg(name: string, attrs: Record<string, string> = {}) {
	const icon = (icons as Record<string, string>)[name];
	if (!icon) return '';
	const attrStr = Object.entries(attrs)
		.map(([k, v]) => `${k}="${v}"`)
		.join(' ');
	return icon.replace('<svg', `<svg ${attrStr}`);
}
