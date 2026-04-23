import { memo } from "react"
import Skeleton from "react-loading-skeleton"

import "./style.sass"

export const LoaderSkeleton = memo(({ count }) => {
	return (
		<>
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="release__item" key={index}>
							<div className="release__skeleton-bg">
								<Skeleton />
							</div>
							<div className="release__img_skeleton">
								<Skeleton />
							</div>
							<div className="release__item-info">
								<div>
									<Skeleton width={400} height={30} />
								</div>
								<div className="release__item-container">
									<div className="release__desc-list_skeleton">
										<Skeleton count={2} />
									</div>
								</div>
								<div className="release__item-description_skeleton">
									<Skeleton count={4} />
								</div>
								<div className="release__btn_skeleton">
									<Skeleton />
								</div>
							</div>
						</li>
					)
				})}
		</>
	)
})
