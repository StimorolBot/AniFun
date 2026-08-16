import { memo, useEffect, useRef, useState } from "react"

import { useQuery } from "@tanstack/react-query"

import { EpisodeItem } from "./item/EpisodeItem"

import { WrapperSection } from "../../../wrapper/WrapperSection"

import { useObserverImg } from "../../../../../hook/UseObserverImgProvider"
import { useViewport } from "../../../../../hook/useViewport"

import { api } from "../../../../../api"
import { EpisodeSkeleton } from "./skeleton/EpisodeSkeleton"

const getSize = (w) => {
	if (w > 1300 || w < 960) return 6
	return 4
}

export const NewEpisodes = memo(({ storageUrl }) => {
	const { observe } = useObserverImg()

	const sectionRef = useRef()
	const transitionRef = useRef()

	const [isView, setIsView] = useState(false)

	const widthViewport = useViewport()
	const size = getSize(widthViewport)

	const { data: episodeData, isLoading } = useQuery({
		queryKey: ["episode-data", size],
		staleTime: 1000 * 60 * 3,
		enabled: isView,
		queryFn: async () => {
			return await api
				.get("/episodes", { params: { size: size } })
				.then((r) => r.data)
		},
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
					value={isLoading}
				>
					<ul
						className="episode__list transition"
						ref={transitionRef}
						style={{
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
							gap: 10,
						}}
					>
						{isLoading ? (
							<EpisodeSkeleton count={size} />
						) : (
							<>
								{episodeData?.items?.map((item, index) => {
									return (
										<EpisodeItem
											item={item}
											storageUrl={storageUrl}
											key={index}
										/>
									)
								})}
							</>
						)}
					</ul>
				</WrapperSection>
			</div>
		</section>
	)
})
