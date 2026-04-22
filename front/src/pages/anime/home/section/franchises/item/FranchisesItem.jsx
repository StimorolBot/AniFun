import { memo } from "react"
import { Link } from "react-router-dom"

import { useAutoFontSize } from "../../../../../../hook/useAutoFontSize"

import { getPostfix } from "../../../../utils/utils"

import "./style.sass"

export const FranchisesItem = memo(({ item, imgData, ...props }) => {
	const ref = useAutoFontSize({
		minSize: 18,
		maxSize: 26,
		deps: item?.title,
	})
	return (
		<li className="franchises__item" {...props}>
			<Link
				className="franchises__link"
				to={`anime/franchises/${item?.sequel_uuid}`}
			>
				<div className="franchises__bg-container">
					<img
						className="franchises__bg"
						src={imgData}
						loading="lazy"
						alt="franchises"
					/>
				</div>
				<div className="franchises__container">
					<div className="franchises__desc_title" ref={ref}>
						{item?.title}
					</div>
					<ul className="franchises__desc-list">
						<li className="franchises__desc-item">
							{item.start_year} - {item.end_year}
						</li>
						<li className="franchises__desc-item">
							<span className="point">
								{`${item.seasons_count} ${getPostfix("сезон", item.seasons_count)}`}
							</span>
							<span className="point">
								{`${item.total_episodes} ${getPostfix("эпизод", item.total_episodes)}`}
							</span>
						</li>
					</ul>
				</div>
			</Link>
		</li>
	)
})
