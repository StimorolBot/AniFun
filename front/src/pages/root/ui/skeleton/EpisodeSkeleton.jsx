import Skeleton from "react-loading-skeleton"

export const EpisodeSkeleton = ({ count }) => {
	const heightSkeleton = 25
	const widthSkeleton = 50

	return (
		<>
			{Array.from({ length: count }).map((_, index) => {
				return (
					<tr className="root-title__item transition" key={index}>
						<td>
							<Skeleton style={{ height: heightSkeleton }} />
						</td>
						<td>
							<Skeleton style={{ height: heightSkeleton }} />
						</td>
						<td>
							<Skeleton style={{ height: heightSkeleton }} />
						</td>

						<td>
							<Skeleton style={{ height: heightSkeleton }} />
						</td>
						<td>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									gap: 20,
								}}
							>
								<Skeleton
									style={{
										height: heightSkeleton,
										width: widthSkeleton,
									}}
								/>
								<Skeleton
									style={{
										height: heightSkeleton,
										width: widthSkeleton,
									}}
								/>
							</div>
						</td>
					</tr>
				)
			})}
		</>
	)
}
