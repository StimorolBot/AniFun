import { memo } from "react"
import Skeleton from "react-loading-skeleton"

import "./style/loader_skeleton_search.sass"

export const LoaderSkeletonSearch = memo(({ count }) => {
	return (
		<ul className="search-popup__list transition">
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="search-popup__item-skeleton">
							<div className="search-popup__img-skeleton">
								<Skeleton />
							</div>
							<div className="search-popup__content">
								<div className="search-popup__title-skeleton">
									<Skeleton />
								</div>
								<div className="search-popup__bottom-skeleton">
									<Skeleton />
								</div>
							</div>
						</li>
					)
				})}
		</ul>
	)
})
