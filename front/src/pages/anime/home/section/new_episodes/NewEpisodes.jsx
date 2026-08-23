import { memo } from "react"

import { api } from "../../../../../api"
import { useQuery } from "@tanstack/react-query"
import { SwiperSlide } from "swiper/react"

import { EpisodeItem } from "./item/EpisodeItem"

import { EpisodeSkeleton } from "./skeleton/EpisodeSkeleton"

import { WrapperSection } from "../../../wrapper/WrapperSection"

export const NewEpisodes = memo(({ storageUrl }) => {
	const { data: episodeData, isLoading } = useQuery({
		queryKey: ["episode-data"],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api
				.get("/episodes", { params: { size: 14 } })
				.then((r) => r.data)
		},
	})

	return (
		<section>
			<WrapperSection
				id={"episode-swiper"}
				className={"section_swiper"}
				title={"Новые эпизоды"}
				link={"anime/new-episode"}
				linkText={"Смотреть все"}
				data={episodeData?.items || []}
				isLoading={isLoading}
				slidesPerView={6}
				spaceBetween={20}
			>
				{isLoading ? (
					<EpisodeSkeleton count={6} />
				) : (
					<>
						{episodeData?.items?.map((item) => {
							return (
								<SwiperSlide key={item.uuid}>
									<EpisodeItem
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
