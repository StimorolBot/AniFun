import { Link } from "react-router-dom"

import { useAutoFontSize } from "../../../../../../hook/useAutoFontSize"

import "./style.sass"

export const ScheduleItem = ({ item, storageUrl, ...props }) => {
	const ref = useAutoFontSize({
		minSize: 14,
		maxSize: 20,
		deps: [item.anime.title],
	})
	return (
		<li className="schedule__item" {...props}>
			<Link className="schedule__link" to={`/anime/${item.anime.alias}`}>
				<img
					className="schedule__bg"
					src={`${storageUrl}/anime-${item.anime.uuid}/${item.anime.poster.poster_uuid}.webp`}
					loading="lazy"
					alt="preview"
				/>
				<div className="schedule__title" ref={ref}>
					{item.anime.title}
				</div>
				<p className="schedule__episode">
					{`${item.episode_number} ${"Эпизод"}`}
				</p>
				<ul className="schedule__desc-list">
					<li className="schedule__desc-item point">
						{item?.anime.season.label}
					</li>
					<li className="schedule__desc-item point">
						{item?.anime.year}
					</li>
					<li className="schedule__desc-item point">
						{item?.anime.age_restrict.label}
					</li>
					<li className="schedule__desc-item point">
						{item?.anime.type.label}
					</li>
				</ul>
				<ul className="schedule__desc-list">
					{item?.anime.genres?.slice(-2)?.map((genre, index) => {
						return (
							<li
								className="schedule__desc-item point"
								key={index}
							>
								{genre.label}
							</li>
						)
					})}
				</ul>
			</Link>
		</li>
	)
}
