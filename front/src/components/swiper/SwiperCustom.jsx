import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay } from "swiper/modules"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import { SlideMain } from "./slide/SlideMain"
import { Loader } from "../../components/loader/Loader"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "./style/swiper_custom.sass"


export function SwiperCustom() {
  const transitionRef = useRef()
  const [response, setResponse] = useState([{
    "age_restrict": null, "description": null, "episodes": null, "img_rs": {"banner": null},
    "season": null, "title": null, "type": null, "year": null
  }])

  const [request, isLoading, error] = useFetch(
    async () => {
      await api.get("/slides").then((r) => setResponse(r.data))
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
              : <Swiper className="mySwiper" id="swiper-custom" slidesPerView={1} spaceBetween={30} loop={true}
                pagination={{clickable: true}} navigation={true} modules={[Pagination, Navigation, Autoplay]}
                autoplay={{delay: 3500, disableOnInteraction: false}} 
              >
                {response[0]?.alias &&
                  response.map((slide, index) => {
                    return(
                      <SwiperSlide key={index}>
                        <SlideMain slide={slide}/>
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
