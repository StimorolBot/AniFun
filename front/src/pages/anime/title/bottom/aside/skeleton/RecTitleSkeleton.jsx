import Skeleton from "react-loading-skeleton"

export const RecTitleSkeleton = ({ count }) => {
	return (
		<>
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="rec-title__item" key={index}>
							<div className="rec-title__link">
								<div className="rec-title__img">
									<Skeleton height={195} width={130} />
								</div>
								<Skeleton style={{ marginTop: "10px" }} />
								<Skeleton width={100} />
							</div>
						</li>
					)
				})}
		</>
	)
}
