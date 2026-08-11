import { memo } from "react"

import { Link } from "react-router-dom"

import { useAutoFontSize } from "../../../../hook/useAutoFontSize"

import "./style.sass"

export const SearchItem = memo(({ item, storageUrl, ...props }) => {
	const titleRef = useAutoFontSize({
		minSize: 12,
		maxSize: 16,
		deps: [item.title],
	})
	const subTitleRef = useAutoFontSize({
		minSize: 12,
		maxSize: 14,
		deps: [item.sut_title],
	})
	return (
		<li {...props}>
			<Link className="search-popup__link" to={`/anime/${item?.alias}`}>
				<div className="search-popup__img-inner">
					<img
						src={`${storageUrl}/anime-${item.uuid}/${item.poster_uuid}.webp`}
						alt="постер"
						onError={(e) => {
							const img = e.currentTarget
							img.onerror = null
							img.src = `${storageUrl}/stickers/6093866d92af49f68292ba298b383eea.png`
						}}
						loading="lazy"
					/>
				</div>
				<div className="search-popup__content">
					<h3 ref={titleRef}>{item.title}</h3>
					<h4 ref={subTitleRef}>{item?.sub_title}</h4>
					<ul className="search-popup__bottom">
						<li className="point">{item.type}</li>
						<li className="point">{item.season}</li>
						<li className="point">{item.year}</li>
					</ul>
				</div>
			</Link>
		</li>
	)
})
