import { memo, useRef } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { useQueries, useQuery } from "@tanstack/react-query"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { LoaderSkeleton } from "./loader/LoaderSkeleton"

import { api } from "../../../../../api"
import { slider } from "./query_key"
import { SlideMain } from "./slide/SlideMain"

import "./style.sass"

export const SwiperCustom = memo(() => {
	const transitionRef = useRef()

	const { data: sliderData, isFetching } = useQuery({
		queryKey: [slider.getData],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api.get("/slides").then((r) => r.data)
		},
		placeholderData: [],
	})

	const imgData = useQueries({
		queries: sliderData?.map((item) => ({
			queryKey: [slider.getImg, item.anime.banner.uuid_banner],
			staleTime: 1000 * 60 * 3,
			queryFn: async () => {
				return await api
					.get(
						`/s3/anime-${item.anime.uuid}/${item.anime.banner.uuid_banner}`,
					)
					.then((r) => r.data)
			},
		})),
	})

	return (
		<div className="container">
			<SwitchTransition mode="out-in">
				<CSSTransition
					classNames="transition"
					key={isFetching}
					nodeRef={transitionRef}
					timeout={300}
				>
					<div
						className="container-slider transition"
						ref={transitionRef}
					>
						{isFetching ? (
							<LoaderSkeleton />
						) : (
							<Swiper
								className="mySwiper"
								id="swiper-custom"
								slidesPerView={1}
								spaceBetween={30}
								loop={true}
								pagination={{ clickable: true }}
								navigation={true}
								modules={[Pagination, Navigation, Autoplay]}
								autoplay={{
									delay: 3500,
									disableOnInteraction: false,
								}}
							>
								{sliderData?.map((item, index) => {
									return (
										<SwiperSlide key={index}>
											<SlideMain
												item={item}
												imgData={imgData[index].data}
											/>
										</SwiperSlide>
									)
								})}
							</Swiper>
						)}
					</div>
				</CSSTransition>
			</SwitchTransition>
		</div>
	)
})
