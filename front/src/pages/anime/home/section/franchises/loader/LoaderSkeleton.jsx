import { memo } from "react"
import Skeleton from "react-loading-skeleton"

import "./style.sass"

export const LoaderSkeleton = memo(({ count }) => {
	return (
		<ul className="franchises__list">
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="franchises__item" key={index}>
							<div className="franchises__item-skeleton-container">
								<div className="franchises__item-skeleton-bg">
									<Skeleton />
								</div>
								<div className="franchises__item-skeleton-item">
									<div className="franchises__item-skeleton-img">
										<Skeleton />
									</div>
									<div className="franchises__item-skeleton-desc">
										<div className="franchises__item-skeleton-top">
											<Skeleton />
										</div>
										<div className="franchises__item-bottom">
											<Skeleton />
											<Skeleton />
										</div>
									</div>
								</div>
							</div>
						</li>
					)
				})}
		</ul>
	)
})
