import { memo, useEffect, useRef, useState } from "react"

import { api } from "../../../../../api"
import { useQuery } from "@tanstack/react-query"
import { SwiperSlide } from "swiper/react"

import { FranchisesItem } from "./item/FranchisesItem"

import { FranchisesSkeleton } from "./skeleton/FranchisesSkeleton"

import { WrapperSection } from "../../../wrapper/WrapperSection"

import { useObserverImg } from "../../../../../hook/UseObserverImgProvider"

export const Franchises = memo(({ storageUrl }) => {
	const { observe } = useObserverImg()
	const sectionRef = useRef()

	const [isView, setIsView] = useState(false)

	const { data: FranchisesData, isLoading } = useQuery({
		queryKey: ["franchises-data"],
		enabled: isView,
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api
				.get("/franchises", { params: { limit: 5 } })
				.then((r) => r.data)
		},
	})

	useEffect(() => {
		const el = sectionRef.current
		if (!el) return

		observe(el, () => setIsView(true))
	}, [observe])

	return (
		<section className="franchises" ref={sectionRef}>
			<WrapperSection
				id={"franchises-swiper"}
				title={"Франшизы"}
				link={"/anime/franchises"}
				linkText={"Все франшизы"}
				data={FranchisesData?.items || []}
				isLoading={isLoading}
				slidesPerView={3}
				spaceBetween={25}
			>
				{isLoading ? (
					<FranchisesSkeleton count={3} />
				) : (
					<>
						{FranchisesData?.items?.map((item, index) => {
							return (
								<SwiperSlide key={index}>
									<FranchisesItem
										item={item}
										storageUrl={storageUrl}
									/>
								</SwiperSlide>
							)
						})}
					</>
				)}
			</WrapperSection>
		</section>
	)
})
