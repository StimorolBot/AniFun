import { useEffect, useRef, useState } from "react"

import Masonry from "react-masonry-css"

import { useQuery } from "@tanstack/react-query"

import { SwitchDay } from "./ui/SwitchDay"

import { ScheduleItem } from "./item/ScheduleItem"

import { WrapperSection } from "../../../wrapper/WrapperSection"

import { useObserverImg } from "../../../../../hook/UseObserverImgProvider"

import { api } from "../../../../../api"
import { ScheduleSkeleton } from "./skeleton/ScheduleSkeleton"

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
	const [day, setDay] = useState("today")

	const { data: scheduleData, isLoading } = useQuery({
		queryKey: ["schedule-data", day],
		staleTime: 1000 * 60 * 3,
		enabled: isView,
		queryFn: async () => {
			return await api
				.get("/schedules", { params: { day: day } })
				.then((r) => r.data)
		},
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
					value={isLoading}
				>
					<>
						<SwitchDay
							value={day}
							setValue={setDay}
							style={{ marginLeft: "auto" }}
						/>
						<ul
							className="schedules__list transition"
							ref={transitionRef}
						>
							<Masonry
								breakpointCols={breakpoints}
								className="masonry"
								columnClassName="masonry__column"
							>
								{isLoading
									? Array.from({ length: 4 }, (_, index) => (
											<ScheduleSkeleton key={index} />
										))
									: scheduleData?.map((item) => {
											return (
												<ScheduleItem
													item={item}
													storageUrl={storageUrl}
													key={item.uuid}
												/>
											)
										})}
							</Masonry>
							{isLoading === false &&
								scheduleData?.length === 0 && (
									<li className="schedules__empty">
										<img
											src={`${storageUrl}/stickers/72b0282a20594165a6511c8fbd8c5dfd.png`}
											alt="Нет результата"
										/>
									</li>
								)}
						</ul>
					</>
				</WrapperSection>
			</div>
		</section>
	)
}
