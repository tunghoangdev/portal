// export default function CustomLoader({
//   src,
//   width,
//   quality,
// }: {
//   src: string;
//   width: number;
//   quality?: number;
// }) {
//   return `https://portal.exwork.vn/${src}?w=${width}&q=${quality || 75}`;
// }

export default function CustomLoader({ src, width, quality }: any) {
	const cloudName = 'dnckohpw2'; // đổi thành cloud name của bạn
	const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`;
	// Tạo transformation string (resize, nén)
	const transformations = ['c_fill', `w_${width}`, `q_${quality || 75}`].join(
		',',
	);
	// Nếu src đã là full URL thì chỉ lấy phần path
	const publicId = src.replace(
		/^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//,
		'',
	);
	return `${baseUrl}${transformations}/${publicId}`;
}
