import { memo } from "react"

import { Link } from "react-router-dom"

import { pluralize } from "../../../../../../utils/text"

import { Play } from "../../../../../../ui/icon/Play"

import { useAutoFontSize } from "../../../../../../hook/useAutoFontSize"

import "./style.sass"

export const BannerItem = memo(({ item, storageUrl }) => {
	const ref = useAutoFontSize({
		minSize: 20,
		maxSize: 32,
		deps: [item.anime.title],
	})
	return (
		<div className="banner transition">
			<img
				className="banner__bg"
				src={`${storageUrl}/anime-${item.anime.uuid}/${item.anime.banner.banner_uuid}.webp`}
				alt="Баннер"
			/>
			{item?.avg && (
				<div className="banner__inner-rating">
					<div />
					<p>{item.avg}</p>
				</div>
			)}
			<div className="banner__inner">
				<h2 className="banner__title" ref={ref}>
					{item.anime.title}
				</h2>
				<ul className="banner-desc__list">
					<li className="banner-desc__item">
						{item.anime.season.label}
					</li>
					<li className="banner-desc__item">{item.anime.year}</li>
					<li className="banner-desc__item">
						{item.anime.total_episode &&
							`${item.anime.total_episode} ${pluralize(
								item.anime.episode_count,
								"эпизод",
								"эпизода",
								"эпизодов",
							)}`}
					</li>
					<li className="banner-desc__item">
						{item.anime.age_restrict.label}
					</li>
				</ul>
				<ul className="banner-desc__list">
					{item?.anime.genres?.map((genre, index) => {
						return (
							<li className="banner-desc__item" key={index}>
								{genre}
							</li>
						)
					})}
				</ul>
				<p className="banner__description">{item.anime.description}</p>
				<Link
					className="banner__link"
					to={`/anime/${item.anime.alias}`}
				>
					<Play
						style={{
							width: 30,
							height: 30,
							fill: "currentColor",
							marginRight: 5,
						}}
					/>
					<span>Смотреть</span>
				</Link>
			</div>
		</div>
	)
})
