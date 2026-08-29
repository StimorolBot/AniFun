import { Link } from "react-router-dom"

import { formatScheduleDate } from "../../../../../../utils/date"

import { useAutoFontSize } from "../../../../../../hook/useAutoFontSize"

import "./style.sass"

export const ScheduleItem = ({ item, storageUrl, ...props }) => {
	const ref = useAutoFontSize({
		minSize: 8,
		maxSize: 16,
		deps: [item.title],
	})

	const [date, time] = formatScheduleDate(
		item.date_release,
		item.time_release,
	)

	return (
		<li className="schedule__item" {...props}>
			<Link className="schedule__link" to={`/anime/${item.alias}`}>
				<div className="schedule__container">
					<div className="schedule__img">
						<img
							src={`${storageUrl}/anime-${item.uuid}/${item?.poster_uuid}.webp`}
							onError={(e) => {
								const img = e.currentTarget
								img.onerror = null
								img.src = `${storageUrl}/stickers/6093866d92af49f68292ba298b383eea.png`
							}}
							loading="lazy"
							alt="постер"
						/>
					</div>
					<div>
						<h3 ref={ref}>{item.title}</h3>
						<p className="schedule__episode">
							{`${item.episode_number} ${"эпизод"}`}
						</p>
					</div>
				</div>
				<time className="schedule__date" dateTime={date}>
					<p>{date}</p>
					<p>{time}</p>
				</time>
			</Link>
		</li>
	)
}
