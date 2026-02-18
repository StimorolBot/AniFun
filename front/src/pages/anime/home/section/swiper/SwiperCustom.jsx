import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay } from "swiper/modules"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../../../api"
import { useFetch } from "../../../../../hook/useFetch"

import { SlideMain } from "./slide/SlideMain"
import { Loader } from "../../../../../components/loader/Loader"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "./style.sass"


export function SwiperCustom() {
  const transitionRef = useRef()
  const [urlIMg, setUrlIMg] = useState()
  const [response, setResponse] =  useState([])

  const [request, isLoading, _] = useFetch(
    async () => {
      await api.get("/slides").then((r) => setResponse([...r.data]))
    }
  )

  const [getUrlImg, isLoadingImg, errorImg] = useFetch(
    async (url) => {
      await api.get(url).then(r => setUrlIMg(r.data))  
    }
  )

  useEffect(() => {(
    async () => {
      await request()
    })()
  }, [])

  return (
    <div className="container">
      <SwitchTransition mode="out-in">
        <CSSTransition 
          classNames="transition" 
          key={isLoading}
          nodeRef={transitionRef} 
          timeout={300}
        >
          <div className="container-slider transition"  ref={transitionRef}>
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
                  onSlideChange={async (swiper) =>  {
                    const item = response[swiper.realIndex]
                    await getUrlImg(`/s3/anime-${item.anime.uuid}/${item.anime.banner.uuid_banner}`)
                  }}
              >
                {response.length >= 1 &&
                  response.map((item, index) => {
                    return(
                      <SwiperSlide key={index}>
                        <SlideMain item={item} urlIMg={urlIMg}/>
                      </SwiperSlide>
                    )
                  })
                }
              </Swiper>
            }
          </div> 
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}
