import Skeleton from "react-loading-skeleton"

export const TitleScheduleSkeleton = ({ count }) => {
	return (
		<>
			{Array(count)
				.fill(0)
				.map((_, index) => {
					return (
						<li className="title-schedule__item" key={index}>
							<Skeleton width={80} height={25} />
							<Skeleton width={140} height={25} />
							<div style={{ textAlign: "end" }}>
								<Skeleton width={110} height={25} />
								<Skeleton width={80} height={25} />
							</div>
						</li>
					)
				})}
		</>
	)
}
