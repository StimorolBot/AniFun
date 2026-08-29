import { useEffect, useRef, useState } from "react"

import { Link } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../../../api"
import { useQuery } from "@tanstack/react-query"

import { Watch } from "../../../../../ui/icon/Watch"

import { ScheduleItem } from "./item/ScheduleItem"

import { ScheduleSkeleton } from "./skeleton/ScheduleSkeleton"

import { useObserverImg } from "../../../../../hook/UseObserverImgProvider"

import "./style.sass"

export const Schedule = ({ storageUrl }) => {
	const { observe } = useObserverImg()

	const sectionRef = useRef()
	const transitionRef = useRef()
	const [isView, setIsView] = useState(false)

	const { data: scheduleData, isLoading } = useQuery({
		queryKey: ["schedule-data"],
		staleTime: 1000 * 60 * 3,
		enabled: isView,
		queryFn: async () => {
			return await api
				.get("/schedules", { params: { size: 6 } })
				.then((r) => r.data)
		},
	})

	useEffect(() => {
		const el = sectionRef.current
		if (!el) return

		observe(el, () => setIsView(true))
	}, [observe])
	return (
		<div className="schedules" ref={sectionRef}>
			<header className="schedules__header">
				<Watch />
				<h2>Расписание на сегодня</h2>
			</header>
			<SwitchTransition mode="out-in">
				<CSSTransition
					classNames="transition"
					key={isLoading}
					nodeRef={transitionRef}
					timeout={300}
				>
					<ul
						className="schedules__list transition"
						ref={transitionRef}
					>
						{isLoading ? (
							<ScheduleSkeleton count={6} />
						) : (
							scheduleData?.items?.map((item, index) => {
								return (
									<ScheduleItem
										item={item}
										storageUrl={storageUrl}
										key={index}
									/>
								)
							})
						)}

						{isLoading === false && scheduleData?.length === 0 && (
							<li className="schedules__empty">
								<img
									src={`${storageUrl}/stickers/72b0282a20594165a6511c8fbd8c5dfd.png`}
									alt="Нет результата"
								/>
							</li>
						)}
					</ul>
				</CSSTransition>
			</SwitchTransition>
			<Link className="schedules__link" to={"anime/schedules"}>
				Весь график
			</Link>
		</div>
	)
}
