import { useEffect, useRef } from "react"

import { Link } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { Autoplay, Navigation } from "swiper/modules"
import { Swiper } from "swiper/react"

import { ArrowLeft } from "../../../ui/icon/ArrowLeft"
import { ArrowRight } from "../../../ui/icon/ArrowRight"

import { BtnDefault } from "../../../ui/btn/BtnDefault"

import "./style.sass"

export const WrapperSection = ({
	id,
	className,
	title,
	link,
	linkText,
	data,
	isLoading,
	slidesPerView,
	spaceBetween,
	children,
}) => {
	const swiperRef = useRef(null)
	const prevRef = useRef(null)
	const nextRef = useRef(null)
	const transitionRef = useRef(null)

	useEffect(() => {
		const swiper = swiperRef.current

		if (!swiper) return

		swiper.params.navigation.prevEl = prevRef.current
		swiper.params.navigation.nextEl = nextRef.current

		swiper.navigation.destroy()
		swiper.navigation.init()
		swiper.navigation.update()

		swiper.update()
	}, [data])

	return (
		<div className="section__wrapper">
			<div className="section__inner">
				<h2 className="section__title">
					{title}
					<ArrowRight />
				</h2>
				<Link className="section__link" to={link}>
					{linkText}
				</Link>
			</div>
			<SwitchTransition mode="out-in">
				<CSSTransition
					classNames="transition"
					key={isLoading}
					nodeRef={transitionRef}
					timeout={300}
				>
					<div className="transition" ref={transitionRef}>
						<Swiper
							id={id}
							className={className}
							slidesPerView={slidesPerView}
							spaceBetween={spaceBetween}
							navigation
							watchOverflow={false}
							preventClicks={false}
							preventClicksPropagation={false}
							modules={[Navigation, Autoplay]}
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
							{children}

							<div className="section__btn_middle">
								<BtnDefault ref={prevRef} isStroke={false}>
									<ArrowLeft />
								</BtnDefault>

								<BtnDefault ref={nextRef} isStroke={false}>
									<ArrowRight />
								</BtnDefault>
							</div>
						</Swiper>
					</div>
				</CSSTransition>
			</SwitchTransition>
		</div>
	)
}
