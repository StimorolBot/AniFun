import { memo, useRef } from "react"

import { useQueries, useQuery } from "@tanstack/react-query"

import { api } from "../../../../../api"
import { WrapperSection } from "../../../wrapper/WrapperSection"
import { GenresItem } from "./item/GenresItem"
import { LoaderSkeleton } from "./loader/LoaderSkeleton"
import { genresSection } from "./query_key"

import "./style.sass"

export const Genres = memo(() => {
	const transitionRef = useRef()

	const { data: genresData = [], isFetching } = useQuery({
		queryKey: [genresSection.getData],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api.get("/genres").then((r) => r.data)
		},
	})

	const imgData = useQueries({
		queries: genresData?.map((item) => ({
			queryKey: [genresSection.getImg, item.poster_uuid],
			staleTime: 1000 * 60 * 3,
			queryFn: async () => {
				if (item.poster_uuid)
					return await api
						.get(`/s3/img-genres-poster/${item.poster_uuid}`)
						.then((r) => r.data)
				return null
			},
		})),
	})

	return (
		<section className="genres">
			<div className="container">
				<WrapperSection
					title={"Жанры"}
					link={"/anime/genres"}
					ref={transitionRef}
					value={isFetching}
				>
					<div className="transition" ref={transitionRef}>
						{isFetching ? (
							<LoaderSkeleton count={6} />
						) : (
							<ul className="genres__list">
								{genresData?.map((item, index) => {
									return (
										<GenresItem
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
