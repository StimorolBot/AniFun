import Skeleton from "react-loading-skeleton"

export const FranchisesSkeleton = ({ count }) => {
	return (
		<ul
			style={{
				display: "flex",
				gap: 25,
				justifyContent: "space-between",
			}}
		>
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<div className="franchise__link" key={index}>
							<div className="franchise__img">
								<Skeleton width={180} height={180} />
							</div>
							<ul className="franchise__info">
								<li className="franchise__item-top">
									<Skeleton width={140} height={20} />
								</li>
								<div className="franchise__item-bottom">
									<li>
										<Skeleton
											style={{
												marginBottom: 5,
												width: 100,
												height: 20,
											}}
										/>
										<Skeleton
											style={{
												width: 100,
												height: 20,
											}}
										/>
									</li>
								</div>
							</ul>
						</div>
					)
				})}
		</ul>
	)
}
