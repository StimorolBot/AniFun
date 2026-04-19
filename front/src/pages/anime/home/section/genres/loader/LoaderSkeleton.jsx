import { memo } from "react"
import Skeleton from "react-loading-skeleton"

import "./style.sass"

export const LoaderSkeleton = memo(({ count }) => {
	return (
		<ul className="genres__list">
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="genres__item" key={index}>
							<div className="genres__item-skeleton-container">
								<Skeleton />
								<div className="genres__item-skeleton-item">
									<Skeleton />
									<Skeleton />
								</div>
							</div>
						</li>
					)
				})}
		</ul>
	)
})
