import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { cn } from '~/lib/utils';
import { useIsMobile } from '~/hooks/use-mobile';
const items = ['bg1.png'];
export default function Carousel() {
	const isMobile = useIsMobile();
	return (
		<div className="w-full h-full">
			<Swiper
				slidesPerView={1}
				observer
				observeParents
				loop
				pagination
				navigation
				modules={[Pagination, Navigation, Autoplay]}
				autoplay={{
					delay: 2000,
					disableOnInteraction: false,
				}}
				className={cn({
					'[&_.swiper-button-prev]:!hidden [&_.swiper-button-next]:!hidden':
						isMobile,
				})}
			>
				{items.map((item) => (
					<SwiperSlide key={item}>
						<img src={`/images/${item}`} alt={item} />
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
