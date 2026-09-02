import { formatScheduleDate } from "../../../../../../utils/date"

import "./style.sass"

export const TitleScheduleItem = ({ item, ...props }) => {
	const [date, time] = formatScheduleDate(
		item.date_release,
		item.time_release,
	)
	return (
		<li
			className="title-schedule__item"
			data-releases={item.is_released}
			{...props}
		>
			<p>{`${item.episode_number} эпизод`}</p>
			<p>{item.episode_name}</p>
			<time className="title-schedule__date" dateTime={date}>
				<p>{date}</p>
				<p>{time}</p>
			</time>
		</li>
	)
}
