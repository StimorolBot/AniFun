import { Link } from "react-router-dom"

import { useAutoFontSize } from "../../../../../../hook/useAutoFontSize"

import "./style.sass"

export const RecTitleItem = ({ item, storageUrl, ...props }) => {
	const titleRef = useAutoFontSize({
		minSize: 8,
		maxSize: 14,
		deps: [item.title],
	})

	return (
		<li className="rec-title__item" {...props}>
			<Link
				className="rec-title__link"
				to={`/anime/${item.alias}/episodes`}
			>
				<div className="rec-title__img">
					<div className="rec-title__rating">
						<span>{item.avg}</span>
					</div>

					<img
						src={`${storageUrl}/anime-${item.anime?.uuid}/${item?.poster_uuid}.webp`}
						onError={(e) => {
							const img = e.currentTarget
							img.onerror = null
							img.src = `${storageUrl}/stickers/6093866d92af49f68292ba298b383eea.png`
						}}
						loading="lazy"
						alt="Постер"
					/>
				</div>
				<h4 ref={titleRef}>{item.title}</h4>
				<p>{item.year}</p>
			</Link>
		</li>
	)
}
