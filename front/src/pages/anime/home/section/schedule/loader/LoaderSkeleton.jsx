import { memo } from "react"
import Skeleton from "react-loading-skeleton"

import "./style.sass"

export const LoaderSkeleton = memo(({ count }) => {
	return (
		<ul className="schedules__list-skeleton">
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="schedule__item-skeleton" key={index}>
							<div className="schedule__item-skeleton-bg">
								<Skeleton />
							</div>
							<div className="schedule__item-skeleton-inner">
								<div className="schedule__item-skeleton-title">
									<Skeleton />
								</div>
								<div>
									<div className="schedule__item-skeleton-episode">
										<Skeleton />
									</div>
									<div className="schedule__item-skeleton-desc">
										<Skeleton />
										<Skeleton />
										<Skeleton />
										<Skeleton />
									</div>
									<div className="schedule__item-skeleton-genres">
										<Skeleton />
										<Skeleton />
									</div>
								</div>
							</div>
						</li>
					)
				})}
		</ul>
	)
})
