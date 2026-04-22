import { memo, useEffect, useRef, useState } from "react"

import { useQuery } from "@tanstack/react-query"

import { FranchisesItem } from "./item/FranchisesItem"

import { LoaderSkeleton } from "./loader/LoaderSkeleton"

import { WrapperSection } from "../../../wrapper/WrapperSection"

import { useObserverImg } from "../../../../../hook/useObserverImgProvider"
import { useViewport } from "../../../../../hook/useViewport"

import { api } from "../../../../../api"

import "./style.sass"

const getLimit = (w) => {
	if (w > 1300) return 3
	return 2
}

export const Franchises = memo(({ storageUrl }) => {
	const { observe } = useObserverImg()

	const sectionRef = useRef()
	const transitionRef = useRef()

	const [isView, setIsView] = useState(false)

	const widthViewport = useViewport()
	const limit = getLimit(widthViewport)

	const { data: FranchisesData, isFetching } = useQuery({
		queryKey: ["franchises-section-list-data", limit],
		enabled: isView,
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api
				.get("/franchises", { params: { limit: limit } })
				.then((r) => r.data)
		},
		placeholderData: [],
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
