import Skeleton from "react-loading-skeleton"

export const TitleFranchiseSkeleton = ({ count }) => {
	return (
		<>
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className={"title-franchise__item"} key={index}>
							<div className="title-franchise__link">
								<div className="title-franchise__container">
									<div className="title-franchise__img">
										<Skeleton width={125} height={187} />
									</div>
									<div className="title-franchise__desc">
										<Skeleton width={400} height={45} />
										<Skeleton width={305} height={40} />
									</div>
								</div>
								<Skeleton width={45} height={45} />
							</div>
						</li>
					)
				})}
		</>
	)
}
