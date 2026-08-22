import { memo } from "react"

import { Link } from "react-router-dom"

import { useAutoFontSize } from "../../../../../../hook/useAutoFontSize"

import "./style.sass"

export const EpisodeItem = memo(({ item, storageUrl, ...props }) => {
	const ref = useAutoFontSize({
		minSize: 8,
		maxSize: 16,
		deps: [item.title],
	})

	return (
		<li className="episode__item" {...props}>
			<Link className="episode__img" to={`/anime/${item.alias}`}>
				<img
					src={`${storageUrl}/anime-${item.title_uuid}/${item?.poster_uuid}.webp`}
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
				<h2 className="episode__title" ref={ref}>
					{item.title}
				</h2>
				<p className="episode__number">{item.episode_number} эпизод</p>
			</div>
		</li>
	)
})
