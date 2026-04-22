import { memo } from "react"
import Skeleton from "react-loading-skeleton"

import "./style.sass"

export const LoaderSkeleton = memo(({ count }) => {
	return (
		<ul className="episode__list">
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li
							className="episode__item episode__item-skeleton"
							key={index}
						>
							<div className="episode__img-skeleton">
								<Skeleton />
							</div>
							<div className="episode__desc-skeleton">
								<div className="episode__number-skeleton">
									<Skeleton />
								</div>
								<div className="episode__title-skeleton">
									<Skeleton />
								</div>
								<div>
									<ul className="episode__desc-list-skeleton">
										<li className="episode__desc-item-skeleton">
											<div>
												<Skeleton />
											</div>
										</li>
										<li className="episode__desc-item-skeleton">
											<div>
												<Skeleton />
											</div>
										</li>
										<li className="episode__desc-item-skeleton">
											<div>
												<Skeleton />
											</div>
										</li>
									</ul>
									<div className="episode__desc-item-skeleton-btn">
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
