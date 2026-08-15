import Skeleton from "react-loading-skeleton"

export const EpisodeSkeleton = ({ count }) => {
	return (
		<>
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="episode__item" key={index}>
							<Skeleton className="episode__img" />
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "space-between",
									alignItems: "center",
									height: "100%",
									padding: "0 8px 12px 8px",
								}}
							>
								<Skeleton
									className="skeleton__background"
									style={{ width: 87, height: 24 }}
								/>
								<Skeleton
									className="skeleton__background"
									style={{ width: 170, height: 50 }}
								/>
								<div>
									<ul className="episode__desc-list">
										<Skeleton
											className="skeleton__background"
											style={{ width: 30, height: 14 }}
										/>
										<Skeleton
											className="skeleton__background"
											style={{ width: 30, height: 14 }}
										/>
										<Skeleton
											className="skeleton__background"
											style={{ width: 30, height: 14 }}
										/>
									</ul>
									<ul
										className="episode__desc-list"
										style={{ marginTop: 5 }}
									>
										<Skeleton
											className="skeleton__background"
											style={{ width: 50, height: 14 }}
										/>
										<Skeleton
											className="skeleton__background"
											style={{ width: 50, height: 14 }}
										/>
									</ul>
								</div>
								<Skeleton
									className="skeleton__background"
									style={{ width: 110, height: 30 }}
								/>
							</div>
						</li>
					)
				})}
		</>
	)
}
