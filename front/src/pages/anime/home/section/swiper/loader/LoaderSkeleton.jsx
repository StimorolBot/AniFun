import { memo } from "react"
import Skeleton from "react-loading-skeleton"

import "./style.sass"

export const LoaderSkeleton = memo(() => {
	return (
		<div className="container-slider-skeleton">
			<div className="slide-skeleton">
				<div className="slide-skeleton__bg">
					<Skeleton />
				</div>
				<div className="slide-skeleton__inner">
					<div className="slide-skeleton__title">
						<Skeleton />
					</div>
					<ul className="slide-skeleton-desc__list">
						<li className="slide-skeleton-desc__item">
							<Skeleton />
						</li>
						<li className="slide-skeleton-desc__item">
							<Skeleton />
						</li>
						<li className="slide-skeleton-desc__item">
							<Skeleton />
						</li>
						<li className="slide-skeleton-desc__item">
							<Skeleton />
						</li>
					</ul>
					<div className="slide-skeleton-desc__genres">
						<Skeleton />
						<Skeleton />
						<Skeleton />
					</div>
					<div className="slide-skeleton__description">
						<Skeleton />
						<Skeleton />
						<Skeleton />
						<Skeleton />
						<Skeleton />
					</div>
					<div className="slide-skeleton__btn-container">
						<div className="slide-skeleton__btn-left">
							<Skeleton />
						</div>
						<div className="slide-skeleton__btn-right">
							<Skeleton />
							<Skeleton />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
})
