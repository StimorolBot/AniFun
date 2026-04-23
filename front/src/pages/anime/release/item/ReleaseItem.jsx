import { memo } from "react"
import { Link } from "react-router-dom"

import { useAutoFontSize } from "../../../../hook/useAutoFontSize"

import "./style.sass"

export const ReleaseItem = memo(({ item, storageUrl }) => {
	const ref = useAutoFontSize({
		minSize: 16,
		maxSize: 24,
		deps: [item.anime.title],
	})
	return (
		<li className="release__item">
			<div className="release__img-container">
				{item?.avg && (
					<div className="release__inner-rating">
						<div>
							<p>{item.avg}</p>
						</div>
					</div>
				)}
				<img
					src={`${storageUrl}/anime-${item.anime.uuid}/${item.anime.poster?.poster_uuid}.webp`}
					alt="poster"
					loading="lazy"
				/>
			</div>
			<div className="release__item-info">
				<h3 ref={ref}>{item.anime.title}</h3>
				<div className="release__item-container">
					<ul className="release__desc-list">
						{item.anime.genres?.map((genre, index) => {
							return (
								<li className="point" key={index}>
									<Link
										className="release_genre-link"
										to={`/anime/genres/${genre.value}`}
									>
										{genre.label}
									</Link>
								</li>
							)
						})}
					</ul>
					<ul className="release__desc-list">
						<li className="point">{item.anime?.year}</li>
						<li className="point">{item.anime?.season.label}</li>
						<li className="point">{item.anime?.type.label}</li>
						<li className="point">
							{item.anime?.age_restrict.label}
						</li>
					</ul>
				</div>
				<p className="release__item-description">
					{item.anime.description}
				</p>
				<div className="release__link-container">
					<Link to={`/anime/${item.anime.alias}`}>Смотреть</Link>
				</div>
			</div>
		</li>
	)
})
