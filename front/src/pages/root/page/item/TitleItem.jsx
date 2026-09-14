import { memo } from "react"

import { Link } from "react-router-dom"

import { pluralize } from "../../../../utils/text"

import { Edit } from "../../../../ui/icon/Edit"
import { Remove } from "../../../../ui/icon/Remove"
import { Star } from "./../../../../ui/icon/Star"

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
		<tr className="root-title__item transition" {...props}>
			<td>
				<div className="root-title__img-container">
					<img
						loading="lazy"
						src={`${storageUrl}/anime-${item.anime.uuid}/${item.anime?.poster?.poster_uuid}
							.${item.anime?.poster?.extension}`}
						alt="постер"
						onError={(e) => {
							const img = e.currentTarget
							img.onerror = null
							img.src = `${storageUrl}/stickers/6093866d92af49f68292ba298b383eea.png`
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
			<td className="rot-title_number">{`${item.anime.last_episode || 0}/${item.anime.total_episode}`}</td>
			<td className="rot-title_number">{item.anime.year}</td>
			<td>
				<p>{item.anime.season.label}</p>
			</td>
			<td>
				{item?.avg ? (
					<>
						<div className="root-title__rating rot-title_number">
							<span>{item.avg || "-"}</span>
							{item?.avg && <Star />}
						</div>
						<div>
							<span className="rot-title_number">
								{item.total_count}
							</span>
							<span>
								{` ${pluralize(
									item.total_count,
									"Человек",
									"Человека",
									"Людей",
								)}`}
							</span>
						</div>
					</>
				) : (
					<span>-</span>
				)}
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
