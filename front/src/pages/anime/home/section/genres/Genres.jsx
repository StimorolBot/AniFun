import { memo, useEffect, useRef, useState } from "react"

import { useQuery } from "@tanstack/react-query"

import { GenresItem } from "./item/GenresItem"

import { LoaderSkeleton } from "./loader/LoaderSkeleton"

import { WrapperSection } from "../../../wrapper/WrapperSection"

import { useObserverImg } from "../../../../../hook/useObserverImgProvider"
import { useViewport } from "../../../../../hook/useViewport"

import { api } from "../../../../../api"

import "./style.sass"

const getLimit = (w) => {
	if (w > 1300) return 6
	return 4
}

export const Genres = memo(({ storageUrl }) => {
	const { observe } = useObserverImg()

	const sectionRef = useRef()
	const transitionRef = useRef()

	const [isView, setIsView] = useState(false)

	const widthViewport = useViewport()
	const limit = getLimit(widthViewport)

	const { data: genresData, isFetching } = useQuery({
		queryKey: ["genres-section-list-data", limit],
		enabled: isView,
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api
				.get("/genres", { params: { limit: limit } })
				.then((r) => r.data)
		},
	})

	useEffect(() => {
		const el = sectionRef.current
		if (!el) return

		observe(el, () => setIsView(true))
	}, [observe])

	return (
		<section className="genres" ref={sectionRef}>
			<div className="container">
				<WrapperSection
					title={"Жанры"}
					link={"/anime/genres"}
					ref={transitionRef}
					value={isFetching}
				>
					<div className="transition" ref={transitionRef}>
						{isFetching ? (
							<LoaderSkeleton count={limit} />
						) : (
							<ul className="genres__list">
								{genresData?.map((item, index) => {
									return (
										<GenresItem
											item={item}
											storageUrl={storageUrl}
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
