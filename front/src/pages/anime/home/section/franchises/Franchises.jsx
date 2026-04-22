import { memo, useEffect, useRef, useState } from "react"

import { useQueries, useQuery } from "@tanstack/react-query"

import { FranchisesItem } from "./item/FranchisesItem"

import { LoaderSkeleton } from "./loader/LoaderSkeleton"

import { WrapperSection } from "../../../wrapper/WrapperSection"

import { useObserverImg } from "../../../../../hook/useObserverImgProvider"
import { useViewport } from "../../../../../hook/useViewport"

import { api } from "../../../../../api"
import { franchisesSection } from "./query_key"

import "./style.sass"

const getLimit = (w) => {
	if (w > 1300) return 3
	return 2
}

export const Franchises = memo(() => {
	const { observe } = useObserverImg()

	const sectionRef = useRef()
	const transitionRef = useRef()

	const [isView, setIsView] = useState(false)

	const widthViewport = useViewport()
	const limit = getLimit(widthViewport)

	const { data: FranchisesData = [], isFetching } = useQuery({
		queryKey: [franchisesSection.getData, limit],
		enabled: isView,
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api
				.get("/franchises", { params: { limit: limit } })
				.then((r) => r.data)
		},
	})

	const imgData = useQueries({
		queries: FranchisesData?.map((item) => ({
			queryKey: [franchisesSection.getImg, item.poster_uuid],
			staleTime: 1000 * 60 * 3,
			queryFn: async () => {
				return await api
					.get(`/s3/anime-${item.title_uuid}/${item.poster_uuid}`)
					.then((r) => r.data)
			},
		})),
	})
	useEffect(() => {
		const el = sectionRef.current
		if (!el) return

		observe(el, () => setIsView(true))
	}, [observe])

	return (
		<section className="franchises" ref={sectionRef}>
			<div className="container">
				<WrapperSection
					title={"Франшизы"}
					link={"/anime/franchises"}
					ref={transitionRef}
					value={isFetching}
				>
					<div className="transition" ref={transitionRef}>
						{isFetching ? (
							<LoaderSkeleton count={limit} />
						) : (
							<ul
								className={
									FranchisesData.length == 1
										? "franchises__list franchises__list_one-item"
										: "franchises__list"
								}
							>
								{FranchisesData?.map((item, index) => {
									return (
										<FranchisesItem
											item={item}
											imgData={imgData[index].data}
											key={index}
										/>
									)
								})}
							</ul>
						)}
					</div>
				</WrapperSection>
			</div>
		</section>
	)
})
