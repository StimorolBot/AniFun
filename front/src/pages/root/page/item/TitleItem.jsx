import { memo, useRef, useState } from "react"

import { Link } from "react-router-dom"

import { Edit } from "../../../../ui/icon/Edit"
import { Remove } from "../../../../ui/icon/Remove"

import { BtnDefault } from "../../../../ui/btn/BtnDefault"

import { useAutoFontSize } from "../../../../hook/useAutoFontSize"

import "./style/title_item.sass"

export const TitleItem = memo(({ item, storageUrl, callback, ...props }) => {
	const titleRef = useAutoFontSize({
		minSize: 12,
		maxSize: 18,
		deps: [item.anime.title],
	})

	const subTitleRef = useAutoFontSize({
		minSize: 10,
		maxSize: 14,
		deps: [item.anime.sub_title],
	})

	return (
		<tr className="root-title__item" {...props}>
			<td>
				<div className="root-title__img-container">
					<img
						loading="lazy"
						src={`${storageUrl}/anime-${item.anime.uuid}/${item.anime?.poster?.poster_uuid}.webp`}
						alt="постер"
						onError={(e) => {
							const img = e.currentTarget
							img.onerror = null
							img.src = `${storageUrl}/posters/none-poster.png`
						}}
					/>
				</div>
			</td>
			<td>
				<div>
					<h4 ref={titleRef}>{item.anime.title}</h4>
					<h4 className="root-title__sub" ref={subTitleRef}>
						{item.anime.sub_title}
					</h4>
				</div>
			</td>
			<td data-status={item.anime.status.value}>
				<p>{item.anime.status.label}</p>
			</td>
			<td>{`${item.anime.last_episode || 0}/${item.anime.total_episode}`}</td>

			<td>{item.anime.year}</td>
			<td>
				<p>{item.anime.season.label}</p>
			</td>
			<td>
				<p>{item?.avg || "-"}</p>
				<p>{item.total_count}</p>
			</td>
			<td>
				<div className="root-title__btn">
					<Link to={`${item.anime.alias}/edit`}>
						<Edit />
					</Link>
					<BtnDefault
						isStroke={false}
						callback={() =>
							callback(item.anime.title, item.anime.uuid)
						}
					>
						<Remove />
					</BtnDefault>
				</div>
			</td>
		</tr>
	)
})
