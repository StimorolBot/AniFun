import { memo, useEffect, useRef } from "react"

import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../../../api"
import { BannerSkeleton } from "./skeleton/BannerSkeleton"
import { useQuery } from "@tanstack/react-query"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { ArrowLeft } from "../../../../../ui/icon/ArrowLeft"
import { ArrowRight } from "../../../../../ui/icon/ArrowRight"

import { BtnDefault } from "../../../../../ui/btn/BtnDefault"

import { BannerItem } from "./item/BannerItem"

import { useViewport } from "../../../../../hook/useViewport"

import "./style.sass"

export const Banner = memo(({ storageUrl }) => {
	const transitionRef = useRef()
	const widthViewport = useViewport()

	const swiperRef = useRef(null)
	const prevRef = useRef(null)
	const nextRef = useRef(null)

	const { data: bannerData, isLoading } = useQuery({
		queryKey: ["banner-data", widthViewport > 960],
		enabled: widthViewport > 960,
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api.get("/banner").then((r) => r.data)
		},
	})

	useEffect(() => {
		if (!swiperRef.current) return

		swiperRef.current.params.navigation.prevEl = prevRef.current
		swiperRef.current.params.navigation.nextEl = nextRef.current

		swiperRef.current.navigation.init()
		swiperRef.current.navigation.update()
	}, [bannerData])

	return (
		<div className="container">
			<SwitchTransition mode="out-in">
				<CSSTransition
					classNames="transition"
					key={isLoading}
					nodeRef={transitionRef}
					timeout={300}
				>
					<div
						className="banner__container transition"
						ref={transitionRef}
					>
						{isLoading ? (
							<BannerSkeleton />
						) : (
							<Swiper
								className="mySwiper"
								id="banner-custom"
								slidesPerView={1}
								spaceBetween={30}
								loop={true}
								pagination={{ clickable: true }}
								navigation={{
									prevEl: prevRef.current,
									nextEl: nextRef.current,
								}}
								modules={[Pagination, Navigation, Autoplay]}
								autoplay={{
									delay: 3500,
									disableOnInteraction: false,
								}}
								onBeforeInit={(swiper) => {
									swiper.params.navigation.prevEl =
										prevRef.current
									swiper.params.navigation.nextEl =
										nextRef.current
								}}
								onSwiper={(swiper) => {
									swiperRef.current = swiper
								}}
							>
								{bannerData?.map((item, index) => {
									return (
										<SwiperSlide key={index}>
											<BannerItem
												item={item}
												storageUrl={storageUrl}
											/>
										</SwiperSlide>
									)
								})}
								<div className="banner__btn">
									<BtnDefault ref={prevRef} isStroke={false}>
										<ArrowLeft />
									</BtnDefault>
									<BtnDefault ref={nextRef} isStroke={false}>
										<ArrowRight />
									</BtnDefault>
								</div>
							</Swiper>
						)}
					</div>
				</CSSTransition>
			</SwitchTransition>
		</div>
	)
})
