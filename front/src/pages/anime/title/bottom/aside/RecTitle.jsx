import { memo, useRef } from "react"

import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../../../api"
import { useQuery } from "@tanstack/react-query"

import { RecTitleItem } from "./item/RecTitleItem"

import { RecTitleSkeleton } from "./skeleton/RecTitleSkeleton"

import "./style.sass"

export const RecTitle = memo(({ storageUrl }) => {
	const transitionRef = useRef()
	const { data: recData, isLoading: isLoading } = useQuery({
		queryKey: ["rec-data"],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return api.get("anime/titles/recommend").then((r) => r.data)
		},
	})

	return (
		<aside className="rec__title">
			<h4>Вам так же понравиться</h4>
			<SwitchTransition mode="out-in">
				<CSSTransition
					classNames="transition"
					key={isLoading}
					nodeRef={transitionRef}
					timeout={300}
				>
					<ul
						className="rec-title__list transition"
						ref={transitionRef}
					>
						{isLoading ? (
							<RecTitleSkeleton count={3} />
						) : (
							recData?.map((item, index) => {
								return (
									<RecTitleItem
										item={item}
										storageUrl={storageUrl}
										key={index}
									/>
								)
							})
						)}
					</ul>
				</CSSTransition>
			</SwitchTransition>
		</aside>
	)
})
