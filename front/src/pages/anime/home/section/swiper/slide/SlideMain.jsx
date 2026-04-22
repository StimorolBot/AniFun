import { memo } from "react"
import { Link } from "react-router-dom"

import { useAutoFontSize } from "../../../../../../hook/useAutoFontSize"

import { getPostfix } from "../../../../utils/utils"

import "./style.sass"

export const SlideMain = memo(({ item, imgData }) => {
	const ref = useAutoFontSize({
		minSize: 20,
		maxSize: 32,
		deps: item.anime.title,
	})
	return (
		<div className="slide transition">
			<img className="slide__bg" src={imgData} alt="Баннер" />
			{item?.avg && (
				<div className="slide__inner-rating">
					<div />
					<p>{item.avg}</p>
				</div>
			)}
			<div className="slide__inner">
				<h2 className="slide__title" ref={ref}>
					{item.anime.title}
				</h2>
				<ul className="slide-desc__list">
					<li className="slide-desc__item point">
						<Link
							className="slide__link"
							to={`/anime`}
							state={item.anime.season.value}
						>
							{item.anime.season.label}
						</Link>
					</li>
					<li className="slide-desc__item point">
						<Link
							className="slide__link"
							to={`/anime`}
							state={item.anime.year}
						>
							{item.anime.year}
						</Link>
					</li>
					<li className="slide-desc__item point">
						{item.anime.total_episode &&
							`${item.anime.total_episode} ${getPostfix("эпизод", item.anime.episode_count)}`}
					</li>
					<li className="slide-desc__item point">
						<Link
							className="slide__link"
							to={`/anime`}
							state={item.anime.age_restrict.value}
						>
							{item.anime.age_restrict.label}
						</Link>
					</li>
				</ul>
				<ul className="slide-desc__list">
					{item?.anime.genres?.map((genre, index) => {
						return (
							<li className="slide-desc__item point" key={index}>
								<Link
									className="slide__link"
									to={`anime/genres/${genre.value}`}
								>
									{genre.label}
								</Link>
							</li>
						)
					})}
				</ul>
				<p className="slide__description">{item.anime.description}</p>
				<Link
					className="slide-main__link"
					to={`/anime/${item.anime.alias}`}
				>
					<svg>
						<use xlinkHref="/main.svg#rectangle-svg" />
					</svg>
					Смотреть
				</Link>
			</div>
		</div>
	)
})
