import Skeleton from "react-loading-skeleton"

export const ScheduleSkeleton = ({ count }) => {
	return (
		<>
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="schedule__item" key={index}>
							<div className="schedule__link">
								<div className="schedule__container">
									<Skeleton
										className="skeleton__background"
										style={{ width: 40, height: 60 }}
									/>
									<div>
										<Skeleton
											className="skeleton__background"
											style={{ width: 70, height: 14 }}
										/>
										<Skeleton
											className="skeleton__background"
											style={{ width: 40, height: 14 }}
										/>
									</div>
								</div>
								<div>
									<Skeleton
										className="skeleton__background"
										style={{ width: 80, height: 14 }}
									/>
									<Skeleton
										className="skeleton__background"
										style={{ width: 80, height: 14 }}
									/>
								</div>
							</div>
						</li>
					)
				})}
		</>
	)
}
