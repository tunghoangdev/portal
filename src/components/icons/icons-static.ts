import { h } from '@revolist/react-datagrid';
import * as lucide from 'lucide-static';

export function getLucideSvg(
	name: string,
	attrs: Record<string, string | number> = {},
) {
	const icon = (lucide as Record<string, string>)[name];
	if (!icon) return '';
	const attrStr = Object.entries(attrs)
		.map(([k, v]) => `${k}="${v}"`)
		.join(' ');
	return icon.replace('<svg', `<svg ${attrStr}`);
}

/**
 * Map lại giống file Icons JSX cũ
 */
export const IconStatic = {
	house: getLucideSvg('House'),
	trendingUp: getLucideSvg('TrendingUp'),
	trendingDown: getLucideSvg('TrendingDown'),
	bookHeart: getLucideSvg('BookHeart'),
	scrollText: getLucideSvg('ScrollText'),
	bell: getLucideSvg('Bell'),
	scroll: getLucideSvg('Scroll'),
	bold: getLucideSvg('Bold'),
	italic: getLucideSvg('Italic'),
	underline: getLucideSvg('Underline'),
	boxes: getLucideSvg('Boxes'),
	recycle: getLucideSvg('Recycle'),
	shuffle: getLucideSvg('Shuffle'),
	listCheck: getLucideSvg('ListChecks'),
	listFilter: getLucideSvg('ListFilter'),
	doubleCheck: getLucideSvg('CheckCheck'),
	rotateCcw: getLucideSvg('RotateCcw'),
	phone: getLucideSvg('Phone'),
	save: getLucideSvg('Save'),
	lock: getLucideSvg('Lock'),
	unlock: getLucideSvg('LockOpen'),
	lockOpen: getLucideSvg('LockOpen'),
	triangle: getLucideSvg('AlertTriangle'),
	excel: getLucideSvg('FileSpreadsheet'),
	moreHorizontal: getLucideSvg('MoreHorizontal'),
	image: getLucideSvg('Image'),
	power: getLucideSvg('Power'),
	columns3Cog: getLucideSvg('Columns3'),
	ellipsisVertical: getLucideSvg('EllipsisVertical'),
	circleCheck: getLucideSvg('CircleCheck'),
	fileText: getLucideSvg('FileText'),
	loader: getLucideSvg('Loader'),
	loaderCircle: getLucideSvg('LoaderCircle'),
	folder: getLucideSvg('Folder'),
	folderArchive: getLucideSvg('FolderArchive'),
	folderKanban: getLucideSvg('FolderKanban'),
	chartCol: getLucideSvg('ChartNoAxesColumnIncreasing'),
	chartCombined: getLucideSvg('ChartNoAxesCombined'),
	bookUser: getLucideSvg('BookUser'),
	octagon: getLucideSvg('Octagon'),
	octagonAlert: getLucideSvg('OctagonAlert'),
	bookImage: getLucideSvg('BookImage'),
	usersRounded: getLucideSvg('UsersRound'),
	userRounded: getLucideSvg('UserRound'),
	banknote: getLucideSvg('Banknote'),
	circleUser: getLucideSvg('CircleUser'),
	fileUser: getLucideSvg('FileUser'),
	clipboardList: getLucideSvg('ClipboardList'),
	notebookTabs: getLucideSvg('NotebookTabs'),
	sun: getLucideSvg('SunMedium'),
	moon: getLucideSvg('Moon'),
	star: getLucideSvg('Star'),
	panelLeft: getLucideSvg('PanelLeft'),
	twitter: getLucideSvg('Twitter'),
	close: getLucideSvg('X'),
	closeCircle: getLucideSvg('CircleX'),
	spinner: getLucideSvg('Loader2'),
	packageBox: getLucideSvg('Package'),
	eye: getLucideSvg('Eye'),
	eyeOff: getLucideSvg('EyeOff'),
	list: getLucideSvg('List'),
	database: getLucideSvg('Database'),
	inbox: getLucideSvg('Inbox'),
	archive: getLucideSvg('Archive'),
	chevronLeft: getLucideSvg('ChevronLeft'),
	chevronRight: getLucideSvg('ChevronRight'),
	chevronsLeft: getLucideSvg('ChevronsLeft'),
	chevronsRight: getLucideSvg('ChevronsRight'),
	chevronUp: getLucideSvg('ChevronUp'),
	chevronDown: getLucideSvg('ChevronDown'),
	chevronUpDown: getLucideSvg('ChevronsUpDown'),
	arrowUp: getLucideSvg('ArrowUp'),
	arrowDown: getLucideSvg('ArrowDown'),
	arrowLeft: getLucideSvg('ArrowLeft'),
	arrowRight: getLucideSvg('ArrowRight'),
	menu: getLucideSvg('Menu'),
	venusAndMars: getLucideSvg('VenusAndMars'),
	venus: getLucideSvg('Venus'),
	mars: getLucideSvg('Mars'),
	heart: getLucideSvg('Heart'),
	mail: getLucideSvg('Mail'),
	building: getLucideSvg('Building'),
	verticalThreeDots: getLucideSvg('MoreVertical'),
	horizontalThreeDots: getLucideSvg('MoreHorizontal'),
	verticalSliders: getLucideSvg('Sliders'),
	horizontalSliders: getLucideSvg('SlidersHorizontal'),
	history: getLucideSvg('History'),
	circle: getLucideSvg('Circle'),
	circleCheckBig: getLucideSvg('CircleCheckBig'),
	clipboard: getLucideSvg('Clipboard'),
	circleHelp: getLucideSvg('CircleHelp'),
	check: getLucideSvg('Check'),
	checkSquare: getLucideSvg('CheckSquare'),
	add: getLucideSvg('Plus'),
	addCircle: getLucideSvg('PlusCircle'),
	scanQrCode: getLucideSvg('ScanQrCode'),
	remove: getLucideSvg('Minus'),
	view: getLucideSvg('Eye'),
	hide: getLucideSvg('EyeOff'),
	trash: getLucideSvg('Trash'),
	edit: getLucideSvg('Edit'),
	more_vertical: getLucideSvg('MoreVertical'),
	crop: getLucideSvg('Crop'),
	reset: getLucideSvg('RefreshCw'),
	send: getLucideSvg('Send'),
	copy: getLucideSvg('Copy'),
	link: getLucideSvg('Link'),
	gitBranch: getLucideSvg('GitBranch'),
	tool: getLucideSvg('FileSliders'),
	download: getLucideSvg('Download'),
	warning: getLucideSvg('AlertTriangle'),
	briefcaseBusiness: getLucideSvg('BriefcaseBusiness'),
	search: getLucideSvg('Search'),
	filter: getLucideSvg('Filter'),
	alarm: getLucideSvg('AlarmClock'),
	calendar: getLucideSvg('CalendarDays'),
	calendarCheck: getLucideSvg('CalendarCheck'),
	user: getLucideSvg('User'),
	users: getLucideSvg('Users'),
	login: getLucideSvg('LogIn'),
	order: getLucideSvg('ScrollText'),
	terminal: getLucideSvg('FileTerminal'),
	settings: getLucideSvg('Settings'),
	logout: getLucideSvg('LogOut'),
	volume: getLucideSvg('Volume2'),
	volumeMute: getLucideSvg('VolumeX'),
	message: getLucideSvg('MessageSquare'),
	messageMore: getLucideSvg('MessageSquareMore'),
	billing: getLucideSvg('CreditCard'),
	wallet: getLucideSvg('Wallet'),
	dollarSign: getLucideSvg('DollarSign'),
	cart: getLucideSvg('ShoppingCart'),
	shoppingBag: getLucideSvg('ShoppingBag'),
	product: getLucideSvg('Package'),
	store: getLucideSvg('ShoppingBag'),
	chart: getLucideSvg('BarChart3'),
	upload: getLucideSvg('Upload'),
	info: getLucideSvg('Info'),
	thumbUp: getLucideSvg('ThumbsUp'),
	thumbDown: getLucideSvg('ThumbsDown'),
	uploadClound: getLucideSvg('UploadCloud'),
	placeholder: getLucideSvg('Image'),
	clothing: getLucideSvg('Shirt'),
	shoes: getLucideSvg('Footprints'),
	accessories: getLucideSvg('HardHat'),
	pause: getLucideSvg('Pause'),
	play: getLucideSvg('Play'),
	truck: getLucideSvg('Truck'),
	creditCard: getLucideSvg('CreditCard'),
	mapPin: getLucideSvg('MapPin'),
	shield: getLucideSvg('Shield'),
	clock: getLucideSvg('Clock'),
	refresh: getLucideSvg('RefreshCw'),
	file: getLucideSvg('File'),
	fileDown: getLucideSvg('FileDown'),
	share: getLucideSvg('Share2'),
	grid: getLucideSvg('Grid'),

	// Icon custom không có trong lucide-static
	emptyData: `
	<svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
		<path d="M17 6.33228L9 16.9989V54.3323C9 55.7468 9.5619 57.1033 10.5621 58.1035C11.5623 59.1037 12.9188 59.6656 14.3333 59.6656H51.6667C53.0811 59.6656 54.4377 59.1037 55.4379 58.1035C56.4381 57.1033 57 55.7468 57 54.3323V16.9989L49 6.33228H17Z" />
		<path d="M9 16.9999H57" />
		<path d="M43.6663 27.6677C43.6663 30.4967 42.5425 33.2098 40.5421 35.2102C38.5418 37.2106 35.8286 38.3344 32.9997 38.3344C30.1707 38.3344 27.4576 37.2106 25.4572 35.2102C23.4568 33.2098 22.333 30.4967 22.333 27.6677" />
	</svg>
	`,
};

export const hIcon = (svgString: string, props: any = {}) => {
	if (!svgString) return null;

	// Clone để tránh ảnh hưởng đến bản gốc
	let svg = svgString;

	// Xử lý props phổ biến: size, strokeWidth, className
	if (props.size) {
		svg = svg.replace(/width="[^"]*"/, `width="${props.size}"`);
		svg = svg.replace(/height="[^"]*"/, `height="${props.size}"`);
	}

	if (props.strokeWidth) {
		if (svg.includes('stroke-width=')) {
			svg = svg.replace(
				/stroke-width="[^"]*"/,
				`stroke-width="${props.strokeWidth}"`,
			);
		} else {
			svg = svg.replace('<svg', `<svg stroke-width="${props.strokeWidth}"`);
		}
	}

	if (props.className) {
		if (svg.includes('class=')) {
			svg = svg.replace(/class="([^"]*)"/, `class="$1 ${props.className}"`);
		} else {
			svg = svg.replace('<svg', `<svg class="${props.className}"`);
		}
	}

	// Tạo node HTML với h() tương tự như bạn dùng trong RevoGrid
	return h('span', { innerHTML: svg });
};
