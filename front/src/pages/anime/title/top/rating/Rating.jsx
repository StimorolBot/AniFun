import { memo, useRef } from "react"

import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../../../api"
import { pluralize } from "../../../../../utils/text"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { RatingStar } from "./item/rating_star/RatingStar"
import { RatingStat } from "./item/rating_stat/RatingStat"

import { RatingSkeleton } from "./skeleton/RatingSkeleton"

import "./style.sass"

export const Rating = memo(({ titleUUID }) => {
	const queryClient = useQueryClient()
	const transitionRef = useRef()

	const { data: ratingData, isLoading } = useQuery({
		queryKey: ["rating-data", titleUUID],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api
				.get(`anime/titles/${titleUUID}/rating`)
				.then((r) => r.data)
		},
	})

	const ratingCount = ratingData?.total_count
	const ratingPer = ratingData?.rating_per.reduce((acc, item) => {
		acc[item.star] = item
		return acc
	}, {})

	const mutation = useMutation({
		mutationFn: async (rating) => {
			if (!ratingData?.my_rating)
				return api.post("anime/titles/rating", {
					star: rating,
					title_uuid: titleUUID,
				})
			else if (ratingData?.my_rating != rating)
				return await api.patch("anime/titles/rating", {
					star: rating,
					title_uuid: titleUUID,
				})
			else if (ratingData?.my_rating == rating)
				return await api.delete(`anime/titles/${titleUUID}/rating`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["rating-data", titleUUID],
			})
		},
	})

	return (
		<div className="rating">
			<SwitchTransition mode="out-in">
				<CSSTransition
					classNames="transition"
					key={isLoading}
					nodeRef={transitionRef}
					timeout={300}
				>
					{isLoading ? (
						<RatingSkeleton />
					) : (
						<>
							<div
								className="rating__top transition"
								ref={transitionRef}
							>
								<h3>{ratingData?.avg}</h3>
								<div>
									<RatingStar
										count={10}
										myRating={ratingData?.my_rating}
										callback={(rating) =>
											mutation.mutate(rating)
										}
									/>
									<p>
										<span style={{ marginLeft: 5 }}>
											{pluralize(
												ratingCount,
												"Оценил",
												"Оценили",
												"Оценило",
											)}
										</span>
										<span style={{ margin: "0 5px" }}>
											{ratingCount}
										</span>
										<span>
											{pluralize(
												ratingCount,
												"человек",
												"человека",
												"людей",
											)}
										</span>
									</p>
								</div>
							</div>
							<RatingStat count={10} ratingPer={ratingPer} />
						</>
					)}
				</CSSTransition>
			</SwitchTransition>
		</div>
	)
})
