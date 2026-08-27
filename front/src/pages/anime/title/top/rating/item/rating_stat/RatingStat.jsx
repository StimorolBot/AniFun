import { Star } from "../../../../../../../ui/icon/Star"

import "./style.sass"

export const RatingStat = ({ count, ratingPer }) => {
	return (
		<ul className="rating__stat-list">
			{Array.from({ length: count }, (_, index) => {
				const rating = count - index

				return (
					<li key={rating}>
						<div>
							<span>{rating}</span>
							<Star />
						</div>
						<progress
							min={0}
							max={100}
							value={ratingPer?.[rating]?.percentage}
						/>
						<p>{ratingPer?.[rating]?.percentage || "0"} %</p>
					</li>
				)
			})}
		</ul>
	)
}
