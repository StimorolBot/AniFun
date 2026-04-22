import { useEffect, useRef, useState } from "react"
import Masonry from "react-masonry-css"

import { useQuery } from "@tanstack/react-query"

import { SwitchDay } from "./ui/SwitchDay"

import { ScheduleItem } from "./item/ScheduleItem"

import { LoaderSkeleton } from "./loader/LoaderSkeleton"

import { WrapperSection } from "../../../wrapper/WrapperSection"

import { useObserverImg } from "../../../../../hook/useObserverImgProvider"

import { api } from "../../../../../api"

import "./style.sass"

const breakpoints = {
	default: 4,
	1300: 3,
	960: 2,
	650: 1,
}

export const Schedule = ({ storageUrl }) => {
	const { observe } = useObserverImg()

	const sectionRef = useRef()
	const transitionRef = useRef()

	const [isView, setIsView] = useState(false)
	const [schedule, setSchedule] = useState("today")

	const { data: scheduleData, isFetching } = useQuery({
		queryKey: ["schedule-section-list-data", schedule],
		staleTime: 1000 * 60 * 3,
		enabled: isView,
		queryFn: async () => {
			return await api
				.get("/schedules", { params: { schedule: schedule } })
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
		<section className="schedules" ref={sectionRef}>
			<div className="container">
				<WrapperSection
					title={"Расписание релизов"}
					link={"/anime/schedules"}
					ref={transitionRef}
					value={isFetching}
				>
					<>
						<div className="switch-day__wrapper">
							<SwitchDay
								value={schedule}
								setValue={setSchedule}
							/>
						</div>
						<ul
							className="schedules__list transition"
							ref={transitionRef}
						>
							{isFetching ? (
								<LoaderSkeleton count={4} />
							) : scheduleData.length >= 1 ? (
								<Masonry
									breakpointCols={breakpoints}
									className="masonry"
									columnClassName="masonry__column"
								>
									{scheduleData?.map((item, index) => {
										return (
											<ScheduleItem
												item={item}
												storageUrl={storageUrl}
												key={index}
											/>
										)
									})}
								</Masonry>
							) : (
								<li className="schedules__empty">
									К сожалению, в ближайшее время новых серий
									не ожидается :(
								</li>
							)}
						</ul>
					</>
				</WrapperSection>
			</div>
		</section>
	)
}
