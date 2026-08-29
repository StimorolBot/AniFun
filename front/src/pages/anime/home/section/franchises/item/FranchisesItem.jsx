import { memo } from "react"

import { Link } from "react-router-dom"

import { pluralize } from "../../../../../../utils/text"

import { useAutoFontSize } from "../../../../../../hook/useAutoFontSize"

import "./style.sass"

export const FranchisesItem = memo(({ item, storageUrl, ...props }) => {
	const ref = useAutoFontSize({
		minSize: 12,
		maxSize: 18,
		deps: [item?.title],
	})
	return (
		<li {...props}>
			<Link
				className="franchise__link"
				to={`anime/franchises/${item?.franchise_uuid}`}
			>
				<div className="franchise__img">
					<img
						src={`${storageUrl}/anime-${item.title_uuid}/${item.franchise_uuid}.webp`}
						onError={(e) => {
							const img = e.currentTarget
							img.onerror = null
							img.src = `${storageUrl}/stickers/6093866d92af49f68292ba298b383eea.png`
						}}
						loading="lazy"
						alt="постер"
					/>
				</div>
				<ul className="franchise__info">
					<li className="franchise__item-top">
						<h3 ref={ref}>{item?.franchise_name}</h3>
					</li>
					<div className="franchise__item-bottom">
						<li>2 сезона </li>
						<li style={{ margin: "2px 0" }}>
							<span>{item.episode_count} </span>
							<span>
								{pluralize(
									item.episode_count,
									"серия",
									"серии",
									"серий",
								)}
							</span>
						</li>
						{item?.film_count && (
							<li>
								<span>{item?.film_count}</span>
								<span>
									{pluralize(
										item.film_count,
										"фильм",
										"фильма",
										"фильмов",
									)}
								</span>
							</li>
						)}
					</div>
				</ul>
			</Link>
		</li>
	)
})
