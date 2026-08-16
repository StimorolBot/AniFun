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
					src={`${storageUrl}/anime-${item.anime.uuid}/${item.anime.poster?.poster_uuid}.webp`}
					onError={(e) => {
						const img = e.currentTarget
						img.onerror = null
						img.src = `${storageUrl}/stickers/6093866d92af49f68292ba298b383eea.png`
					}}
					loading="lazy"
					alt="постер"
				/>
				<h3 ref={ref}>{item.anime.title}</h3>
				<p className="schedule__episode">
					{`${item.episode_number} ${"эпизод"}`}
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
					{item?.anime.genres?.slice(-3)?.map((genre, index) => {
						return (
							<li
								className="schedule__desc-item point"
								key={index}
							>
								{genre}
							</li>
						)
					})}
				</ul>
			</Link>
		</li>
	)
}
