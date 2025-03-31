import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay } from "swiper/modules"

import { SlideMain } from "./slide/SlideMain"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "./style/swiper_custom.sass"


export function SwiperCustom() {

  return (
    <div className="container">
      <Swiper className="mySwiper" id="swiper-custom" slidesPerView={1} spaceBetween={30} loop={true}
        pagination={{clickable: true}} navigation={true} modules={[Pagination, Navigation, Autoplay]}
        autoplay={{delay: 3500, disableOnInteraction: false}}
      >
        <SwiperSlide>
          <SlideMain/>
        </SwiperSlide>
        <SwiperSlide>
          <SlideMain/>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
