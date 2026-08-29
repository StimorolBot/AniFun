import { memo, useEffect, useRef, useState } from "react"

import { api } from "../../../../../api"
import { useQuery } from "@tanstack/react-query"
import { SwiperSlide } from "swiper/react"

import { GenresItem } from "./item/GenresItem"

import { GenreSkeleton } from "./skeleton/GenreSkeleton"

import { WrapperSection } from "../../../wrapper/WrapperSection"

import { useObserverImg } from "../../../../../hook/UseObserverImgProvider"

export const Genres = memo(() => {
	const { observe } = useObserverImg()

	const sectionRef = useRef()

	const [isView, setIsView] = useState(false)

	const { data: genresData, isLoading } = useQuery({
		queryKey: ["genres-data"],
		enabled: isView,
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api.get("/genres").then((r) => r.data)
		},
	})

	useEffect(() => {
		const el = sectionRef.current
		if (!el) return

		observe(el, () => setIsView(true))
	}, [observe])

	return (
		<section ref={sectionRef}>
			<div className="container">
				<WrapperSection
					title={"Жанры"}
					link={"/anime/genres"}
					isLoading={isLoading}
					linkText={"Все жанры"}
					slidesPerView={5}
					spaceBetween={18}
				>
					{isLoading ? (
						<GenreSkeleton count={5} />
					) : (
						<>
							{genresData?.items?.map((item, index) => {
								return (
									<SwiperSlide key={index}>
										<GenresItem item={item} />
									</SwiperSlide>
								)
							})}
						</>
					)}
				</WrapperSection>
			</div>
		</section>
	)
})
