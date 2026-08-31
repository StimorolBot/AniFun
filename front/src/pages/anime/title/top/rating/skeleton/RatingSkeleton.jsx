import Skeleton from "react-loading-skeleton"

export const RatingSkeleton = () => {
	return (
		<>
			<div className="rating__top">
				<Skeleton width={60} height={60} />
				<div>
					<Skeleton width={250} height={25} />
					<Skeleton
						width={200}
						height={20}
						style={{ marginTop: 10 }}
					/>
				</div>
			</div>
			<ul className="rating__stat-list">
				{Array.from({ length: 10 }, (_, index) => {
					return (
						<li key={index}>
							<Skeleton width={40} height={20} />
							<Skeleton
								width={180}
								height={20}
								style={{ marginTop: 5 }}
							/>
							<Skeleton width={45} height={20} />
						</li>
					)
				})}
			</ul>
		</>
	)
}
