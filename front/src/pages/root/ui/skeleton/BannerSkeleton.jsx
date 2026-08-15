import Skeleton from "react-loading-skeleton"

export const BannerSkeleton = ({ count }) => {
	return (
		<ul className="root-banner__list">
			{Array.from({ length: count }).map((_, index) => {
				return (
					<li className="root-banner__item" key={index}>
						<Skeleton
							className="skeleton__background"
							style={{ width: 30, height: 40 }}
						/>
						<div className="root-banner__container">
							<Skeleton
								className="skeleton__background"
								style={{ width: 420, height: 117 }}
							/>
						</div>
						<div style={{ padding: 4 }}>
							<Skeleton
								className="skeleton__background"
								style={{ width: 110, height: 25 }}
							/>
							<Skeleton
								className="skeleton__background"
								style={{
									width: 110,
									height: 25,
									marginTop: 10,
								}}
							/>
						</div>
						<Skeleton
							className="skeleton__background"
							style={{ width: 40, height: 20 }}
						/>
						<Skeleton
							className="skeleton__background"
							style={{ width: 35, height: 35 }}
						/>
					</li>
				)
			})}
		</ul>
	)
}
