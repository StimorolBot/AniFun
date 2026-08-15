import { memo } from "react"

import { Link } from "react-router-dom"

import { Play } from "../../../../../../ui/icon/Play"

import { useAutoFontSize } from "../../../../../../hook/useAutoFontSize"

import "./style.sass"

export const EpisodeItem = memo(({ item, storageUrl, ...props }) => {
	const ref = useAutoFontSize({
		minSize: 14,
		maxSize: 20,
		deps: [item.anime.title],
	})
	return (
		<li className="episode__item" {...props}>
			<Link className="episode__img" to={`/anime/${item.anime.alias}`}>
				<img
					src={`${storageUrl}/anime-${item.anime.uuid}/${item.anime.poster?.poster_uuid}.webp`}
					onError={(e) => {
						const img = e.currentTarget
						img.onerror = null
						img.src = `${storageUrl}/stickers/6093866d92af49f68292ba298b383eea.png`
					}}
					loading="lazy"
					alt="poster"
				/>
			</Link>
			<div className="episode__description">
				<p className="episode__number">{item.episode_number} эпизод</p>
				<h2 className="episode__title" ref={ref}>
					{item.anime.title}
				</h2>
				<ul className="episode__desc-list">
					<li className="episode__desc-item point">
						{item.anime.year}
					</li>
					<li className="episode__desc-item point">
						{item.anime.season.label}
					</li>
					<li className="episode__desc-item point">
						{item.anime.type.label}
					</li>
					<li className="episode__desc-item point">
						{item.anime.age_restrict.label}
					</li>
				</ul>
				<ul className="episode__desc-list">
					{item.anime.genres?.slice(-3)?.map((genre, index) => {
						return (
							<li
								className="episode__desc-item episode__desc-item_tag point"
								key={index}
							>
								{genre}
							</li>
						)
					})}
				</ul>
				<Link
					className="episode__link"
					to={`anime/${item.anime.alias}/episode/${item.uuid_episode}`}
				>
					<Play style={{ fill: "currentColor" }} />
					Смотреть
				</Link>
			</div>
		</li>
	)
})
