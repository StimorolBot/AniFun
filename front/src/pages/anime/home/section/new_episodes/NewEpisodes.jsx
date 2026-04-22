import { memo, useEffect, useRef, useState } from "react"

import { useQueries, useQuery } from "@tanstack/react-query"

import { EpisodeItem } from "./item/EpisodeItem"

import { LoaderSkeleton } from "./loader/LoaderSkeleton"

import { WrapperSection } from "../../../wrapper/WrapperSection"

import { useObserverImg } from "../../../../../hook/useObserverImgProvider"
import { useViewport } from "../../../../../hook/useViewport"

import { api } from "../../../../../api"
import { newEpisodeSection } from "./query_key"

import "./style.sass"

const getLimit = (w) => {
	if (w > 1300 || w < 960) return 6
	return 4
}

export const NewEpisodes = memo(() => {
	const { observe } = useObserverImg()

	const sectionRef = useRef()
	const transitionRef = useRef()

	const [isView, setIsView] = useState(false)

	const widthViewport = useViewport()
	const limit = getLimit(widthViewport)

	const { data: episodeData, isFetching } = useQuery({
		queryKey: [newEpisodeSection.getData, limit],
		staleTime: 1000 * 60 * 3,
		enabled: isView,
		queryFn: async () => {
			return await api
				.get("/new-episode", { params: { limit: limit } })
				.then((r) => r.data)
		},
		placeholderData: [],
	})

	const imgData = useQueries({
		queries: episodeData?.map((item) => ({
			queryKey: [
				newEpisodeSection.getImg,
				item.anime?.poster?.poster_uuid,
			],
			staleTime: 1000 * 60 * 3,
			enabled: !!item.anime?.poster?.poster_uuid,
			queryFn: async () => {
				return await api
					.get(
						`/s3/anime-${item.anime.uuid}/${item.anime.poster.poster_uuid}`,
					)
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
		<section className="new-episodes" ref={sectionRef}>
			<div className="container">
				<WrapperSection
					title={"Новые эпизоды"}
					link={"anime/new-episode"}
					ref={transitionRef}
					value={isFetching}
				>
					<div
						className="container-new-episodes transition"
						ref={transitionRef}
					>
						{isFetching ? (
							<LoaderSkeleton count={limit} />
						) : (
							<ul className="episode__list">
								{episodeData?.map((item, index) => {
									return (
										<EpisodeItem
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
