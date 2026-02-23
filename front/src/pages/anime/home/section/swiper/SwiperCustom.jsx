import { useRef } from "react"

import { useQueries, useQuery } from "@tanstack/react-query"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay } from "swiper/modules"

import { api } from "../../../../../api"

import { SlideMain } from "./slide/SlideMain"
import { Loader } from "../../../../../components/loader/Loader"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "./style.sass"


export function SwiperCustom() {
  const transitionRef = useRef()

  const {data: sliderData, isLoading, error} = useQuery({
    queryKey: ["slider"],
    staleTime: 1000 * 60 * 3,
    retry: false,
    queryFn: async () => {
      return await api.get("/slides").then(r => r.data)
    },
    placeholderData: []
  })
  
  const imgData = useQueries({
    queries: sliderData?.map(item => ({
      queryKey: ["slider-banner", item.anime.banner.uuid_banner],
      staleTime: 1000 * 60 * 3,
        queryFn: async () => {
          return await api.get(`/s3/anime-${item.anime.uuid}/${item.anime.banner.uuid_banner}`).then(r => r.data)
      }
    }))
  })

  return (
    <div className="container">
      <SwitchTransition mode="out-in">
        <CSSTransition 
          classNames="transition" 
          key={isLoading}
          nodeRef={transitionRef} 
          timeout={300}
        >
          <div className="container-slider transition" ref={transitionRef}>
            {isLoading
              ? <Loader/>
              : <Swiper 
                  className="mySwiper" 
                  id="swiper-custom" 
                  slidesPerView={1} 
                  spaceBetween={30} 
                  loop={true}
                  pagination={{clickable: true}} 
                  navigation={true} 
                  modules={[Pagination, Navigation, Autoplay]}
                  autoplay={{delay: 3500, disableOnInteraction: false}}
              >
                {sliderData?.map((item, index) => {
                  return(
                    <SwiperSlide key={index}>
                      <SlideMain item={item} imgData={imgData[index].data}/>
                    </SwiperSlide>
                  )})
                }
              </Swiper>
            }
          </div> 
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}
